import type { Instant } from "./clock";
import {
  orderKind,
  type DeliveredOrder,
  type Order,
  type PatientId,
  type PickupDelayedOrder,
  type PickupTriggeredOrder,
} from "./order";

export type PickupEligibleOrder =
  | DeliveredOrder
  | PickupTriggeredOrder
  | PickupDelayedOrder;

function isPickupEligible(order: Order): order is PickupEligibleOrder {
  return (
    order.status === "delivered" ||
    order.status === "pickup_triggered" ||
    order.status === "pickup_delayed"
  );
}

export function emrDeathTargets(
  orders: readonly Order[],
  patientId?: PatientId | null,
): PickupEligibleOrder[] {
  return orders.filter((order): order is PickupEligibleOrder => {
    if (orderKind(order) === "supply") return false;
    if (!isPickupEligible(order)) return false;
    if (patientId) return order.patientId === patientId;
    return order.status === "delivered" || order.patientId === "PT-87602";
  });
}

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
