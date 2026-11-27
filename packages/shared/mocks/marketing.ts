import type {
  BusinessPost,
  Campaign,
  CampaignApplicant,
  CampaignPostReview,
  Deal,
  GiftCardProduct,
  GooglePost,
  GoogleReputation,
  GoogleReview,
  InfluencerPerformance,
  InfluencerProfile,
  OfferPerformance,
  PerformanceHighlight,
  ScheduledSocialPost,
  SmsAutomation,
  SmsCampaign,
  SocialAccount,
  Voucher,
} from "../types";

// --- Feature 1: Influencer campaigns ---------------------------------------

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp_1",
    title: "Winter Roll Launch",
    type: "paid",
    status: "active",
    platforms: ["instagram", "tiktok"],
    slotsFilled: 3,
    slotsTotal: 5,
    creditOffered: 120,
    paymentPerInfluencer: 150,
    startDate: "Nov 20",
    endDate: "Dec 20",
    applicants: 5,
    minFollowers: 10000,
    followerOffer: "Free spicy tuna hand roll with any order",
    visitHours: "Tue–Fri, 5–7 PM",
    branch: "Grand St",
  },
  {
    id: "cmp_2",
    title: "Omakase Night",
    type: "barter",
    status: "active",
    platforms: ["instagram", "youtube", "rednote"],
    slotsFilled: 4,
    slotsTotal: 4,
    creditOffered: 180,
    startDate: "Nov 10",
    endDate: "Dec 5",
    applicants: 0,
    minFollowers: 5000,
    visitHours: "Sat–Sun, 6–9 PM",
    branch: "Grand St",
  },
  {
    id: "cmp_3",
    title: "Lunar New Year Menu",
    type: "paid",
    status: "draft",
    platforms: ["instagram", "tiktok", "rednote"],
    slotsFilled: 0,
    slotsTotal: 10,
    creditOffered: 100,
    paymentPerInfluencer: 200,
    startDate: "Jan 20",
    endDate: "Feb 15",
    applicants: 0,
    minFollowers: 1000,
    followerOffer: "Secret menu: golden yuzu roll",
    visitHours: "Daily, 12–3 PM",
    branch: "Williamsburg",
  },
  {
    id: "cmp_4",
    title: "Summer Sake Patio",
    type: "barter",
    status: "completed",
    platforms: ["instagram"],
    slotsFilled: 6,
    slotsTotal: 6,
    creditOffered: 90,
    startDate: "Jul 1",
    endDate: "Aug 31",
    applicants: 0,
    minFollowers: 0,
    visitHours: "Daily, 4–7 PM",
    branch: "Grand St",
  },
];

export const mockPostReviews: CampaignPostReview[] = [
  {
    id: "pr_1",
    handle: "@sushiwithsam",
    campaignTitle: "Winter Roll Launch",
    platform: "instagram",
    submitted: "Submitted 4 days ago",
    autoApprovesIn: "Auto-approves in 3 days",
    caption: "The winter roll at @tangsushie is unreal 🍣 Use SAM10 for a free hand roll!",
  },
  {
    id: "pr_2",
    handle: "@eats.with.lina",
    campaignTitle: "Omakase Night",
    platform: "youtube",
    submitted: "Submitted 2 days ago",
    autoApprovesIn: "Auto-approves in 5 days",
    caption: "12-course omakase in Chinatown — full review. Code LINA for members.",
  },
];

export const mockApplicants: CampaignApplicant[] = [
  {
    id: "ap_1",
    handle: "@nycfoodcrawl",
    name: "Derek Owusu",
    campaignTitle: "Winter Roll Launch",
    platform: "tiktok",
    followers: 48200,
    location: "New York",
    pastCollabs: 12,
    partySize: 2,
  },
  {
    id: "ap_2",
    handle: "@hungryhana",
    name: "Hana Kim",
    campaignTitle: "Winter Roll Launch",
    platform: "instagram",
    followers: 21500,
    location: "New Jersey",
    pastCollabs: 7,
    partySize: 2,
  },
  {
    id: "ap_3",
    handle: "@bitesbyjules",
    name: "Julia Reyes",
    campaignTitle: "Winter Roll Launch",
    platform: "instagram",
    followers: 13900,
    location: "New York",
    pastCollabs: 3,
    partySize: 1,
  },
];

