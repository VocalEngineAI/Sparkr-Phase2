import type { GooglePost, GoogleReplyTone, GoogleReview } from "@sparkr/shared";

// Canned "AI" copy for the Google management screen. The real drafts come from the backend
// later; these keep the Draft-with-AI buttons meaningful on sample data and show how the
// reply tone setting changes the voice.

export const TONES: { key: GoogleReplyTone; label: string; description: string }[] = [
  { key: "warm", label: "Warm", description: "Friendly and personal, thanks people by name." },
  { key: "professional", label: "Professional", description: "Polished and measured, no slang." },
  { key: "playful", label: "Playful", description: "Light and upbeat, a little personality." },
  { key: "concise", label: "Concise", description: "One or two short sentences, straight to the point." },
];

const first = (name: string) => name.trim().split(/\s+/)[0] ?? name;

export function draftReply(review: GoogleReview, tone: GoogleReplyTone, business: string): string {
  const name = first(review.author);
  const positive = review.rating >= 4;
  const mixed = review.rating === 3;

  if (positive) {
    switch (tone) {
      case "warm":
        return `Thank you so much, ${name}! It means a lot to the whole team at ${business}. We can't wait to welcome you back to the counter.`;
      case "professional":
        return `Thank you for the kind review, ${name}. We're glad you enjoyed your visit to ${business} and look forward to serving you again.`;
      case "playful":
        return `${name}, you just made Chef's day! Thanks for the love — the counter will be waiting for you.`;
      case "concise":
        return `Thanks, ${name}! See you again soon.`;
    }
  }
  if (mixed) {
    switch (tone) {
      case "warm":
        return `Thanks for the honest feedback, ${name}. We're glad parts of the visit landed and we're taking the rest to heart. We'd love another chance to get it right.`;
      case "professional":
        return `Thank you for your feedback, ${name}. We appreciate the balanced review and will share your notes with the team at ${business}.`;
      case "playful":
        return `Fair points, ${name}. We're on it — give us another go and we'll aim for five.`;
      case "concise":
        return `Thanks for the feedback, ${name}. We'll work on it.`;
    }
  }
  switch (tone) {
    case "warm":
      return `We're sorry, ${name}. That's not the experience we want anyone to have at ${business}. Please reach out to us directly so we can make it right.`;
    case "professional":
      return `Thank you for bringing this to our attention, ${name}. We apologise for the experience and would welcome the chance to resolve it. Please contact ${business} directly.`;
    case "playful":
      return `Ouch — sorry, ${name}. We dropped the ball and we'd like to pick it back up. Message us and let's fix this.`;
    case "concise":
      return `We're sorry, ${name}. Please contact us so we can make it right.`;
  }
}

export function draftPost(kind: GooglePost["kind"], title: string, business: string): string {
  const t = title.trim() || "something new";
  switch (kind) {
    case "offer":
      return `${t} — available now at ${business}. Show this post at the counter to redeem. Limited time, while it lasts.`;
    case "event":
      return `Join us at ${business} for ${t}. Seats are limited, so book ahead in the Sparkr app. We'd love to see you there.`;
    default:
      return `${t} has landed at ${business}. Come by the counter this week and let us know what you think.`;
  }
}
