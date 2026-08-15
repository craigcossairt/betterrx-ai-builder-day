import { lookupPatient } from "@/domain/patients";
import type { PatientChart } from "@/parse/erx-payloads";

const ICD_TITLE: Record<string, string> = {
  "C90.00": "Multiple myeloma",
  "C34.90": "Lung cancer",
  "J44.1": "COPD with flare",
  "I50.9": "Heart failure",
  "G30.9": "Alzheimer disease",
};

export type ChartAllergy = { value: string } | { none: true };

export type ChartView = {
  displayName: string;
  subtitle: string;
  source: "erx" | "hospice_fixture";
  sourceLabel: string;
  allergy: ChartAllergy;
  dob: string;
  gender: string;
  phone: string;
  address: { line: string; note: string };
  primaryIcd: { code: string; title: string | null; note?: string } | null;
  household: { name: string; note: string } | null;
  noSsn: true;
};

export function projectChartView(chart: PatientChart): ChartView {
  const who = lookupPatient(chart.patientId);
  const primary = chart.diagnoses.find((row) => row.isPrimary) ?? chart.diagnoses[0];
  const allergy = chart.allergies[0];
  return {
    displayName: chart.displayName,
    subtitle: `${chart.patientId} · ${who.summary}`,
    source: chart.source,
    sourceLabel:
      chart.source === "erx"
        ? "From BetterRX eRx event"
        : "Hospice fixture. Same fields as the eRx patient event.",
    allergy: allergy ? { value: allergy } : { none: true },
    dob: chart.dob,
    gender: chart.gender,
    phone: chart.phone,
    address: {
      line: chart.address.street1 || "Not on file",
      note:
        chart.source === "erx"
          ? "Verbatim from the eRx payload. It is dummy data, so there is no map."
          : "Hospice fixture. Seeded, not from a payload.",
    },
    primaryIcd: primary
      ? ICD_TITLE[primary.code]
        ? { code: primary.code, title: ICD_TITLE[primary.code] }
        : {
            code: primary.code,
            title: null,
            note: "No title on file. This code is outside the fixture map.",
          }
      : null,
    household: chart.householdContact
      ? {
          name: chart.householdContact,
          note: "Not on the eRx event. Hospice already had it.",
        }
      : null,
    noSsn: true,
  };
}
