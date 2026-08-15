import type { Instant } from "./clock";
import type { OrderedOrder } from "./order";

export const VENDOR_CONFIRM_GRACE_HOURS = 24;

export function vendorConfirmWhy(
  order: OrderedOrder,
  now: Instant,
): string | null {
  const graceMs = VENDOR_CONFIRM_GRACE_HOURS * 3600_000;
  if (new Date(now).getTime() - new Date(order.orderedAt).getTime() <= graceMs) {
    return null;
  }
  return "The vendor has not confirmed. Grace is 24 hours.";
}
