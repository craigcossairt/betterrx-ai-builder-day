import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { addSupply, resetSupplies, suppliesFor } from "@/domain/supplies";

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

  it("adds a supply to the open patient and keeps Ray's kit", () => {
    resetSupplies();
    addSupply(asPatientId("PT-87950"), "Foam dressing 4x4");
    expect(suppliesFor(asPatientId("PT-87950")).map((row) => row.name)).toEqual([
      "Foam dressing 4x4",
    ]);
    expect(suppliesFor(asPatientId("PT-87411"))[0]?.name).toBe("Wound care kit");
    resetSupplies();
  });
});
