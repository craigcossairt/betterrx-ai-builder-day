import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { lookupPatient } from "@/domain/patients";

describe("lookupPatient", () => {
  it("returns the locked display name for Margaret Holt", () => {
    expect(lookupPatient(asPatientId("PT-88502")).displayName).toBe(
      "Margaret Holt",
    );
  });

  it("names the sixth seed Helen Vargas", () => {
    expect(lookupPatient(asPatientId("PT-87602")).displayName).toBe(
      "Helen Vargas",
    );
  });
});
