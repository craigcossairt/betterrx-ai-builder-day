import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { searchShop, shopItems, supplyCatalog } from "@/domain/shop";

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

  it("groups supplies by wound care, incontinence, and gloves", () => {
    expect(
      supplyCatalog().map((row) => [row.category, row.items.map((item) => item.name)]),
    ).toEqual([
      [
        "Wound care",
        ["Wound care kit", "Foam dressing 4x4", "Saline wound wash"],
      ],
      ["Incontinence", ["Incontinence briefs", "Underpads 23x36"]],
      ["Gloves", ["Nitrile gloves"]],
    ]);
  });
});
