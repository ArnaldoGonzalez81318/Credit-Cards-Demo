import clsx from "clsx";
import { SUPPORTED_CARD_BRANDS } from "../lib/card-utils";

interface SupportedCardsProps {
  className?: string;
}

export default function SupportedCards({ className }: SupportedCardsProps) {
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-6 text-sm text-slate-300 shadow-xl shadow-black/35 backdrop-blur-md",
        className
      )}
    >
      <div className="pointer-events-none absolute -left-10 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.25),rgba(15,23,42,0))] blur-3xl" aria-hidden />
      <header className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Accepted brands</p>
          <h2 className="text-xl font-semibold text-slate-100">Supported cards</h2>
          <p className="text-xs text-slate-400/90">
            Global networks ready for tokenisation, tap-to-pay and cross-border settlement out of the box.
          </p>
        </div>
        <span className="text-xs text-slate-400/80">{SUPPORTED_CARD_BRANDS.length} networks</span>
      </header>
      <ul className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SUPPORTED_CARD_BRANDS.map(brand => (
          <li
            key={brand.code}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-4 transition duration-200 hover:-translate-y-1 hover:border-accent-200/40 hover:shadow-[0_20px_50px_rgba(8,15,35,0.35)]"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background: brand.gradient.via
                  ? `linear-gradient(135deg, ${brand.gradient.from}, ${brand.gradient.via}, ${brand.gradient.to})`
                  : `linear-gradient(135deg, ${brand.gradient.from}, ${brand.gradient.to})`
              }}
              aria-hidden
            />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(8,15,35,0.3)]">
                  {brand.code.slice(0, 1).toUpperCase()}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-50">{brand.label}</span>
                  <span className="text-xs text-slate-300/90">BIN {brand.binPrefix}</span>
                </div>
              </div>
              <span
                className="rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.35)]"
                style={{ background: brand.accent }}
              >
                {brand.code}
              </span>
            </div>
            <div className="relative mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.22em] text-slate-200/70">
              <span className="rounded-full border border-white/20 px-2 py-1 text-[0.6rem] tracking-[0.24em] text-slate-100/80">
                PCI ready
              </span>
              <span className="text-slate-300/80">Global coverage</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
