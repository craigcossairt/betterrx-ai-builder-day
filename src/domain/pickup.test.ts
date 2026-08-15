import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { formatElapsed, pickupElapsedDays } from "@/domain/pickup";
import { parseSampleOrders } from "@/parse/sample-orders";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("pickupElapsedDays", () => {
  it("shows four elapsed days on DME-09803", () => {
    const clock = frozenClock("2026-08-14T17:00:00.000Z");
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      clock,
    );
    const delayed = orders.find((order) => order.id === "DME-09803");
    if (!delayed || delayed.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    expect(pickupElapsedDays(delayed.triggeredAt, clock.now())).toBe(4);
    expect(formatElapsed(delayed.triggeredAt, clock.now())).toBe("4 days");
  });

  it("reads hours and minutes when the gap is under 48 hours", () => {
    const from = frozenClock("2026-08-14T13:48:00.000Z").now();
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    expect(formatElapsed(from, now)).toBe("3 hours 12 minutes");
  });
});
