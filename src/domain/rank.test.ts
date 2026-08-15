import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import { asVendorId } from "@/domain/order";
import { rankOptions, type VendorOption } from "@/domain/rank";

const deadline = asInstant("2026-08-14T21:30:00.000Z");

function option(partial: Partial<VendorOption> & Pick<VendorOption, "vendorId">): VendorOption {
  return {
    hcpcs: "E0250",
    stock: "in",
    eta: asInstant("2026-08-14T20:00:00.000Z"),
    dailyRateUsd: 2.57,
    ...partial,
  };
}

describe("rankOptions", () => {
  it("puts the option that beats the window and costs less first", () => {
    const late = option({
      vendorId: asVendorId("vendor-2"),
      eta: asInstant("2026-08-14T22:10:00.000Z"),
      dailyRateUsd: 2.0,
    });
    const onTime = option({ vendorId: asVendorId("vendor-1") });
    expect(rankOptions([late, onTime], deadline).map((row) => row.vendorId)).toEqual([
      "vendor-1",
      "vendor-2",
    ]);
  });
});
