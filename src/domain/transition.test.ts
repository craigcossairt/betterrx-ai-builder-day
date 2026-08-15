import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { asInstant, frozenClock } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type DeliveredOrder,
} from "@/domain/order";
import { demoOfferWindow, offersFor } from "@/domain/offers";
import { rankOptions } from "@/domain/rank";
import { parseSampleOrders } from "@/parse/sample-orders";
import {
  confirmQuotedOrder,
  confirmVendor,
  declineVendor,
  markDelivered,
  markPickedUp,
  placeOrder,
  triggerPickup,
} from "@/domain/transition";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("transitions", () => {
  it("places bed and oxygen on one STAT order", () => {
    const order = placeOrder({
      patientId: asPatientId("PT-1"),
      hospice: asHospiceName("Sample Hospice A"),
      equipment: [
        { hcpcs: "E0250", name: "Hospital Bed" },
        { hcpcs: "E1390", name: "Oxygen Concentrator" },
      ],
      orderType: "stat",
      targetAt: asInstant("2026-08-14T21:00:00.000Z"),
      now: asInstant("2026-08-14T15:00:00.000Z"),
    });
    expect(order.status).toBe("ordered");
    expect(order.equipment).toEqual([
      { hcpcs: "E0250", name: "Hospital Bed" },
      { hcpcs: "E1390", name: "Oxygen Concentrator" },
    ]);
  });

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
    if (assessed.status !== "in_transit_at_risk") {
      throw new Error("expected in_transit_at_risk");
    }
    expect(assessed.riskWhy).toMatch(/misses that window/);
  });

  it("keeps a delayed pickup delayed and keeps the fixture riskWhy", () => {
    const clock = frozenClock("2026-08-14T17:00:00.000Z");
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      clock,
    );
    const delayed = orders.find((order) => order.id === "DME-09803");
    if (!delayed || delayed.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    const again = triggerPickup(delayed, delayed.trigger, delayed.triggeredAt);
    expect(again.status).toBe("pickup_delayed");
    expect(again).toMatchObject({
      status: "pickup_delayed",
      riskWhy:
        "Pickup was triggered four days ago with no scheduled retrieval. Family has called the hospice twice asking for the bed to be removed.",
    });
  });

  it("marks a delayed pickup as picked up and keeps trigger fields", () => {
    const clock = frozenClock("2026-08-14T17:00:00.000Z");
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      clock,
    );
    const delayed = orders.find((order) => order.id === "DME-09803");
    if (!delayed || delayed.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    const now = asInstant("2026-08-14T17:00:00.000Z");
    const picked = markPickedUp(delayed, now);
    expect(picked.status).toBe("picked_up");
    expect(picked.pickedUpAt).toBe(now);
    expect(picked.vendorId).toBe(delayed.vendorId);
    expect(picked.trigger).toBe(delayed.trigger);
    expect(picked.triggeredAt).toBe(delayed.triggeredAt);
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
