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

const extras: SupplyRow[] = [];

export function suppliesFor(patientId: PatientId): readonly SupplyRow[] {
  return [...FIXTURES, ...extras].filter((row) => row.patientId === patientId);
}

export function addSupply(patientId: PatientId, name: string): SupplyRow {
  const row: SupplyRow = {
    patientId,
    name,
    status: "delivered",
    staysAfterDeath: true,
  };
  extras.push(row);
  return row;
}

export function resetSupplies(): void {
  extras.length = 0;
}
