import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type DeliveredOrder,
} from "@/domain/order";
import { demoOfferWindow, offersFor } from "@/domain/offers";
import { rankOptions } from "@/domain/rank";
import {
  confirmQuotedOrder,
  confirmVendor,
  declineVendor,
  markDelivered,
  placeOrder,
  triggerPickup,
} from "@/domain/transition";

describe("transitions", () => {
  it("places an ordered bed that is not blocked on paperwork", () => {
    const order = placeOrder({
      patientId: asPatientId("PT-1"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
      orderType: "stat",
      targetAt: asInstant("2026-08-14T21:00:00.000Z"),
      now: asInstant("2026-08-14T15:00:00.000Z"),
    });
    expect(order.status).toBe("ordered");
    expect(order.vendorId).toBeNull();
    expect(order.orderType).toBe("stat");
  });

  it("writes the same pickup-triggered state from nurse tap or EMR", () => {
    const delivered: DeliveredOrder = {
      id: asOrderId("DME-10087"),
      patientId: asPatientId("PT-87950"),
      hospice: asHospiceName("Sample Hospice C"),
      equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
      status: "delivered",
      vendorId: asVendorId("vendor-1"),
      deliveredAt: asInstant("2026-08-13T16:52:00.000Z"),
      proofOfDelivery: { signature: true, timestamp: true },
    };
    const now = asInstant("2026-08-14T12:00:00.000Z");
    const nurse = triggerPickup(delivered, "nurse_request", now);
    const emr = triggerPickup(delivered, "patient_status_deceased", now);
    expect(nurse.status).toBe("pickup_triggered");
    expect(emr.status).toBe("pickup_triggered");
    expect(nurse.triggeredAt).toBe(now);
    expect(emr.triggeredAt).toBe(now);
  });

  it("keeps a declined order ordered and records the vendor reply", () => {
    const ordered = placeOrder({
      patientId: asPatientId("PT-1"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
      orderType: "stat",
      targetAt: asInstant("2026-08-14T21:00:00.000Z"),
      now: asInstant("2026-08-14T15:00:00.000Z"),
    });
    const declined = declineVendor(ordered);
    expect(declined.status).toBe("ordered");
    expect(declined.notes).toBe("Vendor declined.");
  });

  it("writes proof of delivery onto a dispatched order", () => {
    const ordered = placeOrder({
      patientId: asPatientId("PT-1"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [{ hcpcs: "E1390", name: "Oxygen Concentrator" }],
      orderType: "admission",
      targetAt: asInstant("2026-08-14T21:00:00.000Z"),
      now: asInstant("2026-08-14T15:00:00.000Z"),
    });
    const confirmed = confirmVendor(
      ordered,
      asVendorId("vendor-1"),
      asInstant("2026-08-14T20:00:00.000Z"),
    );
    const delivered = markDelivered(confirmed, asInstant("2026-08-14T20:40:00.000Z"));
    expect(delivered.status).toBe("delivered");
    expect(delivered.deliveredAt).toBe("2026-08-14T20:40:00.000Z");
    expect(delivered.proofOfDelivery).toEqual({ signature: true, timestamp: true });
  });

  it("keeps a late vendor quote so confirm flags the judge-placed order at-risk", () => {
    const now = asInstant("2026-08-14T15:00:00.000Z");
    const window = demoOfferWindow(now);
    const ranked = rankOptions(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
    );
    const late = ranked.find((option) => option.vendorId === "vendor-2");
    if (!late) throw new Error("expected vendor-2");
    const order = placeOrder({
      patientId: asPatientId("PT-88502"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [{ hcpcs: "E1390", name: "Oxygen Concentrator" }],
      orderType: "stat",
      targetAt: window.deadline,
      now,
      quotedVendorId: late.vendorId,
      quotedEta: late.eta,
    });
    expect(order.quotedVendorId).toBe("vendor-2");
    expect(order.quotedEta).toBe(window.lateEta);
    const assessed = confirmQuotedOrder(
      order,
      asVendorId("vendor-1"),
      window.preferredEta,
    );
    expect(assessed.vendorId).toBe("vendor-2");
    expect(assessed.status).toBe("in_transit_at_risk");
    expect(assessed.riskWhy).toMatch(/misses that window/);
  });

  it("confirms a vendor onto a dispatched order", () => {
    const ordered = placeOrder({
      patientId: asPatientId("PT-1"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [{ hcpcs: "E1390", name: "Oxygen Concentrator" }],
      orderType: "admission",
      targetAt: asInstant("2026-08-14T21:00:00.000Z"),
      now: asInstant("2026-08-14T15:00:00.000Z"),
    });
    const confirmed = confirmVendor(
      ordered,
      asVendorId("vendor-1"),
      asInstant("2026-08-14T20:00:00.000Z"),
    );
    expect(confirmed.status).toBe("dispatched");
    expect(confirmed.vendorId).toBe("vendor-1");
  });
});
