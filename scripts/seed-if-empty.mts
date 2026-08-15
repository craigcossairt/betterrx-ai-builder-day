import { getHospiceStore } from "../src/store/hospice-store.ts";

const store = await getHospiceStore();
const snap = await store.snapshot();
console.log(JSON.stringify(snap.map((order) => [order.id, order.status])));
