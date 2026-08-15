import type { Order, OrderId } from "@/domain/order";

export type HospiceStore = {
  snapshot(): Promise<readonly Order[]>;
  get(id: OrderId): Promise<Order | undefined>;
  replace(order: Order): Promise<void>;
};

export function createHospiceStore(seed: readonly Order[]): HospiceStore {
  const map = new Map<OrderId, Order>();
  for (const order of seed) {
    if (map.has(order.id)) {
      throw new Error(`duplicate order ${order.id}`);
    }
    map.set(order.id, order);
  }
  const orderIds = [...map.keys()];
  return {
    async snapshot() {
      return orderIds.map((id) => map.get(id)!);
    },
    async get(id) {
      return map.get(id);
    },
    async replace(order) {
      if (!map.has(order.id)) orderIds.push(order.id);
      map.set(order.id, order);
    },
  };
}
