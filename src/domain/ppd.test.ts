import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { frozenClock } from "@/domain/clock";
import { censusPpd } from "@/domain/ppd";
import { parseSampleOrders } from "@/parse/sample-orders";
import { triggerPickup } from "@/domain/transition";

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
    const running = censusPpd(orders, CATALOG, 7);
    const stopped = censusPpd(
      orders.map((order) =>
        order.id === "DME-09803"
          ? triggerPickup(delayed, delayed.trigger, delayed.triggeredAt)
          : order,
      ),
      CATALOG,
      7,
    );
    expect(running.idlePickupDays).toBe(4);
    expect(stopped.idlePickupDays).toBe(0);
    expect(running.actualUsd).toBeGreaterThan(stopped.actualUsd);
    expect(running.bufferDays).toBe(0);
    expect(running.preferredOverrides).toBe(0);
  });
});
