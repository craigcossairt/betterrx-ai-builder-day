import type { Order } from "@/domain/order";

export type VendorAction =
  | "confirm"
  | "yes_but"
  | "decline"
  | "delivered"
  | "pickup_window"
  | "picked_up";

export function vendorActions(order: Order): readonly VendorAction[] {
  if (order.status === "ordered") return ["confirm", "yes_but", "decline"];
  if (order.status === "dispatched" || order.status === "in_transit_at_risk") {
    return ["delivered"];
  }
  if (order.status === "pickup_triggered" || order.status === "pickup_delayed") {
    return ["pickup_window", "picked_up"];
  }
  return [];
}