export const mockInfluencerDirectory: InfluencerProfile[] = [
  {
    id: "inf_1",
    handle: "@nycfoodcrawl",
    name: "Derek Owusu",
    accounts: [
      { platform: "tiktok", followers: 48200 },
      { platform: "instagram", followers: 22100 },
    ],
    location: "New York",
    pastCollabs: 12,
    category: "Food crawls",
  },
  {
    id: "inf_2",
    handle: "@sakesamurai",
    name: "Ken Ito",
    accounts: [{ platform: "youtube", followers: 61000 }],
    location: "New York",
    pastCollabs: 9,
    category: "Drinks & sake",
  },
  {
    id: "inf_3",
    handle: "@hungryhana",
    name: "Hana Kim",
    accounts: [
      { platform: "instagram", followers: 21500 },
      { platform: "rednote", followers: 8800 },
    ],
    location: "New Jersey",
    pastCollabs: 7,
    category: "Asian food",
  },
  {
    id: "inf_4",
    handle: "@torontotastes",
    name: "Mei Wong",
    accounts: [{ platform: "rednote", followers: 34000 }],
    location: "Ontario",
    pastCollabs: 15,
    category: "Restaurant reviews",
  },
  {
    id: "inf_5",
    handle: "@bitesbyjules",
    name: "Julia Reyes",
    accounts: [{ platform: "instagram", followers: 13900 }],
    location: "New York",
    pastCollabs: 3,
    category: "Date night spots",
  },
];

// --- Feature 2: Analytics & ROI ---------------------------------------------

export const mockAnalyticsKpis: PerformanceHighlight[] = [
  { id: "k_1", label: "Influencer visits", value: "48", changePct: 12 },
  { id: "k_2", label: "Code redemptions", value: "131", changePct: 18 },
  { id: "k_3", label: "Offer sales", value: "$3,420", changePct: 9 },
  { id: "k_4", label: "Deal revenue", value: "$6,870", changePct: 14 },
  { id: "k_5", label: "Voucher revenue", value: "$2,375", changePct: -3 },
  { id: "k_6", label: "Members via links", value: "57", changePct: 22 },
];

export const mockInfluencerPerformance: InfluencerPerformance[] = [
  { id: "ip_1", handle: "@sushiwithsam", code: "SAM10", visits: 19, redemptions: 46, newMembers: 21, offerSales: 1180 },
  { id: "ip_2", handle: "@eats.with.lina", code: "LINA", visits: 14, redemptions: 38, newMembers: 17, offerSales: 960 },
  { id: "ip_3", handle: "@nycbites", code: "NYCB", visits: 9, redemptions: 29, newMembers: 12, offerSales: 820 },
  { id: "ip_4", handle: "@ramenandrolls", code: "RNR5", visits: 6, redemptions: 18, newMembers: 7, offerSales: 460 },
];

export const mockOfferPerformance: OfferPerformance[] = [
  { id: "op_1", title: "Happy Hour · $5 hand rolls", kind: "deal", redemptions: 212, revenue: 4240 },
  { id: "op_2", title: "$125 for $100 dinner voucher", kind: "voucher", redemptions: 19, revenue: 2375 },
  { id: "op_3", title: "Free spicy tuna hand roll", kind: "influencer_offer", redemptions: 131, revenue: 3420 },
  { id: "op_4", title: "Secret menu · Torched salmon", kind: "deal", redemptions: 74, revenue: 2630 },
];

// --- Feature 3: Google management -------------------------------------------

export const mockGoogleRatingBreakdown: { stars: number; count: number }[] = [
  { stars: 5, count: 271 },
  { stars: 4, count: 74 },
  { stars: 3, count: 23 },
  { stars: 2, count: 10 },
  { stars: 1, count: 8 },
];

