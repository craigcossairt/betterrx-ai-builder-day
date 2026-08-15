import { DEMO_TIME_ZONE, type Instant } from "./clock";
import type { DispatchedOrder, InTransitAtRiskOrder } from "./order";

function clockParts(at: Instant): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DEMO_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(at));
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { hour: get("hour"), minute: get("minute") };
}

function wallClock(at: Instant): string {
  const { hour, minute } = clockParts(at);
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function deliveryRiskWhy(eta: Instant, deadline: Instant): string {
  const missMinutes = Math.round(
    (new Date(eta).getTime() - new Date(deadline).getTime()) / 60_000,
  );
  return `Discharge is scheduled for ${wallClock(deadline)}. Current ETA misses that window by roughly ${missMinutes} minutes.`;
}

export function assessDeliveryRisk(
  order: DispatchedOrder | InTransitAtRiskOrder,
  deadline: Instant,
): DispatchedOrder | InTransitAtRiskOrder {
  if (order.eta > deadline) {
    return {
      id: order.id,
      patientId: order.patientId,
      hospice: order.hospice,
      kind: order.kind,
      equipment: order.equipment,
      notes: order.notes,
      status: "in_transit_at_risk",
      orderType: order.orderType,
      vendorId: order.vendorId,
      eta: order.eta,
      dischargeAt: deadline,
      riskWhy: deliveryRiskWhy(order.eta, deadline),
    };
  }
  return {
    id: order.id,
    patientId: order.patientId,
    hospice: order.hospice,
    kind: order.kind,
    equipment: order.equipment,
    notes: order.notes,
    status: "dispatched",
    orderType: order.orderType,
    vendorId: order.vendorId,
    eta: order.eta,
  };
}
