import erxPayload from "../../docs/briefs/erx-sample-payloads.json";
import { MEDS } from "@/domain/catalog";
import { asPatientId, type PatientId } from "@/domain/order";
import { lookupPatient } from "@/domain/patients";

export type ErxAddress = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ErxDiagnosis = {
  codeType: string;
  code: string;
  isPrimary: boolean;
};

export type MedicationEvent = {
  externalId: string;
  ndc: string;
  name: string;
  sig: string;
  prescriberNpi: string;
  unitPriceUsd: number;
  unit: string;
  rateSource: "nadac";
};

export type ParsedErx = {
  diagnoses: readonly ErxDiagnosis[];
  allergies: readonly string[];
  address: ErxAddress;
  dob: string;
  gender: string;
  phone: string;
  medRecNo: string;
  medications: readonly MedicationEvent[];
};

export type PatientChart = {
  patientId: PatientId;
  displayName: string;
  dob: string;
  gender: string;
  phone: string;
  medRecNo: string;
  address: ErxAddress;
  diagnoses: readonly ErxDiagnosis[];
  allergies: readonly string[];
  medications: readonly MedicationEvent[];
  householdContact: string | null;
  source: "erx" | "hospice_fixture";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseAddress(raw: unknown): ErxAddress {
  const row = isRecord(raw) ? raw : {};
  return {
    street1: asString(row.street1),
    street2: asString(row.street2),
    city: asString(row.city),
    state: asString(row.state),
    zip: asString(row.zip),
    country: asString(row.country) || "USA",
  };
}

function parseMedications(raw: unknown): MedicationEvent[] {
  if (!Array.isArray(raw)) return [];
  const price = MEDS[0];
  return raw.flatMap((item) => {
    if (!isRecord(item)) return [];
    const product = isRecord(item.product) ? item.product : {};
    const physician = isRecord(item.physician) ? item.physician : {};
    const identifier = isRecord(physician.identifier) ? physician.identifier : {};
    const ndc = asString(product.code);
    return [
      {
        externalId: asString(item.externalId),
        ndc,
        name: asString(product.name),
        sig: asString(item.sig),
        prescriberNpi: asString(identifier.id),
        unitPriceUsd: ndc === price.ndc ? price.unitPriceUsd : 0,
        unit: price.unit,
        rateSource: "nadac",
      },
    ];
  });
}

export function parseErxFile(raw: unknown): ParsedErx {
  const root = isRecord(raw) ? raw : {};
  const patientEvent = isRecord(root.newOrUpdatePatient)
    ? root.newOrUpdatePatient
    : {};
  const patient = isRecord(patientEvent.patient) ? patientEvent.patient : {};
  const demo = isRecord(patient.demographics) ? patient.demographics : {};
  const medEvent = isRecord(root.newMedications) ? root.newMedications : {};
  const medPatient = isRecord(medEvent.patient) ? medEvent.patient : {};
  const diagnoses = Array.isArray(demo.diagnoses)
    ? demo.diagnoses.flatMap((row) => {
        if (!isRecord(row)) return [];
        return [
          {
            codeType: asString(row.codeType),
            code: asString(row.code),
            isPrimary: row.isPrimary === true,
          },
        ];
      })
    : [];
  const allergies = Array.isArray(demo.allergies)
    ? demo.allergies.flatMap((row) =>
        isRecord(row) && asString(row.description)
          ? [asString(row.description)]
          : [],
      )
    : [];
  return {
    diagnoses,
    allergies,
    address: parseAddress(demo.address),
    dob: asString(demo.dob),
    gender: asString(demo.gender),
    phone: asString(demo.phone),
    medRecNo: asString(demo.medRecNo),
    medications: parseMedications(medPatient.medications),
  };
}

const FIXTURE_CHARTS: Record<string, Partial<PatientChart>> = {
  "PT-88421": {
    source: "erx",
    householdContact: "Priya Bishop, daughter",
  },
  "PT-88502": {
    source: "hospice_fixture",
    dob: "1945-03-22",
    gender: "F",
    phone: "205-555-0144",
    medRecNo: "MR-88502",
    address: {
      street1: "18 Cedar Lane",
      street2: "",
      city: "Birmingham",
      state: "AL",
      zip: "35209",
      country: "USA",
    },
    diagnoses: [
      { codeType: "icd10Code", code: "J44.1", isPrimary: true },
    ],
    allergies: ["Sulfa"],
    medications: [
      {
        externalId: "fixture-holt-morphine",
        ndc: "00054051741",
        name: "MORPHINE CONCENTRATE 100 MG/5 ML (20 MG/ML) ORAL SOLUTION",
        sig: "TAKE 0.25ML BY MOUTH EVERY 4 HOURS AS NEEDED FOR PAIN.",
        prescriberNpi: "1497771109",
        unitPriceUsd: 0.49,
        unit: "mL",
        rateSource: "nadac",
      },
    ],
    householdContact: "Tom Holt, son",
  },
  "PT-87411": {
    source: "hospice_fixture",
    dob: "1938-11-02",
    gender: "M",
    phone: "205-555-0190",
    medRecNo: "MR-87411",
    address: {
      street1: "402 Oak Street",
      street2: "",
      city: "Bessemer",
      state: "AL",
      zip: "35020",
      country: "USA",
    },
    diagnoses: [{ codeType: "icd10Code", code: "I50.9", isPrimary: true }],
    allergies: [],
    medications: [],
    householdContact: "Family at the home. They called about the bed.",
  },
  "PT-88190": {
    source: "hospice_fixture",
    dob: "1947-06-18",
    gender: "M",
    phone: "205-555-0112",
    medRecNo: "MR-88190",
    address: {
      street1: "9 Pine Court",
      street2: "",
      city: "Homewood",
      state: "AL",
      zip: "35209",
      country: "USA",
    },
    diagnoses: [{ codeType: "icd10Code", code: "G30.9", isPrimary: true }],
    allergies: ["Penicillin"],
    medications: [],
    householdContact: null,
  },
  "PT-87950": {
    source: "hospice_fixture",
    dob: "1943-01-09",
    gender: "F",
    phone: "205-555-0166",
    medRecNo: "MR-87950",
    address: {
      street1: "77 Valley Road",
      street2: "Apt 2",
      city: "Hoover",
      state: "AL",
      zip: "35226",
      country: "USA",
    },
    diagnoses: [],
    allergies: [],
    medications: [],
    householdContact: "June Park, on site",
  },
  "PT-87602": {
    source: "hospice_fixture",
    dob: "1949-08-30",
    gender: "F",
    phone: "205-555-0177",
    medRecNo: "MR-87602",
    address: {
      street1: "210 Maple Drive",
      street2: "",
      city: "Vestavia Hills",
      state: "AL",
      zip: "35216",
      country: "USA",
    },
    diagnoses: [{ codeType: "icd10Code", code: "C34.90", isPrimary: true }],
    allergies: [],
    medications: [],
    householdContact: "EMR marked deceased. Pickup already requested.",
  },
};

export function chartFor(patientId: PatientId, parsed: ParsedErx): PatientChart {
  const who = lookupPatient(patientId);
  const overlay = FIXTURE_CHARTS[patientId] ?? {};
  const fromErx = patientId === "PT-88421";
  return {
    patientId,
    displayName: who.displayName,
    dob: fromErx ? parsed.dob : (overlay.dob ?? ""),
    gender: fromErx ? parsed.gender : (overlay.gender ?? ""),
    phone: fromErx ? parsed.phone : (overlay.phone ?? ""),
    medRecNo: fromErx ? parsed.medRecNo : (overlay.medRecNo ?? ""),
    address: fromErx ? parsed.address : (overlay.address ?? {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    }),
    diagnoses: fromErx ? parsed.diagnoses : (overlay.diagnoses ?? []),
    allergies: fromErx ? parsed.allergies : (overlay.allergies ?? []),
    medications: fromErx ? parsed.medications : (overlay.medications ?? []),
    householdContact: overlay.householdContact ?? null,
    source: fromErx ? "erx" : (overlay.source ?? "hospice_fixture"),
  };
}

const PARSED = parseErxFile(erxPayload);

export function lookupChart(patientId: PatientId): PatientChart {
  return chartFor(asPatientId(patientId), PARSED);
}
