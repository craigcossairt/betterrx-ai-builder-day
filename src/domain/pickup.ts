import type { Instant } from "./clock";

export const PICKUP_SLA_HOURS = 24;

export function pickupElapsedDays(triggeredAt: Instant, now: Instant): number {
  return Math.round(
    (new Date(now).getTime() - new Date(triggeredAt).getTime()) / 86_400_000,
  );
}
