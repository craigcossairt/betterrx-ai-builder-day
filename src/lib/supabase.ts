import type { OrderRow } from "@/store/order-row";
import type { OrderTableClient } from "@/store/supabase-store";

export function supabaseConfig(): { url: string; key: string } | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key || url === "[SENSITIVE]" || key === "[SENSITIVE]") {
    return null;
  }
  return { url, key };
}

export function createRestOrderClient(
  url: string,
  key: string,
): OrderTableClient {
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };
  return {
    async list() {
      const response = await fetch(`${url}/rest/v1/orders?select=*`, {
        headers,
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`orders list failed: ${response.status}`);
      }
      return (await response.json()) as OrderRow[];
    },
    async upsert(row) {
      const response = await fetch(`${url}/rest/v1/orders?on_conflict=id`, {
        method: "POST",
        headers,
        body: JSON.stringify(row),
      });
      if (!response.ok) {
        throw new Error(`orders upsert failed: ${response.status}`);
      }
    },
  };
}
