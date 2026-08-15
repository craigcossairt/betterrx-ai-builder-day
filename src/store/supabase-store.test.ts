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
});
