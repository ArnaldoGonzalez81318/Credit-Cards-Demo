import Payment from "payment";

export type CardField = "number" | "name" | "expiry" | "cvc";

export interface CardValues {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export type CardErrors = Partial<Record<CardField, string>>;

export interface CardBrand {
  code: string;
  label: string;
  binPrefix: string;
  gradient: {
    from: string;
    via?: string;
    to: string;
  };
  accent: string;
}

const NUMBER_PLACEHOLDER = "•••• •••• •••• ••••";
const EXPIRY_PLACEHOLDER = "••/••";
const CVC_PLACEHOLDER = "•••";

export const INITIAL_VALUES: CardValues = {
  number: "",
  name: "",
  expiry: "",
  cvc: ""
};

export const SUPPORTED_CARD_BRANDS: CardBrand[] = [
  {
    code: "visa",
    label: "Visa",
    binPrefix: "4",
    gradient: { from: "#0f1b61", via: "#1d4ed8", to: "#60a5fa" },
    accent: "#60a5fa"
  },
  {
    code: "mastercard",
    label: "Mastercard",
    binPrefix: "51-55",
    gradient: { from: "#311428", via: "#be123c", to: "#fb923c" },
    accent: "#fb923c"
  },
  {
    code: "amex",
    label: "American Express",
    binPrefix: "34, 37",
    gradient: { from: "#0f172a", via: "#2563eb", to: "#38bdf8" },
    accent: "#38bdf8"
  },
  {
    code: "discover",
    label: "Discover",
    binPrefix: "6011",
    gradient: { from: "#2f1728", via: "#f59e0b", to: "#f97316" },
    accent: "#f97316"
  },
  {
    code: "jcb",
    label: "JCB",
    binPrefix: "3528-3589",
    gradient: { from: "#1e213e", via: "#22c55e", to: "#38bdf8" },
    accent: "#22c55e"
  },
  {
    code: "dinersclub",
    label: "Diners Club",
    binPrefix: "300-305",
    gradient: { from: "#0f172a", via: "#4c1d95", to: "#7c3aed" },
    accent: "#7c3aed"
  }
];

export const CARD_BRAND_LOOKUP = SUPPORTED_CARD_BRANDS.reduce<Record<string, CardBrand>>((acc, brand) => {
  acc[brand.code] = brand;
  return acc;
}, {});

export function clearNumber(value: string): string {
  return value.replace(/\D+/g, "");
}

export function formatCardNumber(value: string): string {
  if (!value) {
    return value;
  }

  const rawDigits = clearNumber(value);
  const issuer = Payment.fns.cardType(rawDigits);
  const maxLength = issuer === "amex" ? 15 : issuer === "dinersclub" ? 14 : 16;
  const clearValue = rawDigits.slice(0, maxLength);

  switch (issuer) {
    case "amex":
      return `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`.trim();
    case "dinersclub":
      return `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`.trim();
    default:
      return `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 16)}`.trim();
  }
}

export function formatExpiry(value: string): string {
  const clearValue = clearNumber(value);

  if (clearValue.length === 0) {
    return "";
  }

  if (clearValue.length <= 2) {
    return clearValue;
  }

  return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
}

export function formatCvc(value: string, cardNumber: string): string {
  const clearValue = clearNumber(value);
  const issuer = Payment.fns.cardType(cardNumber);
  const maxLength = issuer === "amex" ? 4 : 3;

  return clearValue.slice(0, maxLength);
}

export function getCardIssuer(cardNumber: string): string | null {
  const issuer = Payment.fns.cardType(cardNumber);
  return issuer || null;
}

export function maskCardNumber(value: string): string {
  if (!value) {
    return NUMBER_PLACEHOLDER;
  }

  const padded = `${value}${NUMBER_PLACEHOLDER}`.slice(0, NUMBER_PLACEHOLDER.length);
  return padded;
}

export function maskExpiry(value: string): string {
  if (!value) {
    return EXPIRY_PLACEHOLDER;
  }

  const base = `${value}${EXPIRY_PLACEHOLDER}`.slice(0, EXPIRY_PLACEHOLDER.length);
  return base;
}

export function maskCvc(value: string, cardNumber: string): string {
  const issuer = getCardIssuer(cardNumber);
  const placeholder = issuer === "amex" ? "••••" : CVC_PLACEHOLDER;
  if (!value) {
    return placeholder;
  }

  return `${value}${placeholder}`.slice(0, placeholder.length);
}

export function normaliseName(value: string): string {
  if (!value.trim()) {
    return "YOUR NAME HERE";
  }

  return value.trim().slice(0, 26).toUpperCase();
}

export function validateCardValues(values: CardValues): CardErrors {
  const errors: CardErrors = {};

  if (!values.number.trim()) {
    errors.number = "Card number is required";
  } else if (!Payment.fns.validateCardNumber(clearNumber(values.number))) {
    errors.number = "Enter a valid card number";
  }

  if (!values.name.trim()) {
    errors.name = "Name on card is required";
  } else if (values.name.trim().length < 3) {
    errors.name = "Please enter the full cardholder name";
  }

  if (!values.expiry.trim()) {
    errors.expiry = "Expiry date is required";
  } else {
    const [month, year] = values.expiry.split("/");
    if (!Payment.fns.validateCardExpiry(month, year)) {
      errors.expiry = "Use MM/YY format";
    }
  }

  if (!values.cvc.trim()) {
    errors.cvc = "Security code is required";
  } else if (!Payment.fns.validateCardCVC(values.cvc, getCardIssuer(values.number) || undefined)) {
    errors.cvc = "Enter a valid security code";
  }

  return errors;
}

export function hasErrors(errors: CardErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function formatIssuerLabel(issuer: string | null): string {
  if (!issuer) {
    return "Unknown";
  }

  return issuer.replace(/_/g, " ").toUpperCase();
}

export function getBrandTheme(issuer: string | null) {
  if (!issuer) {
    return undefined;
  }

  return CARD_BRAND_LOOKUP[issuer] ?? undefined;
}
