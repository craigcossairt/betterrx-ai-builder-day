import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import {
  getDeliveryPhoto,
  resetDeliveryPhotos,
  saveDeliveryPhoto,
} from "@/inbox/delivery-photos";

describe("delivery-photos", () => {
  it("stores the photo on the order, not as a one-time text", () => {
    resetDeliveryPhotos();
    const id = asOrderId("DME-10305");
    const now = asInstant("2026-08-15T12:00:00.000Z");
    saveDeliveryPhoto(id, now);
    expect(getDeliveryPhoto(id)?.storedAt).toBe(now);
  });
});
