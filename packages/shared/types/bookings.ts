// Bookings: Feature 16 (reservations & waitlist) and events & tickets (slides 48–53).

export type Reservation = {
  id: string;
  guestName: string;
  partySize: number;
  /** Display label, e.g. "Today · 7:00 PM". */
  when: string;
  /** Day offset from today, for the date strip. */
  dayOffset: number;
  time: string;
  status: "confirmed" | "seated" | "cancelled" | "no_show";
  table?: string;
  phone?: string;
  /** Deposit collected in-app, if the business has deposits enabled. */
  deposit?: number;
  vip?: boolean;
  note?: string;
  /** "app" = booked in Sparkr; "phone" = entered manually by staff. */
  source: "app" | "phone";
  /** $0.25 special reservation (slide 31). */
  special?: boolean;
};

export type WaitlistEntry = {
  id: string;
  name: string;
  partySize: number;
  quotedWait: string;
  joined: string;
};

export type ReservationSettings = {
  tables: number;
  seats: number;
  slotMinutes: number;
  waitlistEnabled: boolean;
  depositsEnabled: boolean;
  /** Minimum party size that requires a deposit. */
  depositThreshold: number;
  depositMode: "per_booking" | "per_person";
  depositAmount: number;
  cancellationHours: number;
  cancellationPenalty: number;
  noShowPenalty: number;
  specialReservations: boolean;
};

export type BusinessEvent = {
  id: string;
  title: string;
  description: string;
  /** Display label, e.g. "Sat, Dec 6 · 8:00 PM". */
  when: string;
  venue: string;
  status: "published" | "draft" | "past";
  ticketsSold: number;
  ticketsTotal: number;
  ticketPrice: number;
  /** Ticket check-ins at the door so far. */
  checkedIn: number;
};

export type PromoCode = {
  id: string;
  eventId: string;
  code: string;
  discountType: "percent" | "fixed";
  amount: number;
  uses: number;
  limit: number;
  expires: string;
};

/** An influencer promoting an event for commission on referred tickets (slide 50). */
export type EventInfluencer = {
  id: string;
  eventId: string;
  handle: string;
  code: string;
  ticketsSold: number;
  commissionPerTicket: number;
};

export type Ticket = {
  /** Value encoded in the ticket's QR. */
  code: string;
  eventId: string;
  holder: string;
  status: "valid" | "used";
  usedAt?: string;
};
