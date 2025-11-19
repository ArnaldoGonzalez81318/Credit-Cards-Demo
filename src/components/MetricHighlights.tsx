import clsx from "clsx";

const METRIC_ITEMS = [
  {
    label: "Conversion uplift",
    value: "+18%",
    description: "Checkout completion within the first session after enabling live validation.",
    trend: "+4.2 pts vs Q3",
    accent: "#34d399",
    glow: "radial-gradient(circle at top, rgba(52,211,153,0.35), rgba(15,23,42,0))"
  },
  {
    label: "Form time saved",
    value: "42s",
    description: "Average reduction in manual entry per card thanks to auto-formatting.",
    trend: "-26s vs baseline",
    accent: "#38bdf8",
    glow: "radial-gradient(circle at top, rgba(56,189,248,0.35), rgba(15,23,42,0))"
  },
  {
    label: "Charge success",
    value: "98.4%",
    description: "Approved transactions after automated card verification rules.",
    trend: "+1.1 pts month over month",
    accent: "#fbbf24",
    glow: "radial-gradient(circle at top, rgba(251,191,36,0.35), rgba(15,23,42,0))"
  }
];

interface MetricHighlightsProps {
  className?: string;
}

export default function MetricHighlights({ className }: MetricHighlightsProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-6 text-slate-200 shadow-xl shadow-black/40 backdrop-blur-md",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent" aria-hidden />
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.32em] text-accent-100/80">Performance</p>
        <h2 className="text-xl font-semibold text-white">Impact your team can measure</h2>
      </header>
      <dl className="mt-6 grid gap-5 sm:grid-cols-3">
        {METRIC_ITEMS.map(item => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-[0_18px_50px_rgba(8,15,35,0.35)] transition duration-200 hover:-translate-y-1 hover:border-white/20"
          >
            <span className="pointer-events-none absolute -top-6 right-0 h-28 w-28 opacity-70 blur-3xl" style={{ background: item.glow }} aria-hidden />
            <div className="relative flex items-center justify-between text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
              <dt>{item.label}</dt>
              <span className="font-medium" style={{ color: item.accent }}>
                {item.trend}
              </span>
            </div>
            <dd className="relative mt-5 text-4xl font-semibold text-white">{item.value}</dd>
            <p className="relative mt-3 text-xs text-slate-300/90">{item.description}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
