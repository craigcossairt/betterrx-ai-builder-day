import { asPatientId, type PatientId } from "@/domain/order";

export type SupplyRow = {
  patientId: PatientId;
  name: string;
  status: "delivered";
  staysAfterDeath: true;
};

const FIXTURES: readonly SupplyRow[] = [
  {
    patientId: asPatientId("PT-87411"),
    name: "Wound care kit",
    status: "delivered",
    staysAfterDeath: true,
  },
];

export function suppliesFor(patientId: PatientId): readonly SupplyRow[] {
  return FIXTURES.filter((row) => row.patientId === patientId);
}
