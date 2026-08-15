import { asPatientId, type PatientId } from "./order";

export type CensusPatient = {
  id: PatientId;
  displayName: string;
  age: number;
  summary: string;
  emrCodes: readonly string[];
};

const ROSTER: readonly CensusPatient[] = [
  {
    id: asPatientId("PT-88421"),
    displayName: "Eleanor Bishop",
    age: 74,
    summary: "Multiple myeloma (C90.00) · admitted today",
    emrCodes: ["E0250", "E1390"],
  },
  {
    id: asPatientId("PT-88502"),
    displayName: "Margaret Holt",
    age: 81,
    summary: "On service · discharge today 4:30 PM",
    emrCodes: ["E1390"],
  },
  {
    id: asPatientId("PT-87411"),
    displayName: "Ray Delgado",
    age: 88,
    summary: "Died at home. Family called about the bed.",
    emrCodes: [],
  },
  {
    id: asPatientId("PT-88190"),
    displayName: "Sam Whitaker",
    age: 79,
    summary: "On service",
    emrCodes: ["E1130"],
  },
  {
    id: asPatientId("PT-87950"),
    displayName: "June Park",
    age: 83,
    summary: "Admitted yesterday",
    emrCodes: [],
  },
  {
    id: asPatientId("PT-87602"),
    displayName: "Helen Vargas",
    age: 77,
    summary: "EMR marked deceased. Pickup is in motion.",
    emrCodes: [],
  },
];

export function lookupPatient(id: PatientId): CensusPatient {
  return (
    ROSTER.find((patient) => patient.id === id) ?? {
      id,
      displayName: id,
      age: 0,
      summary: "",
      emrCodes: [],
    }
  );
}

export function rosterPatients(): readonly CensusPatient[] {
  return ROSTER;
}

export function searchPatients(query: string): readonly CensusPatient[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return ROSTER;
  return ROSTER.filter(
    (patient) =>
      patient.displayName.toLowerCase().includes(needle) ||
      patient.id.toLowerCase().includes(needle),
  );
}
