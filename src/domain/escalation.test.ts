import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { escalate } from "@/domain/escalation";
import { parseSampleOrders } from "@/parse/sample-orders";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("escalate", () => {
  it("hands DME-10305 to a named case manager and DME-09803 to the director of nursing", () => {
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const atRisk = orders.find((order) => order.id === "DME-10305");
    const delayed = orders.find((order) => order.id === "DME-09803");
    const delivered = orders.find((order) => order.id === "DME-10087");
    if (!atRisk || !delayed || !delivered) throw new Error("expected sample rows");
    expect(escalate(atRisk)).toEqual({
      name: "Jordan Hale",
      role: "case_manager",
    });
    expect(escalate(delayed)).toEqual({
      name: "Priya Shah",
      role: "don",
    });
    expect(escalate(delivered)).toBeNull();
  });
});
