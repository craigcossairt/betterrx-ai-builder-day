"use client";

import { useActionState, useMemo, useState } from "react";
import { placeOrderAction } from "@/app/actions";
import type { Instant } from "@/domain/clock";
import { costGate, type OfferCard } from "@/domain/offers";
import type { Hcpcs } from "@/domain/order";
import {
  searchPatients,
  type CensusPatient,
} from "@/domain/patients";
import {
  searchShop,
  shopItems,
  vendorRecord,
  type ShopItem,
  type ShopKind,
} from "@/domain/shop";
import { costNote, offerStory, preferredLineStory } from "@/project/order-copy";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Toast } from "@/ui/Toast";
import { formatVendor } from "@/ui/format";
import { PhoneBack } from "@/ui/order/PhoneBack";
import type { SurfaceId } from "@/ui/nav";
import type { RoleId } from "@/ui/roles";

const KINDS: { id: ShopKind; label: string }[] = [
  { id: "medication", label: "Medication" },
  { id: "dme", label: "DME" },
  { id: "supplies", label: "Supplies" },
];

export function PlaceOrderForm({
  offerSets,
  deadline,
  role,
  surface,
}: {
  offerSets: Record<Hcpcs, OfferCard[]>;
  deadline: Instant;
  role: RoleId;
  surface: SurfaceId;
}) {
  const [query, setQuery] = useState("");
  const [patient, setPatient] = useState<CensusPatient | null>(null);
  const [kind, setKind] = useState<ShopKind>("dme");
  const [itemQuery, setItemQuery] = useState("");
  const [lines, setLines] = useState<ShopItem[]>([]);
  const [vendorId, setVendorId] = useState("vendor-1");
  const [state, formAction, pending] = useActionState(placeOrderAction, {});

  const people = searchPatients(query);
  const emr = patient ? shopItems({ kind, emrFor: patient.id }) : [];
  const hits = searchShop({ kind, query: itemQuery });
  const dmeLines = lines.filter((line) => line.kind === "dme");
  const primary = (dmeLines.find((line) => line.code === "E1390")?.code ??
    dmeLines[0]?.code ??
    "E0250") as Hcpcs;
  const cards = offerSets[primary] ?? offerSets.E0250;
  const selected = cards.find((card) => card.vendorId === vendorId) ?? cards[0];
  const total = lines.reduce((sum, line) => sum + (line.dailyRateUsd ?? 0), 0);
  const needsOverride = selected && !selected.preferred;
  const note = selected
    ? costNote({
        orderType: "stat",
        dailyRateUsd: selected.dailyRateUsd,
        hcpcs: primary,
      })
    : null;
  const canSend = dmeLines.length > 0;

  const results = useMemo(
    () => hits.filter((item) => !lines.some((line) => line.code === item.code)),
    [hits, lines],
  );

  function add(item: ShopItem) {
    setLines((current) =>
      current.some((line) => line.code === item.code)
        ? current
        : [...current, item],
    );
  }

  return (
    <form action={formAction} className="order-screen">
      {dmeLines.map((line) => (
        <input key={line.code} type="hidden" name="hcpcs" value={line.code} />
      ))}
      <input type="hidden" name="vendorId" value={selected?.vendorId ?? ""} />
      <input type="hidden" name="patientId" value={patient?.id ?? ""} />
      <header className="census-head">
        <PhoneBack role={role} surface={surface} />
        <p className="census-lede">New order</p>
      </header>
      <div className="order-body">
        {!patient ? (
          <>
            <input
              className="search-box"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patients"
              aria-label="Search patients"
            />
            <div className="search-list">
              {people.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  className="search-hit"
                  onClick={() => setPatient(person)}
                >
                  <span>
                    <b>{person.displayName}</b>
                    <span className="order-sub">{person.summary}</span>
                  </span>
                  <span className="search-pick">Select</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="picked-patient">
              <div>
                <b>{patient.displayName}</b>
                <div className="order-sub">{patient.summary}</div>
              </div>
              <button type="button" onClick={() => setPatient(null)}>
                Change
              </button>
            </div>
            <div className="seg" role="group" aria-label="Order type">
              {KINDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={kind === item.id ? "seg-btn seg-btn--on" : "seg-btn"}
                  onClick={() => {
                    setKind(item.id);
                    setItemQuery("");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {kind === "medication" ? (
              <div className="pic-card">
                Medications are ordered in eRX, BetterRX pharmacy. This product
                adds equipment and supplies beside it.
              </div>
            ) : (
              <>
                {emr.length > 0 ? (
                  <>
                    <div className="eyebrow">From the EMR admission orders</div>
                    <div className="emr-row">
                      {emr.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          className="emr-chip"
                          onClick={() => add(item)}
                        >
                          + {item.name}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
                <input
                  className="search-box"
                  value={itemQuery}
                  onChange={(event) => setItemQuery(event.target.value)}
                  placeholder={
                    kind === "dme" ? "Search equipment" : "Search supplies"
                  }
                  aria-label="Search items"
                />
                <div className="search-list">
                  {results.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className="search-hit"
                      onClick={() => add(item)}
                    >
                      <span>
                        <b>{item.name}</b>
                        <span className="order-sub">{item.code}</span>
                      </span>
                      <span className="search-pick">
                        {item.dailyRateUsd != null
                          ? `$${item.dailyRateUsd.toFixed(2)}/day`
                          : "Add"}
                      </span>
                    </button>
                  ))}
                </div>
                {lines.length > 0 ? (
                  <>
                    <div className="eyebrow">This order</div>
                    <div className="order-lines">
                      {lines.map((line) => (
                        <div key={line.code} className="order-line">
                          <span>
                            <b>{line.name}</b>
                            <span className="order-sub">
                              {line.kind === "dme" &&
                              offerSets[line.code as Hcpcs]
                                ? preferredLineStory(
                                    line.code as Hcpcs,
                                    offerSets[line.code as Hcpcs],
                                    deadline,
                                  )
                                : "Recommended vendor · stock, ETA, and price below"}
                            </span>
                          </span>
                          <span className="dme-price">
                            {line.dailyRateUsd != null
                              ? `$${line.dailyRateUsd.toFixed(2)}/day`
                              : ""}
                            <button
                              type="button"
                              onClick={() =>
                                setLines((current) =>
                                  current.filter((row) => row.code !== line.code),
                                )
                              }
                            >
                              Remove
                            </button>
                          </span>
                        </div>
                      ))}
                      <div className="order-line">
                        <span>Daily total · recommended vendor</span>
                        <b>${total.toFixed(2)}</b>
                      </div>
                    </div>
                    {note ? <p className="cost-note">{note}</p> : null}
                    <div className="eyebrow">
                      Who delivers. Stock, ETA, price, track record
                    </div>
                    <div className="offer-stack">
                      {cards.map((card) => {
                        const story = offerStory(card, deadline);
                        const on = selected?.vendorId === card.vendorId;
                        return (
                          <button
                            key={card.vendorId}
                            type="button"
                            className={
                              on
                                ? card.preferred
                                  ? "offer-card offer-card--best offer-card--on"
                                  : "offer-card offer-card--on"
                                : card.preferred
                                  ? "offer-card offer-card--best"
                                  : "offer-card"
                            }
                            onClick={() => setVendorId(card.vendorId)}
                          >
                            <div className="offer-card-top">
                              <b>{formatVendor(card.vendorId)}</b>
                              <span className="offer-mark">{story.mark}</span>
                            </div>
                            <p className="offer-headline">{story.headline}</p>
                            <p className="offer-detail">{story.detail}</p>
                            <p className="offer-detail">
                              {vendorRecord(card.vendorId)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    {needsOverride ? (
                      <Input
                        name="overrideReason"
                        label="Why this vendor?"
                        hint="Required when you skip the recommended option."
                        required
                      />
                    ) : null}
                    {costGate({
                      orderType: "stat",
                      dailyRateUsd: selected?.dailyRateUsd ?? 0,
                    }).verdict === "hold" ? (
                      <Input
                        name="donReason"
                        label="Director of nursing reason"
                        required
                      />
                    ) : null}
                  </>
                ) : null}
              </>
            )}
          </>
        )}
        {state.error ? (
          <p role="alert" className="order-error">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <Toast tone="success" title="Order placed">
            Confirm it from the census or the vendor inbox.
          </Toast>
        ) : null}
      </div>
      {patient && kind !== "medication" ? (
        <footer className="census-foot">
          <Button
            variant="app"
            type="submit"
            disabled={pending || Boolean(state.ok) || !canSend}
            style={{ width: "100%", minHeight: 48, justifyContent: "center" }}
          >
            {pending
              ? "Sending…"
              : canSend
                ? "Send STAT order"
                : "Add a DME item to send"}
          </Button>
        </footer>
      ) : null}
    </form>
  );
}
