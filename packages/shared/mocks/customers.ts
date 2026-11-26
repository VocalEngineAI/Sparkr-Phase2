import type {
  CoinLedgerEntry,
  Customer,
  CustomerActivity,
  CustomerImport,
  CustomerSegment,
  MemberPromotion,
  TierConfig,
  TopUpPackage,
} from "../types";

export const mockCustomers: Customer[] = [
  {
    id: "c_1",
    name: "Maya Rodriguez",
    phone: "(917) 555-0112",
    email: "maya.r@example.com",
    birthday: "Dec 4",
    coins: 86,
    tier: "gold",
    lastVisit: "Today",
    visits: 31,
    joined: "Mar 2025",
    smsOptIn: true,
    source: "app",
    spend12m: 2140,
    notes: "Prefers counter seats. Shellfish allergy.",
  },
  {
    id: "c_2",
    name: "Jordan Lee",
    phone: "(646) 555-0187",
    email: "jordan.lee@example.com",
    birthday: "Jun 18",
    coins: 12,
    tier: "silver",
    lastVisit: "Today",
    visits: 14,
    joined: "Jul 2025",
    smsOptIn: true,
    source: "nfc",
    spend12m: 960,
  },
  {
    id: "c_3",
    name: "Priya Shah",
    phone: "(347) 555-0129",
    email: "priya.shah@example.com",
    birthday: "Dec 19",
    coins: 140,
    tier: "gold",
    lastVisit: "3 days ago",
    visits: 42,
    joined: "Jan 2025",
    smsOptIn: true,
    source: "import",
    spend12m: 3380,
    notes: "VIP — anniversary in February.",
  },
  {
    id: "c_4",
    name: "Daniel Okafor",
    phone: "(718) 555-0164",
    email: "d.okafor@example.com",
    birthday: "Sep 2",
    coins: 34,
    tier: "bronze",
    lastVisit: "2 weeks ago",
    visits: 5,
    joined: "Sep 2025",
    smsOptIn: false,
    source: "influencer",
    spend12m: 310,
  },
  {
    id: "c_5",
    name: "Emily Chen",
    phone: "(212) 555-0193",
    email: "emily.chen@example.com",
    birthday: "Dec 27",
    coins: 58,
    tier: "silver",
    lastVisit: "1 month ago",
    visits: 11,
    joined: "May 2025",
    smsOptIn: true,
    source: "app",
    spend12m: 870,
  },
  {
    id: "c_6",
    name: "Lucas Alvarez",
    phone: "(929) 555-0175",
    email: "lucas.alvarez@example.com",
    birthday: "Apr 11",
    coins: 0,
    tier: "bronze",
    lastVisit: "4 months ago",
    visits: 2,
    joined: "Jul 2025",
    smsOptIn: true,
    source: "import",
    spend12m: 120,
  },
  {
    id: "c_7",
    name: "Sofia Rossi",
    phone: "(917) 555-0140",
    email: "sofia.rossi@example.com",
    birthday: "Feb 8",
    coins: 22,
    tier: "bronze",
    lastVisit: "7 months ago",
    visits: 3,
    joined: "Feb 2025",
    smsOptIn: false,
    source: "app",
    spend12m: 95,
  },
  {
    id: "c_8",
    name: "Kevin Park",
    phone: "(646) 555-0151",
    email: "kevin.park@example.com",
    birthday: "Oct 30",
    coins: 9,
    tier: "bronze",
    lastVisit: "Joined 5 weeks ago",
    visits: 1,
    joined: "Oct 2025",
    smsOptIn: true,
    source: "influencer",
    spend12m: 48,
  },
];

export const mockSegments: CustomerSegment[] = [
  { id: "seg_1", name: "Birthdays this month", description: "Members with a birthday in December", count: 64 },
  { id: "seg_2", name: "Not seen in 1 month", description: "Last check-in over 30 days ago", count: 318 },
  { id: "seg_3", name: "Not seen in 3 months", description: "Last check-in over 90 days ago", count: 214 },
  { id: "seg_4", name: "Not seen in 6 months", description: "Last check-in over 180 days ago", count: 97 },
  { id: "seg_5", name: "New but not returned", description: "One visit only, joined 30+ days ago", count: 126 },
  { id: "seg_6", name: "Claimed an offer", description: "Redeemed a deal or voucher in the last 90 days", count: 402 },
  { id: "seg_7", name: "SMS opted in", description: "Can receive SMS and picture messages", count: 986 },
];

