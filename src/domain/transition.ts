import type { Instant } from "./clock";
import type {
  DeliveredOrder,
  DispatchedOrder,
  EquipmentLine,
  HospiceName,
  OrderedOrder,
  OrderType,
  PatientId,
  PickupDelayedOrder,
  PickupTriggeredOrder,
  PickupTrigger,
  VendorId,
} from "./order";
import { asOrderId } from "./order";

export function placeOrder(input: {
  patientId: PatientId;
  hospice: HospiceName;
  equipment: readonly [EquipmentLine, ...EquipmentLine[]];
  orderType: OrderType;
  targetAt: Instant;
  now: Instant;
  id?: string;
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
  };
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

export function triggerPickup(
  order: DeliveredOrder | PickupTriggeredOrder | PickupDelayedOrder,
  trigger: PickupTrigger,
  now: Instant,
): PickupTriggeredOrder {
  if (order.status === "pickup_triggered" || order.status === "pickup_delayed") {
    return {
      id: order.id,
      patientId: order.patientId,
      hospice: order.hospice,
      equipment: order.equipment,
      notes: order.notes,
      status: "pickup_triggered",
      vendorId: order.vendorId,
      trigger: order.trigger,
      triggeredAt: order.triggeredAt,
    };
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
