import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type DeliveredOrder,
  type OrderedOrder,
} from "@/domain/order";
import { dischargeReady } from "@/domain/discharge";

const patient = asPatientId("PT-1");
const hospice = asHospiceName("Sample Hospice A");

const ordered: OrderedOrder = {
  id: asOrderId("DME-NEW"),
  patientId: patient,
  hospice,
  equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
  status: "ordered",
  orderType: "stat",
  orderedAt: asInstant("2026-08-14T14:00:00.000Z"),
  targetAt: asInstant("2026-08-14T21:00:00.000Z"),
  vendorId: null,
};

const delivered: DeliveredOrder = {
  id: asOrderId("DME-OLD"),
  patientId: patient,
  hospice,
  equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
  status: "delivered",
  vendorId: asVendorId("vendor-1"),
  deliveredAt: asInstant("2026-08-14T16:00:00.000Z"),
  proofOfDelivery: { signature: true, timestamp: true },
};

describe("dischargeReady", () => {
  it("blocks when required equipment is not delivered", () => {
    expect(dischargeReady([ordered])).toEqual({
      ready: false,
      blocking: ["DME-NEW"],
    });
  });

  it("allows discharge once required equipment is delivered", () => {
    expect(dischargeReady([delivered])).toEqual({ ready: true });
  });
});
