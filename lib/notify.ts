import { supabaseAdmin } from "@/lib/supabase-admin";

const ALERT_TIMEOUT_MS = 4000;

type Alert = {
  type: "registration" | "booking" | "contact" | "support" | "join" | "general";
  title: string;
  message: string;
  link: string;
};

async function record(channel: string, status: string, summary: string, error?: string) {
  const { error: insertError } = await supabaseAdmin.from("notification_log").insert({
    channel,
    status,
    summary: summary.slice(0, 240),
    error: error ? error.slice(0, 500) : null,
  });
  if (insertError) console.error("notification_log insert failed", insertError.message);
}

async function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timed out")), ms);
  });
  try {
    return await Promise.race([work, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function sendWhatsApp(message: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) {
    await record("whatsapp", "skipped", "CallMeBot is not configured");
    return;
  }
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apikey)}`;
  const response = await withTimeout(fetch(url), ALERT_TIMEOUT_MS);
  if (!response.ok) throw new Error(`CallMeBot responded ${response.status}`);
  await record("whatsapp", "sent", message);
}

async function sendEmail(title: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    await record("email", "skipped", "Resend is not configured");
    return;
  }
  const to = process.env.NOTIFY_EMAIL || "themadinacourt@gmail.com";
  const from = process.env.RESEND_FROM || "Madina Basketball <onboarding@resend.dev>";
  const response = await withTimeout(
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject: title, text: message }),
    }),
    ALERT_TIMEOUT_MS
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body.slice(0, 300) || `Resend responded ${response.status}`);
  }
  await record("email", "sent", title);
}

export async function notifyAdmins(alert: Alert) {
  const { error } = await supabaseAdmin.from("admin_notifications").insert({
    type: alert.type,
    title: alert.title,
    message: alert.message,
    link: alert.link,
  });
  if (error) {
    console.error("admin notification insert failed", error.message);
    await record("in_app", "failed", alert.title, error.message);
  } else {
    await record("in_app", "sent", alert.title);
  }

  const jobs = [
    sendWhatsApp(alert.message).catch(async (error: unknown) => {
      const message = error instanceof Error ? error.message : "WhatsApp alert failed";
      await record("whatsapp", "failed", alert.title, message);
    }),
    sendEmail(alert.title, alert.message).catch(async (error: unknown) => {
      const message = error instanceof Error ? error.message : "Email alert failed";
      await record("email", "failed", alert.title, message);
    }),
  ];
  await Promise.all(jobs);
}
