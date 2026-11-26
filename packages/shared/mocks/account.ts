import type { FaqItem, Invoice, OneTabPage, WalletTransaction } from "../types";

export const mockWalletTransactions: WalletTransaction[] = [
  { id: "wt_1", kind: "campaign", title: "Omakase Night · @nycbites payout", amount: -150, date: "Nov 26" },
  { id: "wt_2", kind: "sms", title: "SMS bundle · 1,000 messages", amount: -20, date: "Nov 24" },
  { id: "wt_3", kind: "sponsored", title: "Sponsored post · 3 days", amount: -15, date: "Nov 22" },
  { id: "wt_4", kind: "topup", title: "Wallet top-up", amount: 500, date: "Nov 20" },
  { id: "wt_5", kind: "ai", title: "AI review replies · November", amount: -12, date: "Nov 15" },
  { id: "wt_6", kind: "addon", title: "One-Tab landing page · monthly", amount: -29, date: "Nov 1" },
  { id: "wt_7", kind: "campaign", title: "Summer Sake Patio · featured listing", amount: -40, date: "Oct 28" },
  { id: "wt_8", kind: "topup", title: "Wallet top-up", amount: 1000, date: "Oct 12" },
];

/** Spend by category for the current month. */
export const mockWalletSpend: { label: string; amount: number }[] = [
  { label: "Campaigns", amount: 150 },
  { label: "Add-ons", amount: 29 },
  { label: "SMS & MMS", amount: 20 },
  { label: "Sponsored", amount: 15 },
  { label: "AI features", amount: 12 },
];

export const mockInvoices: Invoice[] = [
  { id: "inv_1", number: "INV-2026-0112", date: "Nov 26", description: "Campaign payout & platform fee", amount: 150 },
  { id: "inv_2", number: "INV-2026-0108", date: "Nov 24", description: "SMS bundle (1,000)", amount: 20 },
  { id: "inv_3", number: "INV-2026-0104", date: "Nov 20", description: "Wallet top-up", amount: 500 },
  { id: "inv_4", number: "INV-2026-0097", date: "Nov 1", description: "One-Tab landing page", amount: 29 },
];

export const mockWalletTopUps = [100, 250, 500, 1000];

export const mockOneTab: OneTabPage = {
  status: "live",
  url: "onetab.sparkr.app/tang-sushie",
  steps: [
    { label: "Setup form submitted", detail: "Business details, photos, menu and links", date: "Sep 2", done: true },
    { label: "Admin review", detail: "Sparkr approves within 5 business days", date: "Sep 5", done: true },
    { label: "Page set up & NFC tag mailed", detail: "Sparkr builds the page and ships your tags", date: "Sep 9", done: true },
    { label: "Live", detail: "Customers open your page with an NFC tap", date: "Sep 12", done: true },
  ],
  nfcTags: [
    { id: "nfc_1", location: "Storefront window", status: "active", tapsThisMonth: 214 },
    { id: "nfc_2", location: "Counter · cashier", status: "active", tapsThisMonth: 377 },
    { id: "nfc_3", location: "Table tents (×12)", status: "active", tapsThisMonth: 491 },
    { id: "nfc_4", location: "Williamsburg entrance", status: "inactive", tapsThisMonth: 0 },
  ],
};

export const mockFaqs: FaqItem[] = [
  {
    id: "faq_1",
    question: "When do I pay influencers on paid campaigns?",
    answer:
      "Within 72 hours of approving their post, from your Sparkr wallet. Sparkr deducts its platform fee and the rest goes to the influencer.",
  },
  {
    id: "faq_2",
    question: "What happens if I don't review a post?",
    answer: "Posts you don't respond to within 7 days of submission are approved automatically.",
  },
  {
    id: "faq_3",
    question: "Can I get a refund on a wallet top-up?",
    answer: "No. Wallet top-ups are non-refundable, but the balance never expires.",
  },
  {
    id: "faq_4",
    question: "Who handles reservation deposits?",
    answer:
      "You do. Sparkr collects deposits at booking, but your restaurant is responsible for managing each deposit against the final bill.",
  },
  {
    id: "faq_5",
    question: "How do Sparkr Coins work?",
    answer:
      "1 coin = $1 at your business only. Staff scan the customer's QR at checkout to add or redeem coins, at the reward rate you set.",
  },
];
