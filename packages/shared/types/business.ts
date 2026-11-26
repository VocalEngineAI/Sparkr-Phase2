export type BusinessCategory = "restaurant" | "nail_salon" | "spa";

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  cuisine?: string;
  ownerName: string;
  ownerFirstName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  /** "$" to "$$$$" (customer-facing profile, slide 38). */
  priceRange: string;
  /** Prepaid, non-refundable business wallet (docs/03 Feature 1) — funds campaigns, SMS, AI, add-ons. */
  walletBalance: number;
  /** Google rating across connected locations (Feature 3). */
  googleRating: number;
  googleReviewCount: number;
  memberCount: number;
  /** Sparkr Coins currently outstanding across all members (Feature 14). */
  coinsOutstanding: number;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  isMain?: boolean;
};

export type OpeningHours = {
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
};
