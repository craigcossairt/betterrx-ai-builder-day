import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type DeliveredOrder,
} from "@/domain/order";
import { confirmVendor, placeOrder, triggerPickup } from "@/domain/transition";

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
