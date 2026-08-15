import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CATALOG } from "@/domain/catalog";
import { frozenClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { projectDonQueue } from "@/project/don-queue";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

describe("projectDonQueue", () => {
  it("flags Margaret's STAT oxygen as retro and Ray's bed as the idle clock", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      frozenClock("2026-08-14T17:00:00.000Z"),
    );
    const queue = projectDonQueue(orders, CATALOG, now);
    expect(queue.waiting.map((item) => item.kind)).toEqual(["retro"]);
    expect(queue.waiting[0]).toMatchObject({
      kind: "retro",
      orderId: "DME-10305",
      who: "Margaret Holt",
      hcpcs: "E1390",
    });
    expect(queue.clock.orderId).toBe("DME-09803");
    expect(queue.clock.idleDays).toBe(4);
    expect(queue.clock.sentence).toMatch(/same day/i);
    expect(queue.clock.sentence).toMatch(/\$10\.28/);
  });

  it("drops a retro flag after the DON acknowledges it", () => {
    const now = frozenClock("2026-08-14T17:00:00.000Z").now();
    const orders = parseSampleOrders(
      JSON.parse(readFileSync(samplePath, "utf8")),
      frozenClock("2026-08-14T17:00:00.000Z"),
    ).map((order) =>
      order.id === "DME-10305"
        ? { ...order, notes: "DON acknowledged retro" }
        : order,
    );
    const queue = projectDonQueue(orders, CATALOG, now);
    expect(queue.waiting).toEqual([]);
  });
});
