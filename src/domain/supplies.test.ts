import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { suppliesFor } from "@/domain/supplies";

describe("suppliesFor", () => {
  it("keeps Ray's wound care kit in the home and leaves June empty", () => {
    expect(suppliesFor(asPatientId("PT-87411"))).toEqual([
      {
        patientId: "PT-87411",
        name: "Wound care kit",
        status: "delivered",
        staysAfterDeath: true,
      },
    ]);
    expect(suppliesFor(asPatientId("PT-87950"))).toEqual([]);
  });
});
