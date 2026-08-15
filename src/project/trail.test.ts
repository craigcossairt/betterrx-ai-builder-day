import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { asInstant, frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { markPickedUp } from "@/domain/transition";
import { projectTrail } from "@/project/trail";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

function sampleOrders() {
  return parseSampleOrders(
    JSON.parse(readFileSync(samplePath, "utf8")),
    frozenClock("2026-08-14T17:00:00.000Z"),
  );
}

describe("projectTrail", () => {
  it("keeps six named steps and only stamps what the order actually has", () => {
    const eleanor = sampleOrders().find((order) => order.id === "DME-10231");
    const ray = sampleOrders().find((order) => order.id === "DME-09803");
    if (!eleanor || !ray) throw new Error("expected fixture orders");
    const waiting = projectTrail(eleanor);
    expect(waiting.map((step) => step.step)).toEqual([
      "ordered",
      "vendor_confirmed",
      "dispatched",
      "delivered",
      "pickup_requested",
      "picked_up",
    ]);
    expect(waiting[0]?.done).toBe(true);
    expect(waiting[0]?.at).toBe(eleanor.status === "ordered" ? eleanor.orderedAt : null);
    expect(waiting[1]?.done).toBe(false);
    expect(waiting[5]?.done).toBe(false);

    const late = projectTrail(ray);
    expect(late.find((step) => step.step === "pickup_requested")?.done).toBe(
      true,
    );
    expect(late.find((step) => step.step === "pickup_requested")?.at).toBe(
      ray.status === "pickup_delayed" ? ray.triggeredAt : null,
    );
    expect(late.find((step) => step.step === "picked_up")?.done).toBe(false);
  });

  it("stamps picked up on DME-09803 after markPickedUp", () => {
    const ray = sampleOrders().find((order) => order.id === "DME-09803");
    if (!ray || ray.status !== "pickup_delayed") {
      throw new Error("expected DME-09803");
    }
    const now = asInstant("2026-08-14T17:00:00.000Z");
    const trail = projectTrail(markPickedUp(ray, now));
    expect(trail.find((step) => step.step === "picked_up")?.done).toBe(true);
    expect(trail.find((step) => step.step === "picked_up")?.at).toBe(now);
    expect(trail.find((step) => step.step === "pickup_requested")?.at).toBe(
      ray.triggeredAt,
    );
  });
});
