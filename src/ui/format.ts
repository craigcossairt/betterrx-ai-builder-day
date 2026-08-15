import type { Instant } from "@/domain/clock";
import { DEMO_TIME_ZONE } from "@/domain/clock";
import type { OrderStatus } from "@/domain/order";

const LABELS: Record<OrderStatus, string> = {
  ordered: "Ordered",
  dispatched: "Dispatched",
  in_transit_at_risk: "In transit / at risk",
  delivered: "Delivered",
  pickup_triggered: "Pickup triggered",
  pickup_delayed: "Pickup delayed",
};

export function formatLaneLabel(status: OrderStatus): string {
  return LABELS[status];
}

export function formatVendor(vendorId: string): string {
  if (vendorId === "vendor-1") return "Wasatch Home Medical";
  if (vendorId === "vendor-2") return "Uintah Valley DME";
  return vendorId;
}

export function formatWhen(at: Instant): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DEMO_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(at));
}

export function formatStamp(at: Instant): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DEMO_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(at));
}
