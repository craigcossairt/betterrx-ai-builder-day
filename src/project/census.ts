import type { Order } from "@/domain/order";

export type CensusRow = {
  order: Order;
  attention: boolean;
};

export type Census = {
  rows: readonly CensusRow[];
  atRisk: number;
  delayedPickup: number;
  awaitingVendor: number;
};

const ATTENTION = new Set(["in_transit_at_risk", "pickup_delayed"]);

const REST_ORDER = [
  "ordered",
  "dispatched",
  "delivered",
  "pickup_triggered",
] as const;

export function projectCensus(orders: readonly Order[]): Census {
  const attention = orders.filter((order) => ATTENTION.has(order.status));
  const rest = REST_ORDER.flatMap((status) =>
    orders.filter((order) => order.status === status),
  );
  return {
    rows: [
      ...attention.map((order) => ({ order, attention: true })),
      ...rest.map((order) => ({ order, attention: false })),
    ],
    atRisk: orders.filter((order) => order.status === "in_transit_at_risk")
      .length,
    delayedPickup: orders.filter((order) => order.status === "pickup_delayed")
      .length,
    awaitingVendor: orders.filter((order) => order.status === "ordered").length,
  };
}
