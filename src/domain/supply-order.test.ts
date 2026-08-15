import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asPatientId,
  asVendorId,
  orderKind,
} from "@/domain/order";
import { dischargeReady } from "@/domain/discharge";
import {
  confirmVendor,
  markDelivered,
  placeOrder,
  triggerPickup,
} from "@/domain/transition";

const now = asInstant("2026-08-15T15:00:00.000Z");

function woundKit() {
  return placeOrder({
    patientId: asPatientId("PT-87950"),
    hospice: asHospiceName("Sample Hospice C"),
    equipment: [{ hcpcs: "SUP-WOUND", name: "Wound care kit" }],
    orderType: "routine",
    targetAt: asInstant("2026-08-16T15:00:00.000Z"),
    now,
    kind: "supply",
  });
}

describe("supply orders", () => {
  it("places a supply order that stays kind supply", () => {
    const order = woundKit();
    expect(orderKind(order)).toBe("supply");
    expect(order.equipment[0]).toEqual({
      hcpcs: "SUP-WOUND",
      name: "Wound care kit",
    });
  });

  it("cannot enter pickup-triggered", () => {
    const ordered = woundKit();
    const delivered = markDelivered(
      confirmVendor(ordered, asVendorId("vendor-1"), now),
      now,
    );
    expect(() => triggerPickup(delivered, "nurse_request", now)).toThrow(
      /supply/i,
    );
  });

  it("does not block discharge while a supply is still ordered", () => {
    expect(dischargeReady([woundKit()])).toEqual({ ready: true });
  });
});
