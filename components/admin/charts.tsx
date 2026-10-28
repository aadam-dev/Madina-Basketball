import Link from "next/link";
import type { NamedCount } from "@/lib/analytics";

export function Metric({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-950">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </>
  );
  const className =
    "rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300";
  if (href) {
    return (
      <Link href={href} className={`block ${className}`}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
}

export function BarChart({
  title,
  rows,
  empty = "No data yet",
}: {
  title: string;
  rows: NamedCount[];
  empty?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate capitalize text-slate-700">{row.name.replaceAll("_", " ")}</span>
                <span className="tabular-nums font-medium text-slate-950">{row.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function SplitList({
  title,
  rows,
  empty = "No data yet",
}: {
  title: string;
  rows: NamedCount[];
  empty?: string;
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">{empty}</p>
      ) : (
        <>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
            {rows.map((row, index) => (
              <div
                key={row.name}
                className={index % 2 === 0 ? "bg-primary" : "bg-slate-900"}
                style={{ width: `${(row.value / total) * 100}%`, opacity: 1 - index * 0.12 }}
                title={`${row.name}: ${row.value}`}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {rows.map((row) => (
              <li key={row.name} className="flex justify-between gap-3">
                <span className="capitalize text-slate-600">{row.name.replaceAll("_", " ")}</span>
                <span className="tabular-nums font-medium text-slate-950">
                  {row.value}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    {Math.round((row.value / total) * 100)}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export function TrendBars({
  title,
  rows,
}: {
  title: string;
  rows: NamedCount[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-400">No signups yet.</p>
      ) : (
        <div className="mt-5 flex h-36 items-end gap-2">
          {rows.map((row) => (
            <div key={row.name} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span className="text-[10px] tabular-nums text-slate-500">{row.value || ""}</span>
              <div
                className="w-full rounded-t-md bg-primary/90"
                style={{ height: `${Math.max(row.value ? 8 : 2, (row.value / max) * 100)}%` }}
                title={`${row.name}: ${row.value}`}
              />
              <span className="w-full truncate text-center text-[10px] text-slate-400">
                {row.name.slice(5)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
