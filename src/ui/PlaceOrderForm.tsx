"use client";

import { useActionState, useState } from "react";
import { placeOrderAction } from "@/app/actions";
import { COST_THRESHOLD_USD, type OfferCard } from "@/domain/offers";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Toast } from "@/ui/Toast";
import { formatVendor, formatWhen } from "@/ui/format";

const SKUS: { hcpcs: "E0250" | "E1390"; name: string }[] = [
  { hcpcs: "E0250", name: "Hospital bed" },
  { hcpcs: "E1390", name: "Oxygen concentrator" },
];

export type OrderPatient = {
  id: string;
  hospice: string;
  displayName: string;
};

function stockLabel(stock: OfferCard["stock"]): string {
  if (stock === "in") return "In stock";
  if (stock === "out") return "Out of stock";
  return "Stock unknown";
}

export function PlaceOrderForm({
  offerSets,
  patients,
}: {
  offerSets: Record<"E0250" | "E1390", OfferCard[]>;
  patients: readonly OrderPatient[];
}) {
  const [hcpcs, setHcpcs] = useState<"E0250" | "E1390">("E0250");
  const cards = offerSets[hcpcs];
  const [vendorId, setVendorId] = useState(cards[0].vendorId);
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const selected = cards.find((card) => card.vendorId === vendorId) ?? cards[0];
  const needsOverride = !selected.preferred;
  const orderType = "stat" as const;
  const needsDon =
    selected.dailyRateUsd >= COST_THRESHOLD_USD && orderType !== "stat";
  const [state, formAction, pending] = useActionState(placeOrderAction, {});

  function pickSku(next: "E0250" | "E1390") {
    setHcpcs(next);
    setVendorId(offerSets[next][0].vendorId);
  }

  return (
    <form action={formAction} style={{ display: "grid", gap: 12 }}>
      <input type="hidden" name="hcpcs" value={hcpcs} />
      <input type="hidden" name="vendorId" value={selected.vendorId} />
      <input type="hidden" name="patientId" value={patientId} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
        Patient
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {patients.map((patient) => (
          <button
            key={patient.id}
            type="button"
            onClick={() => setPatientId(patient.id)}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border:
                patientId === patient.id
                  ? "2px solid var(--blue-500)"
                  : "1px solid var(--line-200)",
              background: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>
              {patient.displayName}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-500)" }}>
              {patient.id} · {patient.hospice}
            </div>
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
        Equipment
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {SKUS.map((sku) => (
          <button
            key={sku.hcpcs}
            type="button"
            onClick={() => pickSku(sku.hcpcs)}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border:
                hcpcs === sku.hcpcs
                  ? "2px solid var(--blue-500)"
                  : "1px solid var(--line-200)",
              background: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>
              {sku.hcpcs} {sku.name}
            </div>
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
        Vendor options
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {cards.map((card) => (
          <button
            key={card.vendorId}
            type="button"
            onClick={() => setVendorId(card.vendorId)}
            style={{
              textAlign: "left",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border:
                selected.vendorId === card.vendorId
                  ? "2px solid var(--blue-500)"
                  : "1px solid var(--line-200)",
              background: "#fff",
              fontFamily: "inherit",
              cursor: "pointer",
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <strong style={{ color: "var(--ink-900)" }}>
                {formatVendor(card.vendorId)}
              </strong>
              {card.preferred ? <Badge tone="blue">Preferred</Badge> : null}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Badge tone={card.stock === "in" ? "green" : "gold"}>
                {stockLabel(card.stock)}
              </Badge>
              <Badge tone={card.beatsWindow ? "green" : "red"}>
                ETA {formatWhen(card.eta)}
              </Badge>
              <Badge tone="navy">
                ${card.dailyRateUsd.toFixed(2)}/day {card.rateLabel}
              </Badge>
            </div>
          </button>
        ))}
      </div>
      {needsOverride ? (
        <Input
          name="overrideReason"
          label="Override reason"
          hint="Required when you skip the preferred option."
          required
        />
      ) : null}
      {needsDon ? (
        <Input
          name="donReason"
          label="Director of nursing reason"
          hint="Required on routine orders at $3.00 a day or more. STAT sends now."
          required
        />
      ) : null}
      {state.error ? (
        <p role="alert" style={{ color: "var(--red-500)", margin: 0, fontSize: 14 }}>
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <Toast tone="success" title="Order placed">
          Confirm it from the census or the vendor inbox. The quoted vendor and
          ETA stay on the order.
        </Toast>
      ) : null}
      <Button variant="app" type="submit" disabled={pending}>
        {pending ? "Placing…" : "Place STAT order"}
      </Button>
    </form>
  );
}
