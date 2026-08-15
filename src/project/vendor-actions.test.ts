import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { vendorActions } from "@/project/vendor-actions";

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

describe("vendorActions", () => {
  it("offers confirm, yes-but, and decline on an unconfirmed order", () => {
    const eleanor = sampleOrders().find((order) => order.id === "DME-10231");
    if (!eleanor) throw new Error("expected DME-10231");
    expect(vendorActions(eleanor)).toEqual(["confirm", "yes_but", "decline"]);
  });

  it("offers delivered on a dispatched wheelchair", () => {
    const sam = sampleOrders().find((order) => order.id === "DME-10198");
    if (!sam) throw new Error("expected DME-10198");
    expect(vendorActions(sam)).toEqual(["delivered"]);
  });

  it("offers a pickup window and picked up on DME-09803", () => {
    const ray = sampleOrders().find((order) => order.id === "DME-09803");
    if (!ray) throw new Error("expected DME-09803");
    expect(vendorActions(ray)).toEqual(["pickup_window", "picked_up"]);
  });
});
