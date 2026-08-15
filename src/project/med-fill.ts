import type { MedicationEvent } from "@/parse/erx-payloads";

export type MedSig = {
  label: string;
  text: string;
};

export type MedFill = {
  name: string;
  sigs: readonly MedSig[];
  finePrint: string;
};

function sigLabel(text: string): string {
  if (/severe/i.test(text)) return "Severe";
  if (/moderate/i.test(text)) return "Moderate";
  return "SIG";
}

export function projectMedFills(
  medications: readonly MedicationEvent[],
): MedFill[] {
  const groups = new Map<string, MedicationEvent[]>();
  for (const med of medications) {
    const key = med.ndc || med.externalId;
    const bucket = groups.get(key) ?? [];
    bucket.push(med);
    groups.set(key, bucket);
  }
  return [...groups.values()].map((group) => {
    const first = group[0];
    return {
      name: first.name,
      sigs: group.map((med) => ({ label: sigLabel(med.sig), text: med.sig })),
      finePrint: `NDC ${first.ndc} · NPI ${first.prescriberNpi} · NADAC $${first.unitPriceUsd.toFixed(2)}/${first.unit}`,
    };
  });
}
