import type { Order, OrderId } from "@/domain/order";
import { orderToRow, rowToOrder, type OrderRow } from "@/store/order-row";
import type { HospiceStore } from "@/store/create-store";

export type OrderTableClient = {
  list(): Promise<OrderRow[]>;
  upsert(row: OrderRow): Promise<void>;
  removeAll(): Promise<void>;
};

export function createMemoryClient(seed: OrderRow[] = []): OrderTableClient {
  const rows = new Map<string, OrderRow>(seed.map((row) => [row.id, row]));
  return {
    async list() {
      return [...rows.values()];
    },
    async upsert(row) {
      rows.set(row.id, row);
    },
    async removeAll() {
      rows.clear();
    },
  };
}

export async function createSupabaseStore(
  client: OrderTableClient,
  seed: readonly Order[],
): Promise<HospiceStore> {
  let listed = await client.list();
  if (listed.length === 0) {
    for (const order of seed) {
      await client.upsert(orderToRow(order));
    }
    listed = await client.list();
  }
  const map = new Map<OrderId, Order>();
  const orderIds: OrderId[] = [];

  function load(rows: OrderRow[]) {
    map.clear();
    orderIds.length = 0;
    for (const row of rows) {
      const order = rowToOrder(row);
      map.set(order.id, order);
      orderIds.push(order.id);
    }
  }

  load(listed);

  async function hydrate() {
    load(await client.list());
  }

  return {
    async snapshot() {
      await hydrate();
      return orderIds.map((id) => map.get(id)!);
    },
    async get(id) {
      await hydrate();
      return map.get(id);
    },
    async replace(order) {
      if (!map.has(order.id)) orderIds.push(order.id);
      map.set(order.id, order);
      await client.upsert(orderToRow(order));
    },
    async reset(seed) {
      await client.removeAll();
      for (const order of seed) {
        await client.upsert(orderToRow(order));
      }
      await hydrate();
    },
  };
}
