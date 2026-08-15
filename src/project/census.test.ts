import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { projectCensus } from "@/project/census";

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
});