/** Average rating per month, oldest first (review trend). */
export const mockGoogleRatingTrend: { month: string; rating: number }[] = [
  { month: "Jun", rating: 4.5 },
  { month: "Jul", rating: 4.6 },
  { month: "Aug", rating: 4.5 },
  { month: "Sep", rating: 4.7 },
  { month: "Oct", rating: 4.8 },
  { month: "Nov", rating: 4.7 },
];

export const mockGoogleReviews: GoogleReview[] = [
  {
    id: "gr_0",
    author: "Priya K.",
    rating: 3,
    text: "Fresh fish and friendly staff, but the omakase felt rushed for the price. Would try the hand rolls next time.",
    time: "20m ago",
  },
  {
    id: "gr_1",
    author: "Alicia M.",
    rating: 5,
    text: "Best salmon nigiri in the city. The chef walked us through every piece.",
    time: "1h ago",
    aiReply: "Thank you, Alicia! Chef Tang loves sharing the story behind each piece. See you at the counter soon.",
  },
  {
    id: "gr_2",
    author: "Ben T.",
    rating: 4,
    text: "Great omakase, a little loud on Friday night but worth it.",
    time: "Yesterday",
    aiReply: "Thanks, Ben! Fridays do get lively. Try a Tuesday for a quieter counter.",
  },
  {
    id: "gr_3",
    author: "Grace L.",
    rating: 2,
    text: "Waited 25 minutes past our reservation time.",
    time: "3 days ago",
    aiReply: "We're sorry for the wait, Grace. That's not the experience we want for you. We'd love to welcome you back.",
  },
  {
    id: "gr_4",
    author: "Marcus D.",
    rating: 5,
    text: "Happy hour hand rolls are a steal.",
    time: "5 days ago",
    aiReply: "Thanks, Marcus! Happy hour runs 4–6 PM every weekday.",
  },
  {
    id: "gr_5",
    author: "Jenna R.",
    rating: 5,
    text: "Omakase was flawless from start to finish. The uni course alone is worth the trip downtown.",
    time: "1 week ago",
    aiReply: "Thank you, Jenna! The uni is Chef Tang's favourite course too. Hope to see you at the counter again soon.",
  },
  {
    id: "gr_6",
    author: "Tom H.",
    rating: 1,
    text: "Takeout order was wrong twice in one week. Food is good when it's right, but that's not acceptable.",
    time: "1 week ago",
    aiReply: "We're sorry, Tom. Two wrong orders is on us. Please message us and we'll make it right.",
  },
  {
    id: "gr_7",
    author: "Wei L.",
    rating: 4,
    text: "Great sake list and the staff know it well. Portions on the chirashi could be bigger.",
    time: "2 weeks ago",
    aiReply: "Thanks, Wei! Glad the sake pairings landed. We'll pass the chirashi note to the kitchen.",
  },
];

export const mockGooglePosts: GooglePost[] = [
  {
    id: "gp_1",
    title: "Winter roll is here",
    kind: "update",
    body: "Torched yellowtail, yuzu kosho and crispy shallot. On the menu all December at the Grand St counter.",
    time: "2 days ago",
    views: 1240,
  },
  {
    id: "gp_2",
    title: "$5 hand rolls, weekdays 4–6 PM",
    kind: "offer",
    body: "Happy hour is back. $5 hand rolls and half-price sake flights, Monday to Friday 4–6 PM. Walk-ins welcome.",
    time: "1 week ago",
    views: 2810,
  },
  {
    id: "gp_3",
    title: "Omakase Night with Chef Tang",
    kind: "event",
    body: "Twelve courses, one counter, Saturday Dec 6 at 7 PM. Seats are limited — book in the Sparkr app.",
    time: "2 weeks ago",
    views: 1975,
  },
];

export const mockGoogleReputation: GoogleReputation = {
  replyRatePct: 96,
  avgReplyTime: "1.8h",
  volume: [
    { month: "Jun", count: 22 },
    { month: "Jul", count: 31 },
    { month: "Aug", count: 27 },
    { month: "Sep", count: 35 },
    { month: "Oct", count: 41 },
    { month: "Nov", count: 38 },
  ],
};

