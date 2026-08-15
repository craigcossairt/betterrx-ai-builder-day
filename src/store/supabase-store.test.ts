import { describe, expect, it } from "vitest";
import { asInstant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  type OrderedOrder,
} from "@/domain/order";
import { createMemoryClient, createSupabaseStore } from "@/store/supabase-store";

const ordered: OrderedOrder = {
  id: asOrderId("DME-10231"),
  patientId: asPatientId("PT-88421"),
  hospice: asHospiceName("Sample Hospice A"),
  equipment: [{ hcpcs: "E0250", name: "Hospital Bed" }],
  status: "ordered",
  orderType: "stat",
  orderedAt: asInstant("2026-08-14T14:14:00.000Z"),
  targetAt: asInstant("2026-08-14T19:00:00.000Z"),
  vendorId: null,
};

describe("createSupabaseStore", () => {
  it("seeds an empty table, then keeps a replace", async () => {
    const client = createMemoryClient();
    const store = await createSupabaseStore(client, [ordered]);
    expect((await store.snapshot()).map((row) => row.id)).toEqual(["DME-10231"]);
    const next = { ...ordered, notes: "Vendor declined." };
    await store.replace(next);
    expect((await store.get(ordered.id))?.notes).toBe("Vendor declined.");
    const again = await createSupabaseStore(client, []);
    expect((await again.get(ordered.id))?.notes).toBe("Vendor declined.");
  });

  it("re-reads the table on snapshot so a second store sees the replace", async () => {
    const client = createMemoryClient();
    const first = await createSupabaseStore(client, [ordered]);
    const second = await createSupabaseStore(client, []);
    await second.replace({ ...ordered, notes: "from the other isolate" });
    expect((await first.snapshot())[0]?.notes).toBe("from the other isolate");
  });

  it("reset wipes the table and reseeds so a second store sees only the seed", async () => {
    const client = createMemoryClient();
    const store = await createSupabaseStore(client, [ordered]);
    await store.replace({ ...ordered, notes: "judge pollution" });
    await store.reset([ordered]);
    expect((await store.snapshot())[0]?.notes).toBeUndefined();
    const again = await createSupabaseStore(client, []);
    expect((await again.snapshot()).map((row) => row.id)).toEqual(["DME-10231"]);
    expect((await again.get(ordered.id))?.notes).toBeUndefined();
  });
});
