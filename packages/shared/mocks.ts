// Mock/static data for frontend-only development, before the backend exists.
// Each app imports from here instead of hitting a real API.
//
// Demo business: Tang Sushie, a sushi restaurant owned by Kenny Moy.

import type {
  ActionRequiredItem,
  ActivityItem,
  Business,
  BusinessEvent,
  BusinessOverview,
  PerformanceHighlight,
  Reservation,
} from "./types";

export const mockBusiness: Business = {
  id: "biz_tang_sushie",
  name: "Tang Sushie",
  category: "restaurant",
  cuisine: "Japanese · Sushi",
  ownerName: "Kenny Moy",
  ownerFirstName: "Kenny",
  address: "214 Grand St",
  city: "New York, NY",
  walletBalance: 1482.5,
  googleRating: 4.7,
  googleReviewCount: 386,
  memberCount: 1248,
  coinsOutstanding: 3920,
};

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

export const mockUpcomingReservations: Reservation[] = [
  {
    id: "res_1",
    guestName: "Chen",
    partySize: 4,
    when: "Today · 6:00 PM",
    status: "confirmed",
  },
  {
    id: "res_2",
    guestName: "Alvarez",
    partySize: 8,
    when: "Today · 7:30 PM",
    status: "confirmed",
    deposit: 80,
    note: "Birthday — dessert plate",
  },
  {
    id: "res_3",
    guestName: "Priya S.",
    partySize: 2,
    when: "Today · 8:00 PM",
    status: "confirmed",
    vip: true,
  },
  {
    id: "res_4",
    guestName: "Okafor",
    partySize: 3,
    when: "Today · 8:15 PM",
    status: "waitlist",
  },
];

export const mockUpcomingEvents: BusinessEvent[] = [
  {
    id: "evt_1",
    title: "Omakase Night with Chef Tang",
    when: "Sat, Dec 6 · 8:00 PM",
    ticketsSold: 22,
    ticketsTotal: 30,
    ticketPrice: 95,
  },
  {
    id: "evt_2",
    title: "Sake Tasting Social",
    when: "Thu, Dec 11 · 7:00 PM",
    ticketsSold: 9,
    ticketsTotal: 40,
    ticketPrice: 35,
  },
];
