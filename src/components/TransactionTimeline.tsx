import clsx from "clsx";
import { formatIssuerLabel, getBrandTheme } from "../lib/card-utils";

interface TransactionItem {
  id: string;
  merchant: string;
  amount: string;
  status: "captured" | "pending" | "declined";
  brand: string | null;
  time: string;
  descriptor: string;
}

const TRANSACTIONS: TransactionItem[] = [
  {
    id: "txn_01",
    merchant: "Lumen Coffee",
    amount: "-$12.40",
    status: "captured",
    brand: "visa",
    time: "2 min ago",
    descriptor: "Card-present"
  },
  {
    id: "txn_02",
    merchant: "Nova SaaS",
    amount: "-$128.00",
    status: "pending",
    brand: "mastercard",
    time: "12 min ago",
    descriptor: "Subscription"
  },
  {
    id: "txn_03",
    merchant: "Orbit Airlines",
    amount: "-$864.90",
    status: "captured",
    brand: "amex",
    time: "1 hr ago",
    descriptor: "3D secure"
  },
  {
    id: "txn_04",
    merchant: "Atlas Groceries",
    amount: "-$46.23",
    status: "declined",
    brand: "discover",
    time: "3 hr ago",
    descriptor: "Issuer declined"
  }
];

const STATUS_LABELS: Record<TransactionItem["status"], string> = {
  captured: "Captured",
  pending: "Pending",
  declined: "Declined"
};

const STATUS_COLORS: Record<TransactionItem["status"], string> = {
  captured: "text-emerald-300",
  pending: "text-amber-300",
  declined: "text-rose-300"
};

interface TransactionTimelineProps {
  className?: string;
}

export default function TransactionTimeline({ className }: TransactionTimelineProps) {
  return (
    <section
      className={clsx(
        "rounded-3xl border border-white/10 bg-surface-soft/80 p-6 text-slate-200 shadow-xl shadow-black/40 backdrop-blur-xl",
        className
      )}
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.32em] text-accent-100/80">Live feed</p>
        <h2 className="text-xl font-semibold text-white">Recent authorisations</h2>
        <p className="text-sm text-slate-400/90">Monitor transaction health while customers complete the form.</p>
      </header>
      <ul className="mt-6 space-y-3">
        {TRANSACTIONS.map(item => {
          const theme = getBrandTheme(item.brand);
          return (
            <li key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.2)]"
                style={{
                  background: theme
                    ? `linear-gradient(135deg, ${theme.gradient.from}, ${theme.gradient.to})`
                    : "linear-gradient(135deg, #1f2937, #0f172a)"
                }}
              >
                {item.brand ? formatIssuerLabel(item.brand).slice(0, 1) : "?"}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-white">{item.merchant}</p>
                  <p className="text-sm font-semibold text-white">{item.amount}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400/90">
                  <span className="rounded-full border border-white/10 px-2 py-1 text-[0.65rem] uppercase tracking-[0.28em]">
                    {item.descriptor}
                  </span>
                  <span className={clsx("font-semibold", STATUS_COLORS[item.status])}>{STATUS_LABELS[item.status]}</span>
                  <span>{item.time}</span>
                  {item.brand && (
                    <span className="text-slate-400/80">{formatIssuerLabel(item.brand)} network</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
