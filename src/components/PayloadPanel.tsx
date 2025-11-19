import type { CardValues } from "../lib/card-utils";

interface PayloadPanelProps {
  payload: CardValues & { issuer: string };
}

const PAYLOAD_FIELDS: Array<{ key: keyof (CardValues & { issuer: string }); label: string }> = [
  { key: "name", label: "Cardholder" },
  { key: "number", label: "Card number" },
  { key: "expiry", label: "Expiry" },
  { key: "cvc", label: "Security code" },
  { key: "issuer", label: "Issuer" }
];

export default function PayloadPanel({ payload }: PayloadPanelProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-lg shadow-black/30">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.32em] text-accent-100/80">Payment payload</p>
        <h2 className="text-lg font-semibold text-slate-100">Submitted data</h2>
        <p className="text-xs text-slate-400/90">
          Mirror this payload in your API request to confirm the integration is working as expected.
        </p>
      </header>
      <dl className="grid gap-4 sm:grid-cols-2">
        {PAYLOAD_FIELDS.map(field => (
          <div key={field.key} className="space-y-1 rounded-2xl border border-white/10 bg-surface-soft/70 p-4">
            <dt className="text-xs uppercase tracking-[0.24em] text-slate-400">{field.label}</dt>
            <dd className="font-mono text-base font-medium text-slate-100">{payload[field.key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
