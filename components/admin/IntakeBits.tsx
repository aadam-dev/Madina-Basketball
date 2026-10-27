import Link from "next/link";

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
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link
        href={base}
        className={`rounded-full px-3 py-1.5 text-sm ${!current ? "bg-primary text-white" : "border bg-white text-gray-700"}`}
      >
        All
      </Link>
      {options.map((option) => (
        <Link
          key={option.value}
          href={`${base}${joiner}${param}=${option.value}`}
          className={`rounded-full px-3 py-1.5 text-sm ${
            current === option.value ? "bg-primary text-white" : "border bg-white text-gray-700"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
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
  return (
    <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {missing
        ? "Run scripts/APPLY_MADINA_OPS.sql in the Madina Supabase SQL editor, then reload."
        : message}
    </p>
  );
}

export function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="py-2 border-b border-gray-100">
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-gray-900 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
