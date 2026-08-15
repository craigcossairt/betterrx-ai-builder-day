import type { Order, OrderStatus } from "./order";

export type DischargeDecision =
  | { ready: true }
  | { ready: false; blocking: readonly string[] };

const REQUIRED: ReadonlySet<Order["status"]> = new Set([
  "ordered",
  "dispatched",
  "in_transit_at_risk",
]);

export function dischargeReady(patientOrders: readonly Order[]): DischargeDecision {
  const blocking = patientOrders
    .filter((order) => REQUIRED.has(order.status))
    .map((order) => order.equipment.map((line) => line.name).join(", "));
  if (blocking.length > 0) return { ready: false, blocking };
  return { ready: true };
}

export function showDischargeGate(status: OrderStatus): boolean {
  return (
    status !== "pickup_triggered" &&
    status !== "pickup_delayed" &&
    status !== "picked_up"
  );
}