export const mockGoogleProfileStats: PerformanceHighlight[] = [
  { id: "gs_1", label: "Profile views", value: "8,420", changePct: 11 },
  { id: "gs_2", label: "Direction requests", value: "612", changePct: 6 },
  { id: "gs_3", label: "Website clicks", value: "389", changePct: -2 },
  { id: "gs_4", label: "Calls", value: "144", changePct: 4 },
];

// --- Social media management ------------------------------------------------

export const mockSocialAccounts: SocialAccount[] = [
  { platform: "instagram", handle: "@tangsushie", connected: true, followers: 18400 },
  { platform: "facebook", handle: "Tang Sushie NYC", connected: true, followers: 6200 },
  { platform: "tiktok", handle: "@tangsushie", connected: true, followers: 9100 },
  { platform: "youtube", connected: false },
  { platform: "rednote", handle: "唐寿司 Tang Sushie", connected: true, followers: 3300 },
];

export const mockSocialPosts: ScheduledSocialPost[] = [
  {
    id: "sp_1",
    platforms: ["instagram", "facebook"],
    caption: "Winter roll: torched yellowtail, yuzu kosho, crispy shallot. Available all December. #nycsushi #omakase",
    when: "Today · 6:00 PM",
    dayOffset: 0,
    status: "scheduled",
  },
  {
    id: "sp_2",
    platforms: ["tiktok"],
    caption: "60 seconds behind the counter with Chef Tang 🔪 #sushitok",
    when: "Tomorrow · 12:30 PM",
    dayOffset: 1,
    status: "scheduled",
  },
  {
    id: "sp_3",
    platforms: ["instagram", "facebook", "rednote"],
    caption: "Omakase Night is 70% sold. Grab the last seats in the app.",
    when: "Thu · 5:00 PM",
    dayOffset: 3,
    status: "scheduled",
  },
  {
    id: "sp_4",
    platforms: ["instagram", "facebook"],
    caption: "Happy hour is back: $5 hand rolls, 4–6 PM.",
    when: "Mon · 3:30 PM",
    dayOffset: -2,
    status: "posted",
    reach: 7420,
    engagementPct: 6.1,
  },
  {
    id: "sp_5",
    platforms: ["tiktok"],
    caption: "Slicing bluefin for tonight's omakase.",
    when: "Sat · 7:00 PM",
    dayOffset: -4,
    status: "posted",
    reach: 21800,
    engagementPct: 9.4,
  },
];

// --- Features 4–5: SMS & picture messages -----------------------------------

export const mockSmsCredits = { sms: 742, mms: 180, bundleSize: 1000 };

export const mockSmsCampaigns: SmsCampaign[] = [
  {
    id: "sms_1",
    name: "We miss you · 10% off",
    kind: "mms",
    audience: "Not seen in 3 months",
    status: "sent",
    when: "Nov 22",
    recipients: 214,
    delivered: 209,
    clicks: 31,
  },
  {
    id: "sms_2",
    name: "Happy hour reminder",
    kind: "sms",
    audience: "All opted-in members",
    status: "sent",
    when: "Nov 18",
    recipients: 986,
    delivered: 971,
    clicks: 118,
  },
  {
    id: "sms_3",
    name: "Omakase Night · last seats",
    kind: "sms",
    audience: "Gold & Silver members",
    status: "scheduled",
    when: "Dec 2 · 11:00 AM",
    recipients: 342,
  },
  {
    id: "sms_4",
    name: "Lunar New Year preview",
    kind: "mms",
    audience: "Hand-picked (24)",
    status: "draft",
    when: "Not scheduled",
    recipients: 24,
  },
];

export const mockSmsAutomations: SmsAutomation[] = [
  {
    id: "au_1",
    name: "Birthday offer",
    description: "Free dessert, sent 3 days before each member's birthday",
    enabled: true,
    sentThisMonth: 41,
  },
  {
    id: "au_2",
    name: "Inactive nudge",
    description: "10% off for members not seen in 90 days",
    enabled: true,
    sentThisMonth: 63,
  },
  {
    id: "au_3",
    name: "Coin-expiry reminder",
    description: "Reminds members 14 days before their coins expire",
    enabled: false,
    sentThisMonth: 0,
  },
];

