import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { asInstant, frozenClock } from "@/domain/clock";
import { censusPpd } from "@/domain/ppd";
import { parseSampleOrders } from "@/parse/sample-orders";
import { markPickedUp } from "@/domain/transition";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("censusPpd", () => {
  it("drops when DME-09803 stops the clock at trigger instead of four extra days", () => {
    const clock = frozenClock("2026-08-14T17:00:00.000Z");
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      clock,
    );
    const delayed = orders.find((order) => order.id === "DME-09803");
    if (!delayed || delayed.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    const now = clock.now();
    const running = censusPpd(orders, CATALOG, 7, now);
    const stopped = censusPpd(
      orders.map((order) =>
        order.id === "DME-09803"
          ? markPickedUp(delayed, delayed.triggeredAt)
          : order,
      ),
      CATALOG,
      7,
      now,
    );
    expect(running.idlePickupDays).toBe(4);
    expect(stopped.idlePickupDays).toBe(0);
    expect(running.actualUsd).toBeGreaterThan(stopped.actualUsd);
    expect(running.bufferDays).toBe(0);
    expect(running.preferredOverrides).toBe(0);
  });

  it("counts idle days from the stored trigger, not a hardcoded plus four", () => {
    const clock = frozenClock("2026-08-14T17:00:00.000Z");
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      clock,
    );
    const delayed = orders.find((order) => order.id === "DME-09803");
    if (!delayed || delayed.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    const hourAgo = asInstant("2026-08-14T16:00:00.000Z");
    const fresh = censusPpd(
      orders.map((order) =>
        order.id === "DME-09803" ? { ...delayed, triggeredAt: hourAgo } : order,
      ),
      CATALOG,
      7,
      clock.now(),
    );
    expect(fresh.idlePickupDays).toBe(0);
  });
});
