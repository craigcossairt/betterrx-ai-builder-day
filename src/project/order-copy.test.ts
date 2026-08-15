import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { asInstant } from "@/domain/clock";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { costNote, offerStory, sendLabel } from "@/project/order-copy";

const now = asInstant("2026-08-14T15:00:00.000Z");
const window = demoOfferWindow(now);

describe("offerStory", () => {
  it("says the preferred option arrives before discharge", () => {
    const [preferred] = presentOffers(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    );
    const story = offerStory(preferred, window.deadline);
    expect(story.mark).toBe("BEST");
    expect(story.headline).toBe("Arrives about 12:00 PM - before discharge.");
    expect(story.detail).toBe("In stock · $2.57 a day");
  });

  it("says how late the other option misses discharge", () => {
    const cards = presentOffers(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    );
    const late = cards[1];
    if (!late) throw new Error("expected a late option");
    const story = offerStory(late, window.deadline);
    expect(story.mark).toBe("OTHER OPTION");
    expect(story.headline).toBe("Arrives about 6:00 PM - 4 hours late.");
    expect(story.detail).toBe("Stock unknown · $3.37 a day");
  });
});

describe("sendLabel", () => {
  it("names the gear on the send button", () => {
    expect(sendLabel("E0250")).toBe("Send order - bed");
  });
});

describe("costNote", () => {
  it("tells the nurse STAT oxygen does not wait on the $3 gate", () => {
    expect(
      costNote({ orderType: "stat", dailyRateUsd: 3.34, hcpcs: "E1390" }),
    ).toBe(
      "Oxygen costs over $3 a day, so the director of nursing gets a note after. The order does not wait.",
    );
  });

  it("stays quiet when the rate is under $3", () => {
    expect(
      costNote({ orderType: "stat", dailyRateUsd: 2.57, hcpcs: "E0250" }),
    ).toBeNull();
  });
});
