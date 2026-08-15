import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { censusSentence, projectCensus } from "@/project/census";

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

describe("projectCensus", () => {
  it("lists at-risk and delayed pickup before the rest of the census", () => {
    const census = projectCensus(sampleOrders());
    expect(census.rows.slice(0, 2).map((row) => row.order.id)).toEqual([
      "DME-10305",
      "DME-09803",
    ]);
    expect(census.rows[0]?.attention).toBe(true);
    expect(census.rows[1]?.attention).toBe(true);
    expect(census.atRisk).toBe(1);
    expect(census.delayedPickup).toBe(1);
    expect(census.awaitingVendor).toBe(1);
  });

  it("speaks Margaret's miss and Ray's four-day pickup as sentences", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const orders = sampleOrders();
    const margaret = orders.find((order) => order.id === "DME-10305");
    const ray = orders.find((order) => order.id === "DME-09803");
    if (!margaret || !ray) throw new Error("expected fixture orders");
    expect(censusSentence(margaret, now)).toBe(
      "Margaret Holt's oxygen misses the 4:30 discharge by about 40 minutes.",
    );
    expect(censusSentence(ray, now)).toBe(
      "Ray Delgado's bed has been waiting 4 days for pickup. The family has called.",
    );
  });

  it("keeps quiet rows to one sentence", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const eleanor = sampleOrders().find((order) => order.id === "DME-10231");
    if (!eleanor) throw new Error("expected Eleanor's bed order");
    expect(censusSentence(eleanor, now)).toBe(
      "Eleanor Bishop's bed is waiting on a vendor.",
    );
  });
});
