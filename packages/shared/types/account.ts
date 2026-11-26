// More tab: business wallet, One-Tab add-on, settings, help.

export type WalletTransaction = {
  id: string;
  kind: "topup" | "campaign" | "sms" | "ai" | "addon" | "sponsored";
  title: string;
  /** Positive for top-ups, negative for spend. */
  amount: number;
  date: string;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
};

export type OneTabStep = {
  label: string;
  detail: string;
  date?: string;
  done: boolean;
};

export type NfcTag = {
  id: string;
  location: string;
  status: "active" | "inactive";
  tapsThisMonth: number;
};

export type OneTabPage = {
  status: "not_started" | "in_review" | "approved" | "live";
  url: string;
  steps: OneTabStep[];
  nfcTags: NfcTag[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};
