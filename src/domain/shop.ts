import { CATALOG, MEDS } from "./catalog";
import type { PatientId } from "./order";
import { lookupPatient } from "./patients";

export type ShopKind = "medication" | "dme" | "supplies";

export type ShopItem = {
  kind: ShopKind;
  code: string;
  name: string;
  dailyRateUsd: number | null;
  category?: string;
  pack?: string;
};

export const SUPPLY_CATS = ["Wound care", "Incontinence", "Gloves"] as const;

const SUPPLIES: readonly ShopItem[] = [
  {
    kind: "supplies",
    code: "SUP-WOUND",
    name: "Wound care kit",
    dailyRateUsd: null,
    category: "Wound care",
    pack: "kit · one per dressing change",
  },
  {
    kind: "supplies",
    code: "SUP-FOAM",
    name: "Foam dressing 4x4",
    dailyRateUsd: null,
    category: "Wound care",
    pack: "box of 10",
  },
  {
    kind: "supplies",
    code: "SUP-SALINE",
    name: "Saline wound wash",
    dailyRateUsd: null,
    category: "Wound care",
    pack: "7.1 oz can",
  },
  {
    kind: "supplies",
    code: "SUP-BRIEFS",
    name: "Incontinence briefs",
    dailyRateUsd: null,
    category: "Incontinence",
    pack: "bag of 20 · size L",
  },
  {
    kind: "supplies",
    code: "SUP-PADS",
    name: "Underpads 23x36",
    dailyRateUsd: null,
    category: "Incontinence",
    pack: "pack of 25",
  },
  {
    kind: "supplies",
    code: "SUP-GLOVES",
    name: "Nitrile gloves",
    dailyRateUsd: null,
    category: "Gloves",
    pack: "box of 100 · size M",
  },
];

export function supplyCatalog(): {
  category: string;
  items: readonly ShopItem[];
}[] {
  return SUPPLY_CATS.map((category) => ({
    category,
    items: SUPPLIES.filter((item) => item.category === category),
  }));
}

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
