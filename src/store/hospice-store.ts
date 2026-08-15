import { readFileSync } from "node:fs";
import { join } from "node:path";
import { systemClock } from "@/domain/clock";
import { parseSampleOrders } from "@/parse/sample-orders";
import { createHospiceStore, type HospiceStore } from "@/store/create-store";

let singleton: HospiceStore | undefined;

export function getHospiceStore(): HospiceStore {
  if (singleton === undefined) {
    const raw = JSON.parse(
      readFileSync(join(process.cwd(), "docs/briefs/sample-orders.json"), "utf8"),
    );
    singleton = createHospiceStore(parseSampleOrders(raw, systemClock));
  }
  return singleton;
}

export function resetHospiceStoreForTests(store: HospiceStore): void {
  singleton = store;
}
