import { orderKind, type Order, type OrderStatus } from "./order";

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
    .filter((order) => orderKind(order) !== "supply")
    .filter((order) => REQUIRED.has(order.status))
    .map((order) => order.equipment.map((line) => line.name).join(", "));
  if (blocking.length > 0) return { ready: false, blocking };
  return { ready: true };
}

export function dischargeCopy(
  decision: DischargeDecision,
  override?: string,
): string {
  if (decision.ready) {
    return "Discharge-ready. Required equipment is delivered.";
  }
  if (override) {
    return `Discharge-ready with override. ${override}`;
  }
  return `Not discharge-ready yet. Waiting on: ${decision.blocking.join(", ")}.`;
}

export function showDischargeGate(status: OrderStatus): boolean {
  return (
    status !== "pickup_triggered" &&
    status !== "pickup_delayed" &&
    status !== "picked_up"
  );
}
