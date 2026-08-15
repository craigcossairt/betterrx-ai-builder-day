"use server";

import { revalidatePath } from "next/cache";
import { CATALOG } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import { COST_THRESHOLD_USD, demoOfferWindow, offersFor } from "@/domain/offers";
import { asHospiceName, asOrderId, asPatientId, asVendorId, type Hcpcs } from "@/domain/order";
import { rankOptions } from "@/domain/rank";
import { assessDeliveryRisk } from "@/domain/risk";
import { confirmVendor, placeOrder, triggerPickup } from "@/domain/transition";
import { seedSmsIfEmpty } from "@/inbox/sms-inbox";
import { setDischargeOverride } from "@/store/discharge-overrides";
import { getHospiceStore } from "@/store/hospice-store";

export async function placeOrderAction(formData: FormData): Promise<void> {
  const hcpcs = formData.get("hcpcs") as Hcpcs;
  const vendorId = asVendorId(String(formData.get("vendorId")));
  const overrideReason = String(formData.get("overrideReason") ?? "").trim();
  const donReason = String(formData.get("donReason") ?? "").trim();
  const now = systemClock.now();
  const window = demoOfferWindow(now);
  const ranked = rankOptions(
    offersFor(hcpcs, window.preferredEta, window.lateEta),
    window.deadline,
  );
  const chosen = ranked.find((option) => option.vendorId === vendorId);
  if (!chosen) throw new Error("unknown vendor option");
  if (chosen !== ranked[0] && overrideReason.length === 0) {
    throw new Error("override needs a reason");
  }
  if (chosen.dailyRateUsd >= COST_THRESHOLD_USD && donReason.length === 0) {
    throw new Error("director of nursing approval needed");
  }
  const sku = CATALOG.find((row) => row.hcpcs === hcpcs);
  const order = placeOrder({
    patientId: asPatientId("PT-NEW"),
    hospice: asHospiceName("Sample Hospice A"),
    equipment: [{ hcpcs, name: sku?.name ?? hcpcs }],
    orderType: "stat",
    targetAt: window.deadline,
    now,
  });
  getHospiceStore().replace(order);
  seedSmsIfEmpty(now, order.id);
  revalidatePath("/");
}

export async function confirmOrderAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = getHospiceStore();
  const current = store.get(id);
  if (!current || current.status !== "ordered") return;
  const now = systemClock.now();
  const window = demoOfferWindow(now);
  const dispatched = confirmVendor(current, asVendorId("vendor-1"), window.preferredEta);
  store.replace(assessDeliveryRisk(dispatched, window.deadline));
  revalidatePath("/");
}

export async function declineOrderAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = getHospiceStore();
  const current = store.get(id);
  if (!current) return;
  store.replace({
    ...current,
    notes: `${current.notes ?? ""} Vendor declined.`.trim(),
  });
  revalidatePath("/");
}

export async function markDeliveredAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = getHospiceStore();
  const current = store.get(id);
  if (!current || (current.status !== "dispatched" && current.status !== "in_transit_at_risk")) {
    return;
  }
  store.replace({
    id: current.id,
    patientId: current.patientId,
    hospice: current.hospice,
    equipment: current.equipment,
    notes: current.notes,
    status: "delivered",
    vendorId: current.vendorId,
    deliveredAt: systemClock.now(),
    proofOfDelivery: { signature: true, timestamp: true },
  });
  revalidatePath("/");
}

export async function requestPickupAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const trigger =
    String(formData.get("trigger")) === "patient_status_deceased"
      ? "patient_status_deceased"
      : "nurse_request";
  const store = getHospiceStore();
  const current = store.get(id);
  if (
    !current ||
    (current.status !== "delivered" &&
      current.status !== "pickup_triggered" &&
      current.status !== "pickup_delayed")
  ) {
    return;
  }
  store.replace(triggerPickup(current, trigger, systemClock.now()));
  revalidatePath("/");
}

export async function markDischargeReadyAction(formData: FormData): Promise<void> {
  const patientId = asPatientId(String(formData.get("patientId")));
  const reason = String(formData.get("reason") ?? "").trim();
  const store = getHospiceStore();
  const patientOrders = store.snapshot().filter((order) => order.patientId === patientId);
  const decision = dischargeReady(patientOrders);
  if (!decision.ready && reason.length === 0) {
    throw new Error("discharge blocked until delivered, or override with a reason");
  }
  if (!decision.ready) setDischargeOverride(patientId, reason);
  revalidatePath("/");
}
