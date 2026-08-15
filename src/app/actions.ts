"use server";

import { revalidatePath } from "next/cache";
import { CATALOG } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { dischargeReady } from "@/domain/discharge";
import {
  chooseOffer,
  costGate,
  demoOfferWindow,
  offersFor,
} from "@/domain/offers";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type Hcpcs,
} from "@/domain/order";
import { emrDeathTargets } from "@/domain/pickup";
import { rankOptions } from "@/domain/rank";
import {
  confirmQuotedOrder,
  declineVendor,
  markDelivered,
  markPickedUp,
  notePickupWindow,
  placeOrder,
  reviseQuotedEta,
  triggerPickup,
} from "@/domain/transition";
import { queueConfirmSms, resetSms, seedSmsIfEmpty } from "@/inbox/sms-inbox";
import {
  resetDischargeOverrides,
  setDischargeOverride,
} from "@/store/discharge-overrides";
import { getHospiceStore, loadSeedOrders } from "@/store/hospice-store";

export type ActionResult = { error?: string; ok?: boolean };

function asResult(error: unknown): ActionResult {
  return {
    error:
      error instanceof Error ? error.message : "Could not finish that action",
  };
}

export async function placeOrderAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const codes = formData
      .getAll("hcpcs")
      .map((value) => String(value))
      .filter((code): code is Hcpcs =>
        CATALOG.some((sku) => sku.hcpcs === code),
      );
    if (codes.length === 0) return { error: "Add a DME item from search or EMR." };
    const hcpcs = codes.includes("E1390") ? "E1390" : codes[0];
    const vendorId = asVendorId(String(formData.get("vendorId")));
    const patientId = asPatientId(String(formData.get("patientId") ?? "").trim());
    if (!patientId) return { error: "Pick a patient from the census." };
    const overrideReason = String(formData.get("overrideReason") ?? "").trim();
    const donReason = String(formData.get("donReason") ?? "").trim();
    const now = systemClock.now();
    const window = demoOfferWindow(now);
    const ranked = rankOptions(
      offersFor(hcpcs, window.preferredEta, window.lateEta),
      window.deadline,
    );
    const chosen = chooseOffer({
      ranked,
      vendorId,
      overrideReason,
      donReason,
      orderType: "stat",
    });
    const sku = CATALOG.find((row) => row.hcpcs === hcpcs);
    const store = await getHospiceStore();
    const existing = (await store.snapshot()).find(
      (row) => row.patientId === patientId,
    );
    const hospice = existing?.hospice ?? asHospiceName("Sample Hospice A");
    const gate = costGate({
      orderType: "stat",
      dailyRateUsd: chosen.dailyRateUsd,
    });
    const notes = [
      chosen !== ranked[0] ? `Override: ${overrideReason}` : null,
      gate.verdict === "hold" && donReason ? `DON: ${donReason}` : null,
      gate.verdict === "retro" ? gate.note : null,
    ]
      .filter(Boolean)
      .join(" ");
    const order = placeOrder({
      patientId,
      hospice,
      equipment: codes.map((code) => {
        const row = CATALOG.find((item) => item.hcpcs === code);
        return { hcpcs: code, name: row?.name ?? code };
      }) as [{ hcpcs: Hcpcs; name: string }, ...{ hcpcs: Hcpcs; name: string }[]],
      orderType: "stat",
      targetAt: window.deadline,
      now,
      quotedVendorId: chosen.vendorId,
      quotedEta: chosen.eta,
    });
    if (notes) order.notes = notes;
    await store.replace(order);
    queueConfirmSms({
      now,
      orderId: order.id,
      equipmentName: sku?.name ?? hcpcs,
    });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return asResult(error);
  }
}

export async function confirmOrderAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (!current || current.status !== "ordered") return;
  const now = systemClock.now();
  const window = demoOfferWindow(now);
  await store.replace(
    confirmQuotedOrder(current, asVendorId("vendor-1"), window.preferredEta),
  );
  revalidatePath("/");
}

export async function reviseEtaAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (!current || current.status !== "ordered") return;
  const window = demoOfferWindow(systemClock.now());
  await store.replace(reviseQuotedEta(current, window.lateEta));
  revalidatePath("/");
}

export async function proposePickupWindowAction(
  formData: FormData,
): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const windowLabel =
    String(formData.get("pickupWindow") ?? "").trim() || "tomorrow morning";
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (
    !current ||
    (current.status !== "pickup_triggered" &&
      current.status !== "pickup_delayed")
  ) {
    return;
  }
  await store.replace(notePickupWindow(current, windowLabel));
  revalidatePath("/");
}

export async function declineOrderAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (!current || current.status !== "ordered") return;
  await store.replace(declineVendor(current));
  revalidatePath("/");
}

export async function markDeliveredAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (!current || (current.status !== "dispatched" && current.status !== "in_transit_at_risk")) {
    return;
  }
  await store.replace(markDelivered(current, systemClock.now()));
  revalidatePath("/");
}

export async function markPickedUpAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (
    !current ||
    (current.status !== "pickup_triggered" &&
      current.status !== "pickup_delayed")
  ) {
    return;
  }
  await store.replace(markPickedUp(current, systemClock.now()));
  revalidatePath("/");
}

export async function requestPickupAction(formData: FormData): Promise<void> {
  const id = asOrderId(String(formData.get("orderId")));
  const trigger =
    String(formData.get("trigger")) === "patient_status_deceased"
      ? "patient_status_deceased"
      : "nurse_request";
  const store = await getHospiceStore();
  const current = await store.get(id);
  if (
    !current ||
    (current.status !== "delivered" &&
      current.status !== "pickup_triggered" &&
      current.status !== "pickup_delayed")
  ) {
    return;
  }
  await store.replace(triggerPickup(current, trigger, systemClock.now()));
  revalidatePath("/");
}

export async function markDischargeReadyAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const patientId = asPatientId(String(formData.get("patientId")));
  const reason = String(formData.get("reason") ?? "").trim();
  const store = await getHospiceStore();
  const patientOrders = (await store.snapshot()).filter(
    (order) => order.patientId === patientId,
  );
  const decision = dischargeReady(patientOrders);
  if (!decision.ready && reason.length === 0) {
    return {
      error: "discharge blocked until delivered, or override with a reason",
    };
  }
  if (!decision.ready) setDischargeOverride(patientId, reason);
  revalidatePath("/");
  return { ok: true };
}

export async function emrDeathAction(formData: FormData): Promise<void> {
  const raw = String(formData.get("patientId") ?? "").trim();
  const patientId = raw ? asPatientId(raw) : null;
  const store = await getHospiceStore();
  const now = systemClock.now();
  const snapshot = await store.snapshot();
  for (const order of emrDeathTargets(snapshot, patientId)) {
    await store.replace(triggerPickup(order, "patient_status_deceased", now));
  }
  revalidatePath("/");
}

export async function resetDemoAction(): Promise<void> {
  const store = await getHospiceStore();
  await store.reset(loadSeedOrders());
  resetSms();
  resetDischargeOverrides();
  await seedSmsIfEmpty(systemClock.now(), asOrderId("DME-10231"));
  revalidatePath("/");
}
