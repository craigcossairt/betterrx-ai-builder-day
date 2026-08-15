import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

function loadSample(): unknown {
  return JSON.parse(readFileSync(samplePath, "utf8"));
}

describe("parseSampleOrders", () => {
  it("maps sample E0601 oxygen on the STAT card to E1390 oxygen concentrator", () => {
    const orders = parseSampleOrders(
      loadSample(),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const stat = orders.find((order) => order.id === "DME-10305");
    expect(stat?.equipment).toEqual([
      { hcpcs: "E1390", name: "Oxygen Concentrator" },
    ]);
  });

  it("keeps the sample statuses as stored state", () => {
    const orders = parseSampleOrders(
      loadSample(),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    expect(orders.map((order) => [order.id, order.status])).toEqual([
      ["DME-10231", "ordered"],
      ["DME-10198", "dispatched"],
      ["DME-10305", "in_transit_at_risk"],
      ["DME-10087", "delivered"],
      ["DME-09911", "pickup_triggered"],
      ["DME-09803", "pickup_delayed"],
      ["DME-10322", "ordered"],
    ]);
  });

  it("maps the pickup-triggered oxygen line to E1390", () => {
    const orders = parseSampleOrders(
      loadSample(),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const pickup = orders.find((order) => order.id === "DME-09911");
    expect(pickup?.equipment.map((line) => line.hcpcs)).toEqual([
      "E1130",
      "E1390",
    ]);
  });
});
