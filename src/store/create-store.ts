import type { Order, OrderId } from "@/domain/order";

export type HospiceStore = {
  snapshot(): readonly Order[];
  get(id: OrderId): Order | undefined;
  replace(order: Order): void;
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
    snapshot() {
      return orderIds.map((id) => map.get(id)!);
    },
    get(id) {
      return map.get(id);
    },
    replace(order) {
      if (!map.has(order.id)) orderIds.push(order.id);
      map.set(order.id, order);
    },
  };
}
