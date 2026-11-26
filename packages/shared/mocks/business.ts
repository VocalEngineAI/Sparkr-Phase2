import type { Branch, Business, OpeningHours } from "../types";

export const mockBusiness: Business = {
  id: "biz_tang_sushie",
  name: "Tang Sushie",
  category: "restaurant",
  cuisine: "Japanese · Sushi",
  ownerName: "Kenny Moy",
  ownerFirstName: "Kenny",
  address: "214 Grand St",
  city: "New York, NY 10013",
  phone: "(212) 555-0148",
  email: "hello@tangsushie.com",
  website: "tangsushie.com",
  description:
    "Neighbourhood omakase and hand rolls in Chinatown. Fish flown in daily, sake on tap, and a counter seat for every regular.",
  priceRange: "$$$",
  walletBalance: 1482.5,
  googleRating: 4.7,
  googleReviewCount: 386,
  memberCount: 1248,
  coinsOutstanding: 3920,
};

export const mockBranches: Branch[] = [
  { id: "br_1", name: "Tang Sushie · Grand St", address: "214 Grand St, New York, NY", isMain: true },
  { id: "br_2", name: "Tang Sushie · Williamsburg", address: "88 Bedford Ave, Brooklyn, NY" },
];

export const mockOpeningHours: OpeningHours[] = [
  { day: "Monday", closed: true },
  { day: "Tuesday", open: "5:00 PM", close: "10:30 PM" },
  { day: "Wednesday", open: "5:00 PM", close: "10:30 PM" },
  { day: "Thursday", open: "5:00 PM", close: "10:30 PM" },
  { day: "Friday", open: "5:00 PM", close: "11:30 PM" },
  { day: "Saturday", open: "12:00 PM", close: "11:30 PM" },
  { day: "Sunday", open: "12:00 PM", close: "9:30 PM" },
];
