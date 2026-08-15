import { CATALOG, MEDS } from "./catalog";
import type { PatientId } from "./order";
import { lookupPatient } from "./patients";

export type ShopKind = "medication" | "dme" | "supplies";

export type ShopItem = {
  kind: ShopKind;
  code: string;
  name: string;
  dailyRateUsd: number | null;
};

const SUPPLIES: readonly ShopItem[] = [
  {
    kind: "supplies",
    code: "SUP-WOUND",
    name: "Wound care kit",
    dailyRateUsd: 1.1,
  },
  {
    kind: "supplies",
    code: "SUP-BRIEFS",
    name: "Incontinence briefs",
    dailyRateUsd: 0.8,
  },
  {
    kind: "supplies",
    code: "SUP-GLOVES",
    name: "Nitrile gloves",
    dailyRateUsd: 0.4,
  },
];

const DME: readonly ShopItem[] = CATALOG.map((sku) => ({
  kind: "dme" as const,
  code: sku.hcpcs,
  name: sku.name,
  dailyRateUsd: sku.dailyRateUsd,
}));

const MEDICATIONS: readonly ShopItem[] = MEDS.map((med) => ({
  kind: "medication" as const,
  code: med.ndc,
  name: med.name,
  dailyRateUsd: med.unitPriceUsd,
}));

const ALL: readonly ShopItem[] = [...DME, ...SUPPLIES, ...MEDICATIONS];

export function shopItems(input: {
  kind: ShopKind;
  emrFor?: PatientId;
}): readonly ShopItem[] {
  const pool = ALL.filter((item) => item.kind === input.kind);
  if (!input.emrFor) return pool;
  const codes = new Set(lookupPatient(input.emrFor).emrCodes);
  return pool.filter((item) => codes.has(item.code));
}

export function searchShop(input: {
  kind: ShopKind;
  query: string;
}): readonly ShopItem[] {
  const needle = input.query.trim().toLowerCase();
  const pool = shopItems({ kind: input.kind });
  if (!needle) return pool;
  return pool.filter(
    (item) =>
      item.name.toLowerCase().includes(needle) ||
      item.code.toLowerCase().includes(needle),
  );
}

export function vendorRecord(vendorId: string): string {
  if (vendorId === "vendor-1") return "On time 11 of last 12 hospice drops";
  if (vendorId === "vendor-2") return "Late on 3 of last 8";
  return "No track record in this fixture";
}