// --- Feature 6: Vouchers & gift cards ---------------------------------------

export const mockVouchers: Voucher[] = [
  {
    id: "v_1",
    title: "$125 for $100 dinner voucher",
    kind: "paid",
    price: 100,
    value: 125,
    sold: 19,
    redeemed: 11,
    revenue: 1900,
    validity: "Valid 90 days from purchase",
    conditions: "Dinner only · not on Omakase Night",
    status: "active",
  },
  {
    id: "v_2",
    title: "Omakase for two",
    kind: "paid",
    price: 210,
    value: 240,
    sold: 6,
    redeemed: 2,
    revenue: 1260,
    validity: "Valid until Mar 31",
    status: "active",
  },
  {
    id: "v_3",
    title: "Free edamame with any roll",
    kind: "free",
    value: 7,
    sold: 148,
    redeemed: 97,
    revenue: 0,
    validity: "Weekdays · valid 30 days",
    status: "paused",
  },
];

export const mockGiftCards: GiftCardProduct[] = [
  { id: "gc_1", amount: 50, sold: 34, revenue: 1700, claimed: 29 },
  { id: "gc_2", amount: 100, sold: 21, revenue: 2100, claimed: 18 },
  { id: "gc_3", amount: 200, sold: 5, revenue: 1000, claimed: 5 },
];

// --- Feature 7: Happy hours & deals -----------------------------------------

export const mockDeals: Deal[] = [
  {
    id: "d_1",
    title: "$5 hand rolls",
    kind: "happy_hour",
    schedule: "Weekdays · 4–6 PM",
    minSpend: 15,
    redemptionLimit: 2,
    status: "live",
    active: true,
    redemptions: 212,
    views: 4810,
    saves: 362,
    revenue: 4240,
  },
  {
    id: "d_2",
    title: "Torched salmon secret roll",
    kind: "secret_menu",
    schedule: "Members only · every day",
    status: "live",
    active: true,
    redemptions: 74,
    views: 2210,
    saves: 198,
    revenue: 2630,
  },
  {
    id: "d_3",
    title: "Half-price sake flight",
    kind: "flash",
    schedule: "Today only · 8–10 PM",
    redemptionLimit: 40,
    expires: "Tonight",
    status: "live",
    active: true,
    redemptions: 12,
    views: 640,
    saves: 51,
    revenue: 360,
  },
  {
    id: "d_4",
    title: "Holiday bento box",
    kind: "limited_time",
    schedule: "Dec 15 – Dec 31",
    minSpend: 30,
    status: "scheduled",
    active: true,
    redemptions: 0,
    views: 0,
    saves: 27,
    revenue: 0,
  },
  {
    id: "d_5",
    title: "Halloween dragon roll",
    kind: "limited_time",
    schedule: "Oct 25 – Oct 31",
    status: "ended",
    active: false,
    redemptions: 166,
    views: 3920,
    saves: 240,
    revenue: 3150,
  },
];

// --- Feature 8: Business posts ----------------------------------------------

export const mockBusinessPosts: BusinessPost[] = [
  {
    id: "bp_1",
    caption: "Winter roll is here — torched yellowtail and yuzu kosho.",
    kind: "photo",
    time: "2h ago",
    likes: 184,
    saves: 61,
    views: 2350,
    linkedVoucher: "$125 for $100 dinner voucher",
    sponsoredDaysLeft: 2,
  },
  {
    id: "bp_2",
    caption: "Behind the counter: Chef Tang breaks down a bluefin.",
    kind: "video",
    time: "Yesterday",
    likes: 412,
    saves: 97,
    views: 6120,
  },
  {
    id: "bp_3",
    caption: "$5 hand rolls every weekday, 4–6 PM.",
    kind: "photo",
    time: "4 days ago",
    likes: 233,
    saves: 140,
    views: 3870,
  },
  {
    id: "bp_4",
    caption: "Omakase Night tickets are live.",
    kind: "photo",
    time: "1 week ago",
    likes: 151,
    saves: 58,
    views: 1990,
  },
];
