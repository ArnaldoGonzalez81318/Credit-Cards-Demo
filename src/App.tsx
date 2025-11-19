import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";

import CreditCardPreview from "./components/CreditCardPreview.tsx";
import SupportedCards from "./components/SupportedCards.tsx";
import PayloadPanel from "./components/PayloadPanel.tsx";
import MetricHighlights from "./components/MetricHighlights.tsx";
import TransactionTimeline from "./components/TransactionTimeline.tsx";
import {
  CardErrors,
  CardField,
  CardValues,
  INITIAL_VALUES,
  formatCardNumber,
  formatCvc,
  formatExpiry,
  formatIssuerLabel,
  getCardIssuer,
  hasErrors,
  maskCvc,
  validateCardValues
} from "./lib/card-utils";

type TouchedMap = Record<CardField, boolean>;

type SubmissionPayload = CardValues & { issuer: string };

const TOUCHED_DEFAULT: TouchedMap = {
  number: false,
  name: false,
  expiry: false,
  cvc: false
};

const FEATURE_LIST = [
  {
    title: "Smart formatting",
    copy: "Numbers, expiry and CVC auto-format as you type for fewer errors."
  },
  {
    title: "Issuer detection",
    copy: "Recognise card brands instantly to build trust with customers."
  },
  {
    title: "Helpful validation",
    copy: "Clear inline guidance keeps form completion rates high."
  }
];

const TRUSTED_BY = ["AtlasPay", "Riverbank", "Northwind", "Lumen"];

