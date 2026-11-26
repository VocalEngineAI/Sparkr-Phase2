// Shared domain types used across business-app, customer-app, and admin-web.
// Split by area under ./types — see docs/03-07 for the feature definitions they model.

export type UserRole = "business" | "influencer" | "customer" | "admin";

export * from "./types/business";
export * from "./types/home";
export * from "./types/marketing";
export * from "./types/customers";
export * from "./types/bookings";
export * from "./types/account";
