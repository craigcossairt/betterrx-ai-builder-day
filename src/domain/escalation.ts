import type { Order } from "./order";

export type Escalation = {
  name: string;
  role: "case_manager" | "don";
};

export function escalate(order: Order): Escalation | null {
  if (order.status === "in_transit_at_risk") {
    return { name: "Jordan Hale", role: "case_manager" };
  }
  if (order.status === "pickup_delayed") {
    return { name: "Priya Shah", role: "don" };
  }
  return null;
}
