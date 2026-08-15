import { describe, expect, it } from "vitest";
import { formatLaneLabel, formatVendor } from "@/ui/format";

describe("formatVendor", () => {
  it("names the three fixture vendors", () => {
    expect(formatVendor("vendor-1")).toBe("Wasatch Home Medical");
    expect(formatVendor("vendor-2")).toBe("Uintah Valley DME");
    expect(formatVendor("vendor-3")).toBe("Cache Valley DME");
  });
});

describe("formatLaneLabel", () => {
  it("labels picked up", () => {
    expect(formatLaneLabel("picked_up")).toBe("Picked up");
  });
});
