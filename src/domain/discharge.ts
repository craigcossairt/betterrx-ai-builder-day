import type { Order, OrderId } from "./order";

export type DischargeDecision =
  | { ready: true }
  | { ready: false; blocking: readonly OrderId[] };

const REQUIRED: ReadonlySet<Order["status"]> = new Set([
  "ordered",
  "dispatched",
  "in_transit_at_risk",
]);

export function dischargeReady(patientOrders: readonly Order[]): DischargeDecision {
  const blocking = patientOrders
    .filter((order) => REQUIRED.has(order.status))
    .map((order) => order.id);
  if (blocking.length > 0) return { ready: false, blocking };
  return { ready: true };
}
