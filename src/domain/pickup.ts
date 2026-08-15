import type { Instant } from "./clock";

export const PICKUP_SLA_HOURS = 24;

export function pickupElapsedDays(triggeredAt: Instant, now: Instant): number {
  return Math.round(
    (new Date(now).getTime() - new Date(triggeredAt).getTime()) / 86_400_000,
  );
}

export function formatElapsed(from: Instant, now: Instant): string {
  const minutes = Math.round(
    (new Date(now).getTime() - new Date(from).getTime()) / 60_000,
  );
  if (minutes < 48 * 60) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours === 0) return rest === 1 ? "1 minute" : `${rest} minutes`;
    if (rest === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
    return `${hours} hours ${rest} minutes`;
  }
  const days = Math.round(minutes / (24 * 60));
  return days === 1 ? "1 day" : `${days} days`;
}
