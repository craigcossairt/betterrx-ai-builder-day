import type { Hcpcs } from "./order";

export type RateSource = "cms" | "synthetic" | "nadac";

export type CatalogSku = {
  hcpcs: Hcpcs;
  name: string;
  dailyRateUsd: number;
  rateSource: RateSource;
};

export const CATALOG = [
  {
    hcpcs: "E0250",
    name: "Hospital Bed",
    dailyRateUsd: 2.57,
    rateSource: "cms",
  },
  {
    hcpcs: "E1390",
    name: "Oxygen Concentrator",
    dailyRateUsd: 3.34,
    rateSource: "cms",
  },
  {
    hcpcs: "E1130",
    name: "Wheelchair",
    dailyRateUsd: 2.0,
    rateSource: "synthetic",
  },
] as const satisfies readonly CatalogSku[];

export const MEDS = [
  {
    ndc: "00054051741",
    name: "MORPHINE CONCENTRATE 100 MG/5 ML (20 MG/ML) ORAL SOLUTION",
    unitPriceUsd: 0.49,
    unit: "mL",
    rateSource: "nadac",
  },
] as const;
