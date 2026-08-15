import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { asInstant } from "@/domain/clock";
import { asVendorId } from "@/domain/order";
import {
  COST_THRESHOLD_USD,
  chooseOffer,
  demoOfferWindow,
  offersFor,
  presentOffers,
} from "@/domain/offers";
import { rankOptions } from "@/domain/rank";

const now = asInstant("2026-08-14T15:00:00.000Z");
const window = demoOfferWindow(now);

describe("presentOffers", () => {
  it("shows stock, ETA, and catalog price with the preferred option first", () => {
    const cards = presentOffers(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    );
    expect(cards).toHaveLength(2);
    expect(cards[0]).toMatchObject({
      vendorId: "vendor-1",
      preferred: true,
      stock: "in",
      beatsWindow: true,
      dailyRateUsd: 2.57,
      rateLabel: "CMS-shaped",
    });
    expect(cards[1]).toMatchObject({
      vendorId: "vendor-2",
      preferred: false,
      stock: "unknown",
      beatsWindow: false,
      dailyRateUsd: 3.37,
      rateLabel: "synthetic",
    });
    expect(cards[0].eta).toBe(window.preferredEta);
    expect(cards[1].eta).toBe(window.lateEta);
  });

  it("labels E1390 at the locked CMS-shaped $3.34 rate", () => {
    const [preferred] = presentOffers(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    );
    expect(preferred.dailyRateUsd).toBe(3.34);
    expect(preferred.rateLabel).toBe("CMS-shaped");
  });
});

describe("chooseOffer", () => {
  it("lets a STAT bed through under the $3 threshold without a DON reason", () => {
    const ranked = rankOptions(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
    );
    const chosen = chooseOffer({
      ranked,
      vendorId: asVendorId("vendor-1"),
      overrideReason: "",
      donReason: "",
    });
    expect(chosen.dailyRateUsd).toBeLessThan(COST_THRESHOLD_USD);
    expect(chosen.vendorId).toBe("vendor-1");
  });

  it("blocks an override of the preferred option without a reason", () => {
    const ranked = rankOptions(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
    );
    expect(() =>
      chooseOffer({
        ranked,
        vendorId: asVendorId("vendor-2"),
        overrideReason: "",
        donReason: "alternate vendor still beats the night shift",
      }),
    ).toThrow("override needs a reason");
  });

  it("lets STAT oxygen through the $3 gate without a DON reason", () => {
    const ranked = rankOptions(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
    );
    const chosen = chooseOffer({
      ranked,
      vendorId: asVendorId("vendor-1"),
      overrideReason: "",
      donReason: "",
      orderType: "stat",
    });
    expect(chosen.dailyRateUsd).toBe(3.34);
    expect(chosen.vendorId).toBe("vendor-1");
  });

  it("blocks E1390 until the director of nursing leaves a reason", () => {
    const ranked = rankOptions(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
    );
    expect(() =>
      chooseOffer({
        ranked,
        vendorId: asVendorId("vendor-1"),
        overrideReason: "",
        donReason: "",
        orderType: "routine",
      }),
    ).toThrow("director of nursing approval needed");
    const chosen = chooseOffer({
      ranked,
      vendorId: asVendorId("vendor-1"),
      overrideReason: "",
      donReason: "night admission, concentrator required",
    });
    expect(chosen.dailyRateUsd).toBe(3.34);
  });
});