export const mockImports: CustomerImport[] = [
  {
    id: "imp_1",
    fileName: "old_rewards_export.csv",
    date: "Oct 3",
    rows: 642,
    matched: 188,
    welcomeChannel: "sms",
    welcomeSent: 500,
  },
  {
    id: "imp_2",
    fileName: "williamsburg_list.csv",
    date: "Nov 14",
    rows: 117,
    matched: 31,
    welcomeChannel: "email",
    welcomeSent: 117,
  },
];

/** Sample rows from a CSV, as shown in the import preview. */
export const mockImportPreview: { name: string; phone: string; email: string; birthday: string; coins: number }[] = [
  { name: "Tom Becker", phone: "(212) 555-0101", email: "tom.b@example.com", birthday: "1990-03-14", coins: 25 },
  { name: "Aiko Tanaka", phone: "(646) 555-0102", email: "aiko.t@example.com", birthday: "1988-11-02", coins: 60 },
  { name: "Ravi Patel", phone: "(917) 555-0103", email: "ravi.p@example.com", birthday: "1995-07-21", coins: 10 },
];

export const mockTiers: TierConfig[] = [
  { tier: "bronze", threshold: 0, rewardPct: 5, members: 842 },
  { tier: "silver", threshold: 750, rewardPct: 7.5, members: 291 },
  { tier: "gold", threshold: 2000, rewardPct: 10, members: 115 },
];

export const mockMemberPromotions: MemberPromotion[] = [
  { id: "mp_1", title: "Gold members: free sake on Tuesdays", kind: "weekly", schedule: "Every Tuesday", active: true },
  { id: "mp_2", title: "Silver+: double coins at lunch", kind: "time_specific", schedule: "Weekdays · 12–3 PM", active: true },
  { id: "mp_3", title: "Christmas Eve tasting menu, 15% off", kind: "holiday", schedule: "Dec 24", active: true },
  { id: "mp_4", title: "Daily dessert for birthday month", kind: "daily", schedule: "Birthday month", active: false },
];

export const mockCoinSettings = {
  /** Percent of each purchase returned as coins (1 coin = $1). */
  rewardRatePct: 10,
  expiryMonths: 12,
  expiryReminder: true,
  issuedThisMonth: 1840,
  redeemedThisMonth: 1215,
};

export const mockCoinLedger: CoinLedgerEntry[] = [
  { id: "cl_1", customer: "Maya Rodriguez", kind: "earn", coins: 9, bill: 92, time: "12m ago" },
  { id: "cl_2", customer: "Jordan Lee", kind: "redeem", coins: 20, bill: 64, time: "2h ago" },
  { id: "cl_3", customer: "Priya Shah", kind: "earn", coins: 14, bill: 140, time: "3h ago" },
  { id: "cl_4", customer: "Emily Chen", kind: "earn", coins: 6, bill: 58, time: "Yesterday" },
  { id: "cl_5", customer: "Sofia Rossi", kind: "expire", coins: 8, time: "Yesterday" },
];

/** Customer wallet top-up packages (business opt-in, slide 36). */
export const mockTopUpPackages: TopUpPackage[] = [
  { id: "tp_1", pay: 100, bonus: 10 },
  { id: "tp_2", pay: 200, bonus: 25 },
  { id: "tp_3", pay: 500, bonus: 75 },
  { id: "tp_4", pay: 1000, bonus: 200 },
];

export const mockCustomerActivity: CustomerActivity[] = [
  { id: "ca_1", customer: "Maya Rodriguez", kind: "coins_earned", detail: "Earned 9 coins on a $92 bill", time: "12m ago" },
  { id: "ca_2", customer: "Kevin Park", kind: "joined", detail: "Joined via @sushiwithsam's link", time: "40m ago" },
  { id: "ca_3", customer: "Jordan Lee", kind: "redeemed", detail: "Paid $20 of a $64 bill with coins", time: "2h ago" },
  { id: "ca_4", customer: "Priya Shah", kind: "visit", detail: "Checked in at Grand St", time: "3h ago" },
  { id: "ca_5", customer: "Emily Chen", kind: "voucher", detail: "Redeemed $125 for $100 dinner voucher", time: "Yesterday" },
  { id: "ca_6", customer: "Daniel Okafor", kind: "visit", detail: "Checked in at Williamsburg", time: "Yesterday" },
  { id: "ca_7", customer: "Lucas Alvarez", kind: "joined", detail: "Imported from old_rewards_export.csv", time: "Oct 3" },
];
