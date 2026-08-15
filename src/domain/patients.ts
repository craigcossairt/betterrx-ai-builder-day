import { asPatientId, type PatientId } from "./order";

export type CensusPatient = {
  id: PatientId;
  displayName: string;
};

const ROSTER: readonly CensusPatient[] = [
  { id: asPatientId("PT-88421"), displayName: "Eleanor Bishop" },
  { id: asPatientId("PT-88502"), displayName: "Margaret Holt" },
  { id: asPatientId("PT-87411"), displayName: "Ray Delgado" },
  { id: asPatientId("PT-88190"), displayName: "Sam Whitaker" },
  { id: asPatientId("PT-87950"), displayName: "June Park" },
  { id: asPatientId("PT-87602"), displayName: "Helen Vargas" },
];

export function lookupPatient(id: PatientId): CensusPatient {
  return ROSTER.find((patient) => patient.id === id) ?? { id, displayName: id };
}

export function rosterPatients(): readonly CensusPatient[] {
  return ROSTER;
}