export default function App() {
  const [values, setValues] = useState<CardValues>(INITIAL_VALUES);
  const [focusedField, setFocusedField] = useState<CardField | "">("number");
  const [touched, setTouched] = useState<TouchedMap>(TOUCHED_DEFAULT);
  const [showValidation, setShowValidation] = useState(false);
  const [payload, setPayload] = useState<SubmissionPayload | null>(null);

  const issuer = useMemo(() => getCardIssuer(values.number), [values.number]);

  const errors: CardErrors = useMemo(() => validateCardValues(values), [values]);

  const displayErrors: CardErrors = useMemo(() => {
    const shouldShow = (field: CardField) => showValidation || touched[field];
    return {
      number: shouldShow("number") ? errors.number : undefined,
      name: shouldShow("name") ? errors.name : undefined,
      expiry: shouldShow("expiry") ? errors.expiry : undefined,
      cvc: shouldShow("cvc") ? errors.cvc : undefined
    };
  }, [errors, showValidation, touched]);

  const statusMessage = issuer
    ? `We detected a ${formatIssuerLabel(issuer)} card.`
    : "Start typing to detect the card provider automatically.";

  const handleChange = (field: CardField) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValues(prev => {
      const draft = { ...prev };
      if (field === "number") {
        draft.number = formatCardNumber(value);
      } else if (field === "expiry") {
        draft.expiry = formatExpiry(value);
      } else if (field === "cvc") {
        draft.cvc = formatCvc(value, prev.number);
      } else {
        draft.name = value;
      }
      return draft;
    });
    setPayload(null);
  };

  const handleFocus = (field: CardField) => () => {
    setFocusedField(field);
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: CardField) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateCardValues(values);
    if (hasErrors(validation)) {
      setShowValidation(true);
      setTouched({ number: true, name: true, expiry: true, cvc: true });
      return;
    }

    setShowValidation(false);
    setTouched(TOUCHED_DEFAULT);
    setPayload({ ...values, issuer: formatIssuerLabel(issuer) });
    setValues(INITIAL_VALUES);
    setFocusedField("number");
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setTouched(TOUCHED_DEFAULT);
    setFocusedField("number");
    setShowValidation(false);
    setPayload(null);
  };

  const renderFieldError = (field: CardField) => {
    const message = displayErrors[field];
    return (
      message && <p className="mt-2 text-sm font-medium text-rose-300">{message}</p>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),rgba(15,23,42,0))] blur-3xl" />
        <div className="absolute left-[20%] top-[40%] h-[420px] w-[420px] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(129,140,248,0.35),transparent)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(148,163,184,0.3),transparent)]" />
      </div>
      <main className="mx-auto w-full max-w-6xl space-y-16 px-6 pb-24 pt-16">
        <section className="space-y-12">
          <header className="space-y-7">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-accent-100">
              Payment demo
              <span className="inline-block h-2 w-2 rounded-full bg-accent-200 shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight sm:text-[2.8rem]">
                Ship a refined card checkout in minutes
              </h1>
              <p className="max-w-2xl text-base text-slate-300">
                Capture cardholder details with instant validation, issuer-aware formatting and a polished preview that mirrors your production experience.
              </p>
            </div>
            <ul className="flex flex-wrap gap-3 text-xs text-slate-400/90">
              {TRUSTED_BY.map(brand => (
                <li key={brand} className="rounded-full border border-white/5 bg-white/5 px-3 py-1 tracking-[0.28em]">
                  {brand}
                </li>
              ))}
            </ul>

            <dl className="grid gap-6 sm:grid-cols-3">
              {FEATURE_LIST.map(feature => (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                  <dt className="text-sm font-semibold text-slate-100">{feature.title}</dt>
                  <dd className="mt-2 text-sm text-slate-300/90">{feature.copy}</dd>
                </div>
              ))}
            </dl>
          </header>

          <MetricHighlights />

          <SupportedCards />
        </section>

        <section className="rounded-4xl border border-white/10 bg-surface-soft/80 p-8 shadow-[0_40px_120px_rgba(8,15,35,0.45)] backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(300px,0.85fr)_minmax(360px,1.1fr)] xl:grid-cols-[minmax(320px,0.9fr)_minmax(420px,1.15fr)]">
            <div className="space-y-6">
              <CreditCardPreview
                number={values.number}
                name={values.name}
                expiry={values.expiry}
                cvc={values.cvc}
                issuer={issuer}
                focusedField={focusedField}
              />
              <p className="text-sm text-slate-300/90">{statusMessage}</p>
            </div>

            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.26em] text-slate-300" htmlFor="card-number">
                  Card number
                </label>
                <input
                  id="card-number"
                  name="number"
                  value={values.number}
                  onChange={handleChange("number")}
                  onFocus={handleFocus("number")}
                  onBlur={handleBlur("number")}
                  className={clsx(
                    "w-full rounded-xl border bg-surface-soft/70 px-4 py-3 text-lg font-medium text-slate-100 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40",
                    displayErrors.number && "border-rose-400/80"
                  )}
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  maxLength={19}
                  required
                />
                {renderFieldError("number")}
              </div>

              <div className="grid gap-2">
                <label className="text-xs uppercase tracking-[0.26em] text-slate-300" htmlFor="card-name">
                  Name on card
                </label>
                <input
                  id="card-name"
                  name="name"
                  value={values.name}
                  onChange={handleChange("name")}
                  onFocus={handleFocus("name")}
                  onBlur={handleBlur("name")}
                  className={clsx(
                    "w-full rounded-xl border bg-surface-soft/70 px-4 py-3 text-lg font-medium text-slate-100 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40",
                    displayErrors.name && "border-rose-400/80"
                  )}
                  placeholder="Jane Appleseed"
                  autoComplete="cc-name"
                  required
                />
                {renderFieldError("name")}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.26em] text-slate-300" htmlFor="card-expiry">
                    Expiry
                  </label>
                  <input
                    id="card-expiry"
                    name="expiry"
                    value={values.expiry}
                    onChange={handleChange("expiry")}
                    onFocus={handleFocus("expiry")}
                    onBlur={handleBlur("expiry")}
                    className={clsx(
                      "w-full rounded-xl border bg-surface-soft/70 px-4 py-3 text-lg font-medium text-slate-100 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40",
                      displayErrors.expiry && "border-rose-400/80"
                    )}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    maxLength={5}
                    required
                  />
                  {renderFieldError("expiry")}
                </div>

                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.26em] text-slate-300" htmlFor="card-cvc">
                    CVC
                  </label>
                  <input
                    id="card-cvc"
                    name="cvc"
                    value={values.cvc}
                    onChange={handleChange("cvc")}
                    onFocus={handleFocus("cvc")}
                    onBlur={handleBlur("cvc")}
                    className={clsx(
                      "w-full rounded-xl border bg-surface-soft/70 px-4 py-3 text-lg font-medium text-slate-100 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40",
                      displayErrors.cvc && "border-rose-400/80"
                    )}
                    placeholder={maskCvc("", values.number)}
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                    required
                  />
                  {renderFieldError("cvc")}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-accent-100 via-accent-400 to-accent-600 px-6 py-3 font-semibold text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition hover:scale-[1.01] hover:shadow-xl focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-100 cursor-pointer"
                >
                  Save card
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-accent-100 transition hover:border-accent-400/60 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent-100 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {payload && (
            <div className="mt-10 lg:col-span-2">
              <PayloadPanel payload={payload} />
            </div>
          )}
        </section>

        <section>
          <TransactionTimeline />
        </section>
      </main>
    </div>
  );
}
