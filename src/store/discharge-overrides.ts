import type { PatientId } from "@/domain/order";

const overrides = new Map<PatientId, string>();

export function setDischargeOverride(patientId: PatientId, reason: string): void {
  overrides.set(patientId, reason);
}

export function getDischargeOverride(patientId: PatientId): string | undefined {
  return overrides.get(patientId);
}

export function resetDischargeOverrides(): void {
  overrides.clear();
}
