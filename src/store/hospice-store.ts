import { readFileSync } from "node:fs";
import { join } from "node:path";
import { systemClock } from "@/domain/clock";
import { asOrderId } from "@/domain/order";
import { seedSmsIfEmpty } from "@/inbox/sms-inbox";
import { createRestOrderClient, supabaseConfig } from "@/lib/supabase";
import { parseSampleOrders } from "@/parse/sample-orders";
import { createHospiceStore, type HospiceStore } from "@/store/create-store";
import { createSupabaseStore } from "@/store/supabase-store";

let singleton: Promise<HospiceStore> | undefined;

function seedOrders() {
  const raw = JSON.parse(
    readFileSync(join(process.cwd(), "docs/briefs/sample-orders.json"), "utf8"),
  );
  return parseSampleOrders(raw, systemClock);
}

export function getHospiceStore(): Promise<HospiceStore> {
  if (singleton === undefined) {
    singleton = (async () => {
      const seed = seedOrders();
      const config = supabaseConfig();
      const store = config
        ? await createSupabaseStore(
            createRestOrderClient(config.url, config.key),
            seed,
          )
        : createHospiceStore(seed);
      await seedSmsIfEmpty(systemClock.now(), asOrderId("DME-10231"));
      return store;
    })();
  }
  return singleton;
}

export function resetHospiceStoreForTests(store: HospiceStore): void {
  singleton = Promise.resolve(store);
}
