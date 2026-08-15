import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { assessDeliveryRisk, deliveryRiskWhy } from "@/domain/risk";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("assessDeliveryRisk", () => {
  it("flags DME-10305 because 5:10 PM misses 4:30 PM discharge", () => {
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const row = orders.find((order) => order.id === "DME-10305");
    if (!row || row.status !== "in_transit_at_risk") {
      throw new Error("expected DME-10305");
    }
    const assessed = assessDeliveryRisk(
      {
        id: row.id,
        patientId: row.patientId,
        hospice: row.hospice,
        equipment: row.equipment,
        notes: row.notes,
        status: "dispatched",
        orderType: row.orderType,
        vendorId: row.vendorId,
        eta: row.eta,
      },
      row.dischargeAt,
    );
    expect(assessed.status).toBe("in_transit_at_risk");
    if (assessed.status !== "in_transit_at_risk") throw new Error("expected at-risk");
    expect(assessed.riskWhy).toBe(
      "Discharge is scheduled for 4:30 PM. Current ETA misses that window by roughly 40 minutes.",
    );
    expect(deliveryRiskWhy(row.eta, row.dischargeAt)).toBe(assessed.riskWhy);
  });
});
