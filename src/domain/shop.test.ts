import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { searchShop, shopItems } from "@/domain/shop";

describe("searchShop", () => {
  it("finds DME by name and keeps EMR picks for Eleanor", () => {
    const hits = searchShop({ kind: "dme", query: "oxy" });
    expect(hits.map((item) => item.code)).toEqual(["E1390"]);
    const emr = shopItems({
      kind: "dme",
      emrFor: asPatientId("PT-88421"),
    });
    expect(emr.map((item) => item.code)).toEqual(["E0250", "E1390"]);
  });

  it("lists wound care, briefs, and gloves without invented A-codes", () => {
    expect(searchShop({ kind: "supplies", query: "wound" }).map((item) => item.code)).toEqual([
      "SUP-WOUND",
    ]);
  });
});
