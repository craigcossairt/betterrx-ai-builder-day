import { CATALOG } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { asPatientId } from "@/domain/order";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { censusPpd } from "@/domain/ppd";
import { listSms } from "@/inbox/sms-inbox";
import { supabaseConfig } from "@/lib/supabase";
import { getHospiceStore } from "@/store/hospice-store";
import { projectCensus } from "@/project/census";
import {
  CensusBoard,
  CensusFooter,
  CensusHeader,
} from "@/ui/census";
import { AppFrame } from "@/ui/chrome/AppFrame";
import { PlaceOrderForm } from "@/ui/PlaceOrderForm";
import { InboxScreen } from "@/ui/order";
import { DonReport } from "@/ui/don/DonReport";
import { PatientPicture } from "@/ui/patient/PatientPicture";
import { parseRole } from "@/ui/roles";
import { parsePanel, parseSurface, parseTab } from "@/ui/nav";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    panel?: string;
    surface?: string;
    patient?: string;
    tab?: string;
  }>;
}) {
  const params = await searchParams;
  const role = parseRole(params.role);
  const surface = parseSurface(params.surface);
  const panel = parsePanel(params.panel);
  const tab = parseTab(params.tab);
  const patient = params.patient ? asPatientId(params.patient) : null;
  const snapshot = await (await getHospiceStore()).snapshot();
  const now = systemClock.now();
  const census = projectCensus(snapshot, now);
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
    E1130: presentOffers(
      offersFor("E1130", window.preferredEta, window.lateEta),
      window.deadline,
      CATALOG,
    ),
  };
  const shared = Boolean(supabaseConfig());
  const donNote =
    role === "don"
      ? `PPD $${ppd.actualUsd.toFixed(2)} vs $${ppd.targetUsd.toFixed(2)}. Idle pickup ${ppd.idlePickupDays} days.`
      : shared
        ? "Shared census."
        : undefined;
  const donReport = <DonReport ppd={ppd} />;

  const orderScreen = (
    <PlaceOrderForm
      offerSets={offerSets}
      deadline={window.deadline}
      role={role}
      surface={surface}
    />
  );
  const inboxScreen = (
    <InboxScreen role={role} surface={surface} messages={inbox} />
  );
  const censusScreen = (
    <>
      <CensusHeader lede={census.lede} />
      <CensusBoard lines={census.lines} role={role} surface={surface} />
      <CensusFooter role={role} surface={surface} note={donNote} />
    </>
  );
  const patientScreen = patient ? (
    <PatientPicture
      patientId={patient}
      tab={tab}
      orders={snapshot}
      now={now}
      role={role}
      surface={surface}
    />
  ) : null;

  let body;
  if (role === "vendor") {
    body = inboxScreen;
  } else if (surface === "phone") {
    if (panel === "order") body = orderScreen;
    else if (panel === "inbox") body = inboxScreen;
    else if (patientScreen) body = patientScreen;
    else if (role === "don") body = <>{censusScreen}{donReport}</>;
    else body = censusScreen;
  } else {
    body = (
      <div className="desk-split">
        <aside className="desk-census">{censusScreen}</aside>
        <main className="desk-main">
          {panel === "order"
            ? orderScreen
            : panel === "inbox"
              ? inboxScreen
              : patientScreen ??
                (role === "don" ? (
                  donReport
                ) : (
                  <p className="order-sub desk-empty">
                    Select a patient from the census.
                  </p>
                ))}
        </main>
      </div>
    );
  }

  return (
    <AppFrame role={role} surface={surface}>
      {body}
    </AppFrame>
  );
}
