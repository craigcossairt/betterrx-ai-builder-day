import type { Instant } from "@/domain/clock";
import type { Order, OrderStatus } from "@/domain/order";

export const TRAIL_STEPS = [
  "ordered",
  "vendor_confirmed",
  "dispatched",
  "delivered",
  "pickup_requested",
  "picked_up",
] as const;

export type TrailStepId = (typeof TRAIL_STEPS)[number];

export type TrailStep = {
  step: TrailStepId;
  label: string;
  done: boolean;
  at: Instant | null;
};

const LABELS: Record<TrailStepId, string> = {
  ordered: "Ordered",
  vendor_confirmed: "Vendor confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  pickup_requested: "Pickup requested",
  picked_up: "Picked up",
};

const RANK: Record<OrderStatus, number> = {
  ordered: 0,
  dispatched: 2,
  in_transit_at_risk: 2,
  delivered: 3,
  pickup_triggered: 4,
  pickup_delayed: 4,
  picked_up: 5,
};

const STEP_RANK: Record<TrailStepId, number> = {
  ordered: 0,
  vendor_confirmed: 1,
  dispatched: 2,
  delivered: 3,
  pickup_requested: 4,
  picked_up: 5,
};

function stamp(order: Order, step: TrailStepId): Instant | null {
  if (step === "ordered" && order.status === "ordered") return order.orderedAt;
  if (step === "delivered" && order.status === "delivered") {
    return order.deliveredAt;
  }
  if (
    step === "pickup_requested" &&
    (order.status === "pickup_triggered" ||
      order.status === "pickup_delayed" ||
      order.status === "picked_up")
  ) {
    return order.triggeredAt;
  }
  if (step === "picked_up" && order.status === "picked_up") {
    return order.pickedUpAt;
  }
  return null;
}

export function projectTrail(order: Order): TrailStep[] {
  const rank = RANK[order.status];
  return TRAIL_STEPS.map((step) => ({
    step,
    label: LABELS[step],
    done: rank >= STEP_RANK[step],
    at: stamp(order, step),
  }));
}
