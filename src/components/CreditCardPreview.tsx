import clsx from "clsx";
import { formatIssuerLabel, getBrandTheme, maskCardNumber, maskCvc, maskExpiry, normaliseName } from "../lib/card-utils";
import type { CardField } from "../lib/card-utils";

interface CardGradient {
  from: string;
  to: string;
}

export interface CreditCardPreviewProps {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  issuer: string | null;
  focusedField?: CardField | "";
  size?: "lg" | "sm";
  allowFlip?: boolean;
  gradient?: CardGradient;
}

const DEFAULT_GRADIENT: CardGradient = {
  from: "rgba(29, 78, 216, 0.98)",
  to: "rgba(14, 165, 233, 0.82)"
};

export function CreditCardPreview({
  number,
  name,
  expiry,
  cvc,
  issuer,
  focusedField = "",
  size = "lg",
  allowFlip = true,
  gradient
}: CreditCardPreviewProps) {
  const isCompact = size === "sm";
  const showBack = allowFlip && focusedField === "cvc";
  const brandTheme = getBrandTheme(issuer);
  const gradientColors =
    gradient ??
    (brandTheme
      ? {
        from: brandTheme.gradient.from,
        to: brandTheme.gradient.to
      }
      : DEFAULT_GRADIENT);
  const gradientVia = brandTheme?.gradient.via;

  const wrapperClasses = clsx(
    "relative w-full",
    isCompact ? "max-w-[360px]" : "max-w-[440px]"
  );
  const cardHeight = isCompact ? 200 : 240;
  const numberClasses = clsx(
    "tracking-[0.18em] text-slate-50",
    isCompact ? "text-[1.2rem]" : "text-[1.45rem]"
  );
  const nameClasses = clsx("text-slate-200", isCompact ? "text-sm" : "text-base");
  const expiryClasses = clsx("text-slate-200", isCompact ? "text-sm" : "text-base");

  return (
    <div className={wrapperClasses}>
      <div className="relative w-full" style={{ height: `${cardHeight}px` }}>
        <div className="relative h-full w-full perspective-[1600px]">
          <div
            className="relative h-full w-full transition-transform duration-500 transform-3d"
            style={{ transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-white/20 p-6 text-slate-100 shadow-card-soft"
              style={{
                backfaceVisibility: "hidden",
                background: gradientVia
                  ? `linear-gradient(135deg, ${gradientColors.from}, ${gradientVia}, ${gradientColors.to})`
                  : `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`
              }}
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/80">
                  {formatIssuerLabel(issuer)}
                </span>
                <span
                  className="h-8 w-12 rounded-md opacity-80"
                  style={{
                    background: brandTheme
                      ? `linear-gradient(135deg, ${brandTheme.accent}, ${brandTheme.gradient.to})`
                      : "rgba(255,255,255,0.85)"
                  }}
                  aria-hidden
                />
              </div>

              <div className="space-y-6">
                <p className={numberClasses}>{maskCardNumber(number)}</p>
                <div className="flex items-end justify-between text-xs uppercase tracking-[0.22em] text-slate-200/80">
                  <div className="space-y-1">
                    <span className="block text-[0.65rem]">Cardholder</span>
                    <span className={nameClasses}>{normaliseName(name)}</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="block text-[0.65rem]">Valid thru</span>
                    <span className={expiryClasses}>{maskExpiry(expiry)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute inset-0 rounded-3xl border border-white/10 bg-linear-to-br from-teal-600 via-cyan-500 to-sky-500 p-6 text-slate-100 shadow-card-soft"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: gradientVia
                  ? `linear-gradient(135deg, ${gradientColors.from}, ${gradientVia}, ${gradientColors.to})`
                  : `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.to})`
              }}
            >
              <div className="flex h-full w-full flex-col">
                <span className="relative -mx-6 mb-6 block h-14 bg-linear-to-r from-slate-900/95 via-slate-900/60 to-slate-900/90 shadow-inner"></span>
                <div className="relative flex flex-1 items-center justify-between">
                  <div className="relative h-16 flex-1 rounded-md border border-slate-900/40 bg-linear-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900 shadow-inner">
                    <span className="pointer-events-none absolute -top-5 right-3 text-[0.55rem] font-semibold tracking-[0.28em] text-slate-900/50">
                      CVV
                    </span>
                    <span className="absolute inset-y-0 left-4 flex items-center text-base font-semibold tracking-[0.2em] text-slate-800">
                      {maskCvc(cvc, number)}
                    </span>
                  </div>
                  <span
                    className="ml-6 rounded-md px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-100/80"
                    style={{
                      background: brandTheme ? brandTheme.accent : "rgba(15,23,42,0.85)",
                      boxShadow: brandTheme ? `0 0 10px ${brandTheme.accent}66` : undefined
                    }}
                  >
                    {formatIssuerLabel(issuer)}
                  </span>
                </div>
                <p className="mt-auto text-[0.55rem] uppercase tracking-[0.3em] text-slate-900/70">
                  Authorized Signature
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditCardPreview;
