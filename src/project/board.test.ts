import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { projectBoard } from "@/project/board";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("projectBoard", () => {
  it("puts DME-10305 in the in-transit at-risk lane", () => {
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const board = projectBoard(orders);
    expect(board.inTransitAtRisk.map((order) => order.id)).toEqual([
      "DME-10305",
    ]);
    expect(board.inTransitAtRisk[0]?.riskWhy).toBe(
      "Discharge is scheduled for 4:30 PM. Current ETA misses that window by roughly 40 minutes.",
    );
  });
});
