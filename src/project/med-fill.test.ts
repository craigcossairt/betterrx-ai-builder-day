import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { chartFor, parseErxFile } from "@/parse/erx-payloads";
import { projectMedFills } from "@/project/med-fill";

const payloadPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/erx-sample-payloads.json",
);

describe("projectMedFills", () => {
  it("names Eleanor's morphine once and keeps both SIGs", () => {
    const parsed = parseErxFile(JSON.parse(readFileSync(payloadPath, "utf8")));
    const eleanor = chartFor(asPatientId("PT-88421"), parsed);
    const fills = projectMedFills(eleanor.medications);
    expect(fills).toHaveLength(1);
    expect(fills[0]?.name).toBe(
      "MORPHINE CONCENTRATE 100 MG/5 ML (20 MG/ML) ORAL SOLUTION",
    );
    expect(fills[0]?.sigs).toEqual([
      {
        label: "Moderate",
        text: "TAKE 0.25ML BY MOUTH FOR MODERATE PAIN RATING OF 4-7/10. IF NOT RELIEVED, MAY REPEAT 0.25 ML EVERY 60 MINUTES, CALL HOSPICE IF INEFFECTIVE.",
      },
      {
        label: "Severe",
        text: "TAKE 1 ML BY MOUTH EVERY HOUR AS NEEDED FOR MODERATE PAIN NOT RELIEVED BY 0.5 ML OR FOR SEVERE PAIN RATING OF 8-10/10.",
      },
    ]);
    expect(fills[0]?.finePrint).toBe(
      "NDC 00054051741 · NPI 1497771109 · NADAC $0.49/mL",
    );
  });
});
