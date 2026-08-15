import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  type OrderedOrder,
} from "@/domain/order";
import { orderToRow, rowToOrder } from "@/store/order-row";

const ordered: OrderedOrder = {
  id: asOrderId("DME-10231"),
  patientId: asPatientId("PT-88421"),
  hospice: asHospiceName("Sample Hospice A"),
  equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
  status: "ordered",
  orderType: "stat",
  orderedAt: asInstant("2026-08-14T14:14:00.000Z"),
  targetAt: asInstant("2026-08-14T19:00:00.000Z"),
  vendorId: null,
};

describe("order row", () => {
  it("round-trips an ordered bed without changing status fields", () => {
    const row = orderToRow(ordered);
    expect(row).toEqual({
      id: "DME-10231",
      status: "ordered",
      patient_id: "PT-88421",
      body: ordered,
    });
    expect(rowToOrder(row)).toEqual(ordered);
  });
});
