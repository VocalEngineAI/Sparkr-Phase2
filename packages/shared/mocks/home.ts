import type {
  ActionRequiredItem,
  ActivityItem,
  BusinessOverview,
  PerformanceHighlight,
} from "../types";
import { mockEvents, mockReservations } from "./bookings";

export const mockBusinessOverview: BusinessOverview = {
  checkInsToday: 42,
  reservationsToday: 18,
  activeCampaigns: 2,
  activeDeals: 3,
};

export const mockActionRequired: ActionRequiredItem[] = [
  {
    id: "ar_1",
    kind: "arrival_check",
    title: "Did the Chen party arrive?",
    detail: "Party of 4 booked for 6:00 PM. Mark as arrived or free the table.",
    deadline: "Now",
    urgent: true,
    cta: "Check in",
  },
  {
    id: "ar_2",
    kind: "campaign_payment",
    title: "Pay @nycbites for Omakase Night",
    detail: "Post approved. $150 is due from your wallet.",
    deadline: "Due in 18h",
    urgent: true,
    cta: "Pay now",
  },
  {
    id: "ar_3",
    kind: "post_review",
    title: "2 influencer posts to review",
    detail: "Approve or request caption changes. Auto-approves if you don't respond.",
    deadline: "3 days left",
    cta: "Review",
  },
  {
    id: "ar_4",
    kind: "applicants",
    title: "5 new applicants",
    detail: "Winter Roll Launch · 2 of 5 slots still open.",
    cta: "View",
  },
];

export const mockRecentActivity: ActivityItem[] = [
  {
    id: "act_1",
    kind: "voucher_sold",
    title: "Voucher sold",
    detail: "Maya R. bought a $125 for $100 dinner voucher",
    time: "8m ago",
  },
  {
    id: "act_2",
    kind: "check_in",
    title: "Influencer visit",
    detail: "@sushiwithsam checked in for Winter Roll Launch",
    time: "34m ago",
  },
  {
    id: "act_3",
    kind: "review",
    title: "New 5★ Google review",
    detail: "“Best salmon nigiri in the city.” AI reply posted.",
    time: "1h ago",
  },
  {
    id: "act_4",
    kind: "coins_redeemed",
    title: "Coins redeemed",
    detail: "Jordan L. paid $20 of a $64 bill with Sparkr Coins",
    time: "2h ago",
  },
  {
    id: "act_5",
    kind: "member_joined",
    title: "6 new members",
    detail: "Joined via NFC tap at the counter",
    time: "Today",
  },
];

export const mockPerformanceHighlights: PerformanceHighlight[] = [
  { id: "ph_1", label: "Influencer visits", value: "48", changePct: 12 },
  { id: "ph_2", label: "Voucher sales", value: "$1,250", changePct: 8 },
  { id: "ph_3", label: "Deal redemptions", value: "86", changePct: 21 },
  { id: "ph_4", label: "New members", value: "34", changePct: -4 },
  { id: "ph_5", label: "SMS click rate", value: "14%", changePct: 3 },
];

export const mockUpcomingReservations = mockReservations.filter(
  (r) => r.dayOffset === 0 && r.status === "confirmed"
);

export const mockUpcomingEvents = mockEvents.filter((e) => e.status === "published");
