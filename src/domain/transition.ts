import type { Instant } from "./clock";
import type {
  DeliveredOrder,
  DispatchedOrder,
  EquipmentLine,
  HospiceName,
  InTransitAtRiskOrder,
  OrderedOrder,
  OrderType,
  PatientId,
  PickedUpOrder,
  PickupDelayedOrder,
  PickupTriggeredOrder,
  PickupTrigger,
  VendorId,
} from "./order";
import { asOrderId } from "./order";
import { assessDeliveryRisk } from "./risk";

export function placeOrder(input: {
  patientId: PatientId;
  hospice: HospiceName;
  equipment: readonly [EquipmentLine, ...EquipmentLine[]];
  orderType: OrderType;
  targetAt: Instant;
  now: Instant;
  id?: string;
  quotedVendorId?: VendorId;
  quotedEta?: Instant;
}): OrderedOrder {
  return {
    id: asOrderId(input.id ?? `DME-${input.now.slice(0, 19).replace(/[-:T]/g, "")}`),
    patientId: input.patientId,
    hospice: input.hospice,
    equipment: input.equipment,
    status: "ordered",
    orderType: input.orderType,
    orderedAt: input.now,
    targetAt: input.targetAt,
    vendorId: null,
    quotedVendorId: input.quotedVendorId,
    quotedEta: input.quotedEta,
  };
}

export function confirmQuotedOrder(
  order: OrderedOrder,
  fallbackVendorId: VendorId,
  fallbackEta: Instant,
): DispatchedOrder | InTransitAtRiskOrder {
  return assessDeliveryRisk(
    confirmVendor(
      order,
      order.quotedVendorId ?? fallbackVendorId,
      order.quotedEta ?? fallbackEta,
    ),
    order.targetAt,
  );
}

export function confirmVendor(
  order: OrderedOrder,
  vendorId: VendorId,
  eta: Instant,
): DispatchedOrder {
  return {
    id: order.id,
    patientId: order.patientId,
    hospice: order.hospice,
    equipment: order.equipment,
    notes: order.notes,
    status: "dispatched",
    orderType: order.orderType,
    vendorId,
    eta,
  };
}

export function reviseQuotedEta(
  order: OrderedOrder,
  eta: Instant,
): OrderedOrder {
  return {
    ...order,
    quotedEta: eta,
    notes: `${order.notes ?? ""} New ETA offered.`.trim(),
  };
}

export function notePickupWindow(
  order: PickupTriggeredOrder | PickupDelayedOrder,
  windowLabel: string,
): PickupTriggeredOrder | PickupDelayedOrder {
  return {
    ...order,
    notes: `${order.notes ?? ""} Pickup window: ${windowLabel}.`.trim(),
  };
}

export function declineVendor(order: OrderedOrder): OrderedOrder {
  return {
    ...order,
    notes: `${order.notes ?? ""} Vendor declined.`.trim(),
  };
}

export function markDelivered(
  order: DispatchedOrder | InTransitAtRiskOrder,
  now: Instant,
): DeliveredOrder {
  return {
    id: order.id,
    patientId: order.patientId,
    hospice: order.hospice,
    equipment: order.equipment,
    notes: order.notes,
    status: "delivered",
    vendorId: order.vendorId,
    deliveredAt: now,
    proofOfDelivery: { signature: true, timestamp: true },
  };
}

export function triggerPickup(
  order: DeliveredOrder | PickupTriggeredOrder | PickupDelayedOrder,
  trigger: PickupTrigger,
  now: Instant,
): PickupTriggeredOrder | PickupDelayedOrder {
  if (order.status === "pickup_delayed") {
    return order;
  }
  if (order.status === "pickup_triggered") {
    return order;
  }
  return {
    id: order.id,
    patientId: order.patientId,
    hospice: order.hospice,
    equipment: order.equipment,
    notes: order.notes,
    status: "pickup_triggered",
    vendorId: order.vendorId,
    trigger,
    triggeredAt: now,
  };
}

export function markPickedUp(
  order: PickupTriggeredOrder | PickupDelayedOrder | PickedUpOrder,
  now: Instant,
): PickedUpOrder {
  if (order.status === "picked_up") return order;
  return {
    id: order.id,
    patientId: order.patientId,
    hospice: order.hospice,
    equipment: order.equipment,
    notes: order.notes,
    status: "picked_up",
    vendorId: order.vendorId,
    trigger: order.trigger,
    triggeredAt: order.triggeredAt,
    pickedUpAt: now,
  };
}
