"use client";

import { useActionState, useState } from "react";
import { placeOrderAction } from "@/app/actions";
import type { Instant } from "@/domain/clock";
import { costGate, type OfferCard } from "@/domain/offers";
import type { Hcpcs } from "@/domain/order";
import {
  costNote,
  orderTitle,
  sendLabel,
} from "@/project/order-copy";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Toast } from "@/ui/Toast";
import {
  OfferPick,
  PatientChips,
  PhoneBack,
  SkuRow,
  type OrderPatient,
} from "@/ui/order";
import type { RoleId } from "@/ui/roles";

export type { OrderPatient };

export function PlaceOrderForm({
  offerSets,
  patients,
  deadline,
  role,
}: {
  offerSets: Record<Hcpcs, OfferCard[]>;
  patients: readonly OrderPatient[];
  deadline: Instant;
  role: RoleId;
}) {
  const [hcpcs, setHcpcs] = useState<Hcpcs>("E0250");
  const cards = offerSets[hcpcs];
  const [vendorId, setVendorId] = useState(cards[0].vendorId);
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const selected = cards.find((card) => card.vendorId === vendorId) ?? cards[0];
  const who =
    patients.find((patient) => patient.id === patientId)?.displayName ??
    "this patient";
  const needsOverride = !selected.preferred;
  const orderType = "stat" as const;
  const needsDon =
    costGate({ orderType, dailyRateUsd: selected.dailyRateUsd }).verdict ===
    "hold";
  const note = costNote({
    orderType,
    dailyRateUsd: selected.dailyRateUsd,
    hcpcs,
  });
  const [state, formAction, pending] = useActionState(placeOrderAction, {});

  function pickSku(next: Hcpcs) {
    setHcpcs(next);
    setVendorId(offerSets[next][0].vendorId);
  }

  return (
    <form action={formAction} className="order-screen">
      <input type="hidden" name="hcpcs" value={hcpcs} />
      <input type="hidden" name="vendorId" value={selected.vendorId} />
      <input type="hidden" name="patientId" value={patientId} />
      <header className="census-head">
        <div className="census-head-bar">
          <PhoneBack role={role} />
        </div>
        <p className="census-lede">{orderTitle(who)}</p>
        <p className="order-sub">STAT same-day. Pick equipment, then a vendor.</p>
        <PatientChips
          patients={patients}
          selectedId={patientId}
          onPick={setPatientId}
        />
      </header>
      <div className="order-body">
        <SkuRow selected={hcpcs} onPick={pickSku} />
        <OfferPick
          cards={cards}
          selectedId={selected.vendorId}
          deadline={deadline}
          onPick={setVendorId}
        />
        {note ? <p className="cost-note">{note}</p> : null}
        {needsOverride ? (
          <Input
            name="overrideReason"
            label="Why this vendor?"
            hint="Required when you skip the best option."
            required
          />
        ) : null}
        {needsDon ? (
          <Input
            name="donReason"
            label="Director of nursing reason"
            hint="Required on routine orders over $3 a day. STAT sends now."
            required
          />
        ) : null}
        {state.error ? (
          <p role="alert" className="order-error">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <Toast tone="success" title="Order placed">
            Confirm it from the census or the vendor inbox. The quoted vendor and
            ETA stay on the order.
          </Toast>
        ) : null}
      </div>
      <footer className="census-foot">
        <Button
          variant="app"
          type="submit"
          disabled={pending}
          style={{ width: "100%", minHeight: 48, justifyContent: "center" }}
        >
          {pending ? "Sending…" : sendLabel(hcpcs)}
        </Button>
        <p className="census-footnote">
          STAT · same-day · prices are CMS-shaped fixtures
        </p>
      </footer>
    </form>
  );
}
