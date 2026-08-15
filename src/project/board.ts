import type {
  DeliveredOrder,
  DispatchedOrder,
  InTransitAtRiskOrder,
  Order,
  OrderedOrder,
  OrderStatus,
  PickupDelayedOrder,
  PickupTriggeredOrder,
} from "@/domain/order";

export type BoardLane<S extends OrderStatus, O extends Order> = {
  status: S;
  orders: readonly O[];
};

export type Board = {
  ordered: readonly OrderedOrder[];
  dispatched: readonly DispatchedOrder[];
  inTransitAtRisk: readonly InTransitAtRiskOrder[];
  delivered: readonly DeliveredOrder[];
  pickupTriggered: readonly PickupTriggeredOrder[];
  pickupDelayed: readonly PickupDelayedOrder[];
  lanes: readonly [
    BoardLane<"ordered", OrderedOrder>,
    BoardLane<"dispatched", DispatchedOrder>,
    BoardLane<"in_transit_at_risk", InTransitAtRiskOrder>,
    BoardLane<"delivered", DeliveredOrder>,
    BoardLane<"pickup_triggered", PickupTriggeredOrder>,
    BoardLane<"pickup_delayed", PickupDelayedOrder>,
  ];
};

export function projectBoard(orders: readonly Order[]): Board {
  const ordered = orders.filter((order) => order.status === "ordered");
  const dispatched = orders.filter((order) => order.status === "dispatched");
  const inTransitAtRisk = orders.filter(
    (order) => order.status === "in_transit_at_risk",
  );
  const delivered = orders.filter((order) => order.status === "delivered");
  const pickupTriggered = orders.filter(
    (order) => order.status === "pickup_triggered",
  );
  const pickupDelayed = orders.filter(
    (order) => order.status === "pickup_delayed",
  );
  return {
    ordered,
    dispatched,
    inTransitAtRisk,
    delivered,
    pickupTriggered,
    pickupDelayed,
    lanes: [
      { status: "ordered", orders: ordered },
      { status: "dispatched", orders: dispatched },
      { status: "in_transit_at_risk", orders: inTransitAtRisk },
      { status: "delivered", orders: delivered },
      { status: "pickup_triggered", orders: pickupTriggered },
      { status: "pickup_delayed", orders: pickupDelayed },
    ],
  };
}
