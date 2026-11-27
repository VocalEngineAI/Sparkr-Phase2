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
  /** confirmed → seated → finished (table cleared); or cancelled / no_show. */
  status: "confirmed" | "seated" | "finished" | "cancelled" | "no_show";
  /** Table label, e.g. "T4" or "Counter 3–4". */
  table?: string;
  phone?: string;
  /** Deposit collected in-app, if the business has deposits enabled. */
  deposit?: number;
  vip?: boolean;
  note?: string;
  /** "app" = booked in Sparkr; "phone" = entered by staff; "walk_in" = seated from the door or waitlist. */
  source: "app" | "phone" | "walk_in";
  /** $0.25 special reservation (slide 31). */
  special?: boolean;
};

export type WaitlistEntry = {
  id: string;
  name: string;
  partySize: number;
  /** Wait quoted to the guest when they joined. */
  quotedMinutes: number;
  /** Minutes waited so far (when the mock loads; the screen keeps counting). */
  waitedMinutes: number;
  phone?: string;
  note?: string;
  /** "app" = joined from the Sparkr app; "walk_in" = added by staff at the door. */
  source: "app" | "walk_in";
  /** Guest has been texted that their table is ready. */
  notified?: boolean;
};

export type ReservationSettings = {
  tables: number;
  seats: number;
  /** Service hours, as hours on a 24h clock (17 = 5 PM). */
  serviceStart: number;
  serviceEnd: number;
  /** How long a party holds its table. */
  turnMinutes: number;
  /** Bookable times are offered every N minutes. */
  intervalMinutes: 15 | 30;
  /** Pacing: most guests that can be booked to arrive in one interval. */
  maxCoversPerInterval: number;
  minParty: number;
  maxParty: number;
  /** How many days ahead guests can book. */
  bookingWindowDays: number;
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
