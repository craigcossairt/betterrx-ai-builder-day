import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { asInstant } from "@/domain/clock";
import { asVendorId } from "@/domain/order";
import { offersFor, presentOffers } from "@/domain/offers";
import { reviewLines } from "@/project/line-review";

const now = asInstant("2026-08-14T15:00:00.000Z");
const deadline = asInstant("2026-08-14T19:00:00.000Z");
const preferred = asInstant("2026-08-14T17:00:00.000Z");
const late = asInstant("2026-08-14T23:00:00.000Z");

describe("reviewLines", () => {
  it("judges bed and oxygen against the same discharge window", () => {
    const offerSets = {
      E0250: presentOffers(offersFor("E0250", preferred, late), deadline, CATALOG),
      E1390: presentOffers(offersFor("E1390", preferred, late), deadline, CATALOG),
      E1130: presentOffers(offersFor("E1130", preferred, late), deadline, CATALOG),
    };
    const onTime = reviewLines(
      [
        { code: "E0250", name: "Hospital Bed" },
        { code: "E1390", name: "Oxygen Concentrator" },
      ],
      asVendorId("vendor-1"),
      offerSets,
      deadline,
    );
    expect(onTime.map((line) => line.vsWindow)).toEqual(["early", "early"]);
    const lateVendor = reviewLines(
      [
        { code: "E0250", name: "Hospital Bed" },
        { code: "E1390", name: "Oxygen Concentrator" },
      ],
      asVendorId("vendor-2"),
      offerSets,
      deadline,
    );
    expect(lateVendor[1]?.vsWindow).toBe("late");
    expect(lateVendor[1]?.deltaLabel).toMatch(/late/i);
  });

  it("lets one line try the other vendor without moving the rest", () => {
    const offerSets = {
      E0250: presentOffers(offersFor("E0250", preferred, late), deadline, CATALOG),
      E1390: presentOffers(offersFor("E1390", preferred, late), deadline, CATALOG),
      E1130: presentOffers(offersFor("E1130", preferred, late), deadline, CATALOG),
    };
    const mixed = reviewLines(
      [
        { code: "E0250", name: "Hospital Bed" },
        { code: "E1390", name: "Oxygen Concentrator" },
      ],
      asVendorId("vendor-1"),
      offerSets,
      deadline,
      { E1390: "vendor-2" },
    );
    expect(mixed.map((line) => [line.code, line.vendorId, line.vsWindow])).toEqual([
      ["E0250", "vendor-1", "early"],
      ["E1390", "vendor-2", "late"],
    ]);
  });
});
