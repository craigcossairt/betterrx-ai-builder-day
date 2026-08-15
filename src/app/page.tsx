import { CATALOG } from "@/domain/catalog";
import { systemClock } from "@/domain/clock";
import { asOrderId, asPatientId } from "@/domain/order";
import { demoOfferWindow, offersFor, presentOffers } from "@/domain/offers";
import { censusPpd } from "@/domain/ppd";
import { listDonAsks } from "@/inbox/don-ask";
import { listSms } from "@/inbox/sms-inbox";
import { projectClinicianInbox } from "@/project/clinician-inbox";
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
import { ClinicianInbox } from "@/ui/order/ClinicianInbox";
import { PhoneBack } from "@/ui/order/PhoneBack";
import { VendorTaskScreen } from "@/ui/order/VendorTaskScreen";
import { AskWhyScreen } from "@/ui/don/AskWhyScreen";
import { DonReport } from "@/ui/don/DonReport";
import { PatientPicture } from "@/ui/patient/PatientPicture";
import { parseRole } from "@/ui/roles";
import {
  boardHref,
  parseKind,
  parsePanel,
  parseSurface,
  parseTab,
  resolveBoardView,
  type BoardMain,
} from "@/ui/nav";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string;
    panel?: string;
    surface?: string;
    patient?: string;
    tab?: string;
    order?: string;
    kind?: string;
  }>;
}) {
  const params = await searchParams;
  const role = parseRole(params.role);
  const surface = parseSurface(params.surface);
  const panel = parsePanel(params.panel);
  const tab = parseTab(params.tab);
  const kind = parseKind(params.kind);
  const patient = params.patient ? asPatientId(params.patient) : null;
  const askOrderId = params.order ? asOrderId(params.order) : null;
  const snapshot = await (await getHospiceStore()).snapshot();
  const now = systemClock.now();
  const census = projectCensus(snapshot, now);
  const ppd = censusPpd(snapshot, CATALOG, 7, now);
  const inbox = listSms();
  const alerts = projectClinicianInbox({
    role,
    orders: snapshot,
    asks: listDonAsks(),
  });
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
  const sharedNote = role !== "don" && shared ? "Shared census." : undefined;
  const homeHref = boardHref({ role, surface });
  const view = resolveBoardView({
    role,
    surface,
    panel,
    hasPatient: Boolean(patient),
  });
  const donReport = (
    <DonReport
      ppd={ppd}
      orders={snapshot}
      now={now}
      role={role}
      surface={surface}
    />
  );
  const oversightScreen = (
    <div className="oversight-screen">
      {surface === "phone" ? <PhoneBack role={role} surface={surface} /> : null}
      {donReport}
    </div>
  );
  const askScreen = (
    <AskWhyScreen
      role={role}
      surface={surface}
      order={
        askOrderId
          ? (snapshot.find((row) => row.id === askOrderId) ?? null)
          : null
      }
    />
  );

  const orderScreen = (
    <PlaceOrderForm
      offerSets={offerSets}
      deadline={window.deadline}
      role={role}
      surface={surface}
      initialPatientId={patient}
      initialKind={kind === "supplies" ? "supplies" : "dme"}
    />
  );
  const inboxScreen =
    role === "vendor" ? (
      <VendorTaskScreen
        role={role}
        surface={surface}
        orders={snapshot}
        messages={inbox}
        orderId={askOrderId}
      />
    ) : (
      <ClinicianInbox role={role} surface={surface} rows={alerts} />
    );
  const censusScreen = (
    <>
      <CensusHeader lede={census.lede} href={homeHref} />
      <CensusBoard
        lines={census.lines}
        role={role}
        surface={surface}
        selectedPatientId={patient}
      />
      <CensusFooter
        role={role}
        surface={surface}
        note={sharedNote}
        strip={
          role === "don" ? (
            <a
              className="don-over-link"
              href={boardHref({ role, surface, panel: "oversight" })}
            >
              <span className="don-over-label">Equipment oversight</span>
              <DonReport ppd={ppd} compact />
            </a>
          ) : null
        }
      />
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

  const emptyMain = (
    <p className="order-sub desk-empty">Select a patient from the census.</p>
  );

  function deskMain(main: BoardMain) {
    if (main === "order") return orderScreen;
    if (main === "inbox") return inboxScreen;
    if (main === "oversight") return oversightScreen;
    if (main === "ask") return askScreen;
    if (main === "patient") return patientScreen;
    return emptyMain;
  }

  const body =
    view.kind === "vendor_task" ? (
      inboxScreen
    ) : view.kind === "order" ? (
      orderScreen
    ) : view.kind === "inbox" ? (
      inboxScreen
    ) : view.kind === "oversight" ? (
      oversightScreen
    ) : view.kind === "ask" ? (
      askScreen
    ) : view.kind === "patient" ? (
      patientScreen
    ) : view.kind === "census" ? (
      censusScreen
    ) : (
      <div className="desk-split">
        <aside className="desk-census">{censusScreen}</aside>
        <main className="desk-main">{deskMain(view.main)}</main>
      </div>
    );

  return (
    <AppFrame
      role={role}
      surface={surface}
      homeHref={homeHref}
      panel={panel}
      patient={patient}
      inboxCount={alerts.length}
    >
      {body}
    </AppFrame>
  );
}
