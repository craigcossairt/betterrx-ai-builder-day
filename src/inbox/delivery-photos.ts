import type { Instant } from "@/domain/clock";
import type { OrderId } from "@/domain/order";

export type DeliveryPhoto = {
  orderId: OrderId;
  storedAt: Instant;
};

const photos = new Map<OrderId, DeliveryPhoto>();

export function getDeliveryPhoto(orderId: OrderId): DeliveryPhoto | undefined {
  return photos.get(orderId);
}

export function saveDeliveryPhoto(orderId: OrderId, now: Instant): DeliveryPhoto {
  const next = { orderId, storedAt: now };
  photos.set(orderId, next);
  return next;
}

export function clearDeliveryPhoto(orderId: OrderId): void {
  photos.delete(orderId);
}

export function resetDeliveryPhotos(): void {
  photos.clear();
}
