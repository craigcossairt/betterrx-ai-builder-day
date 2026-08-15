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
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const census = projectCensus(sampleOrders(), now);
    expect(census.lines.slice(0, 3).map((line) => line.order.id)).toEqual([
      "DME-10231",
      "DME-10305",
      "DME-09803",
    ]);
    expect(census.lines[0]?.kind).toBe("loud");
    expect(census.lines[0]?.tone).toBe("coral");
    expect(census.lines[1]?.kind).toBe("loud");
    expect(census.lines[1]?.tone).toBe("coral");
    expect(census.lines[2]?.kind).toBe("loud");
    expect(census.lines[2]?.tone).toBe("plain");
    expect(census.atRisk).toBe(2);
    expect(census.delayedPickup).toBe(1);
    expect(census.awaitingVendor).toBe(1);
    expect(census.lede).toBe("Three patients need you.");
  });

  it("speaks Margaret's miss and Ray's four-day pickup as sentences", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const orders = sampleOrders();
    const margaret = orders.find((order) => order.id === "DME-10305");
    const ray = orders.find((order) => order.id === "DME-09803");
    if (!margaret || !ray) throw new Error("expected fixture orders");
    expect(censusSentence(margaret, now)).toBe(
      "The oxygen misses the 4:30 discharge by about 40 minutes.",
    );
    expect(censusSentence(ray, now)).toBe(
      "The bed has been waiting 4 days for pickup.",
    );
  });

  it("speaks Eleanor's missing vendor confirm in the 24-hour grace words", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const eleanor = sampleOrders().find((order) => order.id === "DME-10231");
    if (!eleanor) throw new Error("expected Eleanor's bed order");
    expect(censusSentence(eleanor, now)).toBe(
      "The bed is waiting on a vendor. The vendor has not confirmed. Grace is 24 hours.",
    );
  });

  it("names the patient on the line so the page can lead with who", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const eleanor = sampleOrders().find((order) => order.id === "DME-10231");
    if (!eleanor) throw new Error("expected Eleanor's bed order");
    const [line] = projectCensus([eleanor], now).lines;
    expect(line?.who).toBe("Eleanor Bishop");
  });

  it("stamps AT RISK, PICKUP LATE, and WAITING as track labels", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const byId = Object.fromEntries(
      projectCensus(sampleOrders(), now).lines.map((line) => [
        line.order.id,
        line,
      ]),
    );
    expect(byId["DME-10305"]?.trackLabel).toBe("AT RISK");
    expect(byId["DME-09803"]?.trackLabel).toBe("PICKUP LATE");
    expect(byId["DME-10231"]?.trackLabel).toBe("AT RISK");
  });

  it("keeps a quiet third line on loud cards only", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const byId = Object.fromEntries(
      projectCensus(sampleOrders(), now).lines.map((line) => [
        line.order.id,
        line,
      ]),
    );
    expect(byId["DME-10305"]?.aside).toBe("Jordan Hale, case manager.");
    expect(byId["DME-09803"]?.aside).toBe("The family has called.");
    expect(byId["DME-10231"]?.aside).toBeNull();
  });
});
