import { CATALOG, MEDS } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { censusPpd } from "@/domain/ppd";
import { listSms } from "@/inbox/sms-inbox";
import { supabaseConfig } from "@/lib/supabase";
import { getHospiceStore } from "@/store/hospice-store";
import { lookupPatient } from "@/domain/patients";
import { projectCensus } from "@/project/census";
import {
  CensusBoard,
  CensusFooter,
  CensusHeader,
  InboxMessage,
  PhoneShell,
} from "@/ui/census";
import { PlaceOrderForm } from "@/ui/PlaceOrderForm";
import { parseRole, ROLES } from "@/ui/roles";
import { parsePanel } from "@/ui/nav";
import { PanelDialog } from "@/ui/PanelDialog";
import type { Order } from "@/domain/order";

function censusPatients(orders: readonly Order[]) {
  const seen = new Map<
    string,
    { id: string; hospice: string; displayName: string }
  >();
  for (const order of orders) {
    if (!seen.has(order.patientId)) {
      seen.set(order.patientId, {
        id: order.patientId,
        hospice: order.hospice,
        displayName: lookupPatient(order.patientId).displayName,
      });
    }
  }
  return [...seen.values()];
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; panel?: string }>;
}) {
  const params = await searchParams;
  const role = parseRole(params.role);
  const panel = parsePanel(params.panel);
  const snapshot = await (await getHospiceStore()).snapshot();
  const now = systemClock.now();
  const census = projectCensus(snapshot, now);
  const roleLabel = ROLES.find((item) => item.id === role)?.label;
  const ppd = censusPpd(snapshot, CATALOG, 7, now);
  const inbox = listSms();
  const window = demoOfferWindow(now);
  const offerSets = {
    E0250: presentOffers(
      offersFor("E0250", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    ),
    E1390: presentOffers(
      offersFor("E1390", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    ),
  };
  const shared = Boolean(supabaseConfig());
  const donNote =
    role === "don"
      ? `PPD $${ppd.actualUsd.toFixed(2)} vs $${ppd.targetUsd.toFixed(2)}. Idle pickup ${ppd.idlePickupDays} days. Morphine concentrate $${MEDS[0].unitPriceUsd.toFixed(2)}/${MEDS[0].unit}. Viewing as ${roleLabel}.`
      : shared
        ? "Shared census."
        : undefined;

  return (
    <PhoneShell>
      <CensusHeader role={role} lede={census.lede} />
      <CensusBoard lines={census.lines} role={role} />
      <CensusFooter
        role={role}
        canOrder={role !== "don"}
        note={donNote}
      />

      {panel === "order" ? (
        <PanelDialog title="Place an order" wide>
          <PlaceOrderForm
            offerSets={offerSets}
            patients={censusPatients(snapshot)}
          />
        </PanelDialog>
      ) : null}
      {panel === "inbox" ? (
        <PanelDialog title="Vendor SMS inbox">
          <p className="app-ppd-note" style={{ marginTop: 0 }}>
            Simulated text. No vendor account.
          </p>
          {inbox.map((message) => (
            <InboxMessage key={message.id} message={message} />
          ))}
        </PanelDialog>
      ) : null}
    </PhoneShell>
  );
}
