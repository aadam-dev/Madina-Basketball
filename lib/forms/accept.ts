import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { fieldErrors } from "./schemas";
import { clientIp, rateLimit } from "./rate-limit";
import { notifyAdmins } from "@/lib/notify";

type Alert = {
  type: "registration" | "booking" | "contact" | "support" | "join";
  title: string;
  message: string;
  link: string;
};

type Parser<T> = {
  safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: ZodError };
};

export async function acceptPublicForm<T>(
  request: NextRequest,
  options: {
    route: string;
    schema: Parser<T>;
    save: (data: T) => Promise<string>;
    alert: (data: T, id: string) => Alert;
  }
) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const honeypot = typeof body.website === "string" ? body.website.trim() : "";
  const startedAt = typeof body.started_at === "number" ? body.started_at : 0;
  if (honeypot || (startedAt > 0 && Date.now() - startedAt < 2000)) {
    return NextResponse.json({ ok: true });
  }

  if (!rateLimit(`${options.route}:${clientIp(request)}`)) {
    return NextResponse.json(
      { error: "Too many submissions. Wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Check the form and try again.",
        fieldErrors: fieldErrors(parsed.error as ZodError),
      },
      { status: 400 }
    );
  }

  try {
    const id = await options.save(parsed.data);
    const alert = options.alert(parsed.data, id);
    await notifyAdmins(alert);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the form.";
    console.error(`${options.route} save failed`, message);
    const missing = /relation|does not exist|schema cache/i.test(message);
    return NextResponse.json(
      {
        error: missing
          ? "The form is not ready yet. Please try WhatsApp while we finish setup."
          : "We could not save that. Please try again, or reach us on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
