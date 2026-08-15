import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type DispatchedOrder,
} from "@/domain/order";
import { markDelivered } from "@/domain/transition";

const dispatched: DispatchedOrder = {
  id: asOrderId("DME-10198"),
  patientId: asPatientId("PT-88190"),
  hospice: asHospiceName("Sample Hospice B"),
  equipment: [{ hcpcs: "E1130", name: "Wheelchair" }],
  status: "dispatched",
  orderType: "routine",
  vendorId: asVendorId("vendor-1"),
  eta: asInstant("2026-08-14T18:00:00.000Z"),
};

const now = asInstant("2026-08-14T17:00:00.000Z");

describe("proof of delivery photo", () => {
  it("lets delivered succeed with no photo", () => {
    const delivered = markDelivered(dispatched, now);
    expect(delivered.proofOfDelivery.signature).toBe(true);
    expect(delivered.proofOfDelivery.photoUrl).toBeUndefined();
  });

  it("stores a labeled fixture photo when the vendor attaches one", () => {
    const delivered = markDelivered(dispatched, now, "/brand/pod-sample.svg");
    expect(delivered.proofOfDelivery.photoUrl).toBe("/brand/pod-sample.svg");
  });
});
