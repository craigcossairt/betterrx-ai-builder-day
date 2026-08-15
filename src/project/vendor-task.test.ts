import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { frozenClock } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import { parseSampleOrders } from "@/parse/sample-orders";
import { projectVendorTask } from "@/project/vendor-task";

const samplePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/sample-orders.json",
);

function fixtures() {
  return parseSampleOrders(
    JSON.parse(readFileSync(samplePath, "utf8")),
    frozenClock("2026-08-14T17:00:00.000Z"),
  );
}

describe("projectVendorTask", () => {
  it("opens Eleanor's ordered bed as the confirm question", () => {
    const task = projectVendorTask(fixtures(), asOrderId("DME-10231"));
    expect(task.kind).toBe("confirm");
    if (task.kind !== "confirm") return;
    expect(task.patient).toBe("Eleanor Bishop");
    expect(task.gear).toBe("Hospital Bed");
    expect(task.question).toMatch(/Can you be there/i);
  });

  it("opens Margaret's at-risk oxygen as the delivery question", () => {
    const task = projectVendorTask(fixtures(), asOrderId("DME-10305"));
    expect(task.kind).toBe("deliver");
    if (task.kind !== "deliver") return;
    expect(task.patient).toBe("Margaret Holt");
    expect(task.gear).toBe("Oxygen Concentrator");
  });

  it("opens Helen's death pickup as a window, and Ray as the clock-stop tap", () => {
    const helen = projectVendorTask(fixtures(), asOrderId("DME-09911"));
    const ray = projectVendorTask(fixtures(), asOrderId("DME-09803"));
    expect(helen.kind).toBe("pickup_window");
    expect(ray.kind).toBe("picked_up");
    if (ray.kind !== "picked_up") return;
    expect(ray.stopsClock).toBe(true);
  });
});
