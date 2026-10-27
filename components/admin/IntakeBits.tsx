import Link from "next/link";

export function PageHeader({
  title,
  description,
  aside,
}: {
  title: string;
  description?: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {aside}
    </header>
  );
}

export function FilterLinks({
  base,
  current,
  options,
  param = "status",
}: {
  base: string;
  current?: string;
  options: { value: string; label: string }[];
  param?: string;
}) {
  const joiner = base.includes("?") ? "&" : "?";
  const pill = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-950"
    }`;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Link href={base} className={pill(!current)}>
        All
      </Link>
      {options.map((option) => (
        <Link
          key={option.value}
          href={`${base}${joiner}${param}=${option.value}`}
          className={pill(current === option.value)}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  new: "bg-amber-50 text-amber-800 ring-amber-200",
  open: "bg-amber-50 text-amber-800 ring-amber-200",
  requested: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  accepted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  received: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pledged: "bg-sky-50 text-sky-800 ring-sky-200",
  in_progress: "bg-sky-50 text-sky-800 ring-sky-200",
  in_conversation: "bg-sky-50 text-sky-800 ring-sky-200",
  waitlist: "bg-violet-50 text-violet-800 ring-violet-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  declined: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] || "bg-slate-100 text-slate-700 ring-slate-200";
  const label = status.replaceAll("_", " ");
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${tone}`}>
      {label}
    </span>
  );
}

export function SetupNotice({ message }: { message?: string }) {
  if (!message) return null;
  const missing =
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("role_applications") ||
    message.includes("keepalive") ||
    message.includes("site_visits");
  const unreachable = message.includes("fetch failed") || message.includes("Could not reach Supabase") || message.includes("ENOTFOUND");
  return (
    <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {missing
        ? "The operations tables are missing. Run scripts/APPLY_MADINA_OPS.sql in the Madina Supabase SQL editor, then reload."
        : unreachable
          ? "The server could not reach Supabase. Confirm NEXT_PUBLIC_SUPABASE_URL and the service role key, then redeploy."
          : message}
    </p>
  );
}

export function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export const tableWrap = "overflow-hidden rounded-2xl border border-slate-200 bg-white";
export const tableHead = "bg-slate-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400";
export const th = "px-4 py-3 font-semibold";
export const td = "px-4 py-3.5 align-middle text-slate-700";
export const tr = "border-t border-slate-100 transition-colors hover:bg-slate-50/80";

export function EmptyRow({ cols, children }: { cols: number; children: React.ReactNode }) {
  return (
    <tr>
      <td className="px-4 py-12 text-center text-sm text-slate-400" colSpan={cols}>
        {children}
      </td>
    </tr>
  );
}

export function nameLink(className = "") {
  return `font-medium text-slate-950 underline-offset-4 hover:text-primary hover:underline ${className}`;
}
