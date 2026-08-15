import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { asPatientId } from "@/domain/order";
import { chartFor, parseErxFile } from "@/parse/erx-payloads";

const payloadPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../docs/briefs/erx-sample-payloads.json",
);

describe("parseErxFile", () => {
  it("keeps both morphine SIGs and never exposes SSN on Eleanor's chart", () => {
    const file = JSON.parse(readFileSync(payloadPath, "utf8"));
    const parsed = parseErxFile(file);
    expect(parsed.medications).toHaveLength(2);
    expect(parsed.medications[0]?.sig).toBe(
      "TAKE 0.25ML BY MOUTH FOR MODERATE PAIN RATING OF 4-7/10. IF NOT RELIEVED, MAY REPEAT 0.25 ML EVERY 60 MINUTES, CALL HOSPICE IF INEFFECTIVE.",
    );
    expect(parsed.medications[1]?.sig).toBe(
      "TAKE 1 ML BY MOUTH EVERY HOUR AS NEEDED FOR MODERATE PAIN NOT RELIEVED BY 0.5 ML OR FOR SEVERE PAIN RATING OF 8-10/10.",
    );
    expect(parsed.medications[0]?.ndc).toBe("00054051741");
    expect(parsed.medications[0]?.prescriberNpi).toBe("1497771109");
    expect(parsed.diagnoses[0]).toEqual({
      codeType: "icd10Code",
      code: "C90.00",
      isPrimary: true,
    });
    expect(parsed.allergies).toEqual(["Latex"]);

    const eleanor = chartFor(asPatientId("PT-88421"), parsed);
    expect(eleanor.displayName).toBe("Eleanor Bishop");
    expect(eleanor.diagnoses[0]?.code).toBe("C90.00");
    expect(eleanor.medications).toHaveLength(2);
    expect(eleanor.medications[0]?.unitPriceUsd).toBe(0.49);
    expect(JSON.stringify(eleanor)).not.toContain("123-35-3752");
    expect(eleanor).not.toHaveProperty("ssn");
  });

  it("gives Margaret one morphine event in the same eRx shape", () => {
    const file = JSON.parse(readFileSync(payloadPath, "utf8"));
    const parsed = parseErxFile(file);
    const margaret = chartFor(asPatientId("PT-88502"), parsed);
    expect(margaret.source).toBe("hospice_fixture");
    expect(margaret.medications).toHaveLength(1);
    expect(margaret.medications[0]?.ndc).toBe("00054051741");
    expect(margaret.medications[0]?.prescriberNpi).toBe("1497771109");
    expect(JSON.stringify(margaret)).not.toContain("123-35-3752");
  });
});
