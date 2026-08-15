import { describe, expect, it } from "vitest";
import { pitchPacket } from "@/project/pitch";

describe("pitchPacket", () => {
  it("states a zero-cost rules skip for at-risk and ranking", () => {
    expect(pitchPacket.ai.costUsdPerOrder).toBe(0);
    expect(pitchPacket.ai.baseline).toBe(
      "eta > deadline. Rank beats the discharge window, then price, then known stock.",
    );
    expect(pitchPacket.ai.whySkip).toMatch(/template/i);
    expect(pitchPacket.ai.safety).toMatch(/stored/i);
  });

  it("compares phone, fax, and portals to the hospice board", () => {
    expect(pitchPacket.differentiation.today).toBe(
      "Phone, fax, or a vendor portal. No shared ETA. Pickup starts with another call.",
    );
    expect(pitchPacket.differentiation.us).toMatch(/three-factor/i);
    expect(pitchPacket.differentiation.us).toMatch(/at-risk/i);
    expect(pitchPacket.differentiation.us).not.toMatch(/recruit/i);
  });

  it("names HCHB and the eRx patient key", () => {
    expect(pitchPacket.integration.emr).toBe("HCHB");
    expect(pitchPacket.integration.out).toBe(
      "DME status events keyed by patient.identifiers",
    );
    expect(pitchPacket.integration.diagram).toContain("newOrUpdatePatient");
    expect(pitchPacket.integration.diagram).toContain("newMedications");
  });
});
