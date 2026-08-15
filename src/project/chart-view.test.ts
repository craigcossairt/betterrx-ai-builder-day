import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { lookupChart } from "@/parse/erx-payloads";
import { projectChartView } from "@/project/chart-view";

describe("projectChartView", () => {
  it("puts Eleanor's allergy first and keeps the payload street dummy", () => {
    const view = projectChartView(lookupChart(asPatientId("PT-88421")));
    expect(view.allergy).toEqual({ value: "Latex" });
    expect(view.address.line).toBe("testStreet1");
    expect(view.address.note).toMatch(/dummy/i);
    expect(view.source).toBe("erx");
    expect(view.sourceLabel).toBe("From BetterRX eRx event");
    expect(view.primaryIcd).toEqual({
      code: "C90.00",
      title: "Multiple myeloma",
    });
    expect(view.household).toEqual({
      name: "Priya Bishop, daughter",
      note: "Not on the eRx event. Hospice already had it.",
    });
    expect(view.noSsn).toBe(true);
    expect(JSON.stringify(view)).not.toContain("123-35-3752");
  });

  it("keeps Helen as a hospice fixture, not an on-service hold patient", () => {
    const view = projectChartView(lookupChart(asPatientId("PT-87602")));
    expect(view.source).toBe("hospice_fixture");
    expect(view.sourceLabel).toBe(
      "Hospice fixture. Same fields as the eRx patient event.",
    );
    expect(view.allergy).toEqual({ none: true });
    expect(view.primaryIcd?.code).toBe("C34.90");
    expect(view.address.note).toMatch(/fixture/i);
  });
});
