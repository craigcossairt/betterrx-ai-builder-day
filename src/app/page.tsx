import Image from "next/image";
import { Suspense } from "react";
import { getHospiceStore } from "@/store/hospice-store";
import { projectBoard } from "@/project/board";
import { Badge, Card } from "@/ui";
import { formatLaneLabel, formatStamp } from "@/ui/format";
import { parseRole, RoleSwitcher, ROLES } from "@/ui/RoleSwitcher";
import type { Order } from "@/domain/order";

function stampFor(order: Order): string | null {
  switch (order.status) {
    case "ordered":
      return `Ordered ${formatStamp(order.orderedAt)} · target ${formatStamp(order.targetAt)}`;
    case "dispatched":
      return `ETA ${formatStamp(order.eta)}`;
    case "in_transit_at_risk":
      return `ETA ${formatStamp(order.eta)} · discharge ${formatStamp(order.dischargeAt)}`;
    case "delivered":
      return `Delivered ${formatStamp(order.deliveredAt)}`;
    case "pickup_triggered":
    case "pickup_delayed":
      return `Triggered ${formatStamp(order.triggeredAt)}`;
  }
}

function toneFor(status: Order["status"]) {
  if (status === "in_transit_at_risk" || status === "pickup_delayed") {
    return "red" as const;
  }
  if (status === "delivered") return "green" as const;
  if (status === "pickup_triggered") return "gold" as const;
  if (status === "ordered") return "peach" as const;
  return "blue" as const;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const role = parseRole((await searchParams).role);
  const board = projectBoard(getHospiceStore().snapshot());
  const roleLabel = ROLES.find((item) => item.id === role)?.label;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--surface-100)",
        fontFamily: "var(--font-ui)",
      }}
    >
      <header
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--line-200)",
          gap: 12,
        }}
      >
        <Image
          src="/brand/logo-pill.png"
          alt="BetterRX"
          width={120}
          height={34}
          priority
        />
        <Suspense>
          <RoleSwitcher role={role} />
        </Suspense>
      </header>
      <div style={{ padding: 16, display: "grid", gap: 14, maxWidth: 560 }}>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "var(--coral-600)",
              textTransform: "uppercase",
            }}
          >
            Hospice DME
          </div>
          <div
            style={{ fontSize: 21, fontWeight: 700, color: "var(--ink-900)" }}
          >
            Census board.
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>
            Viewing as {roleLabel}. Six synthetic Orders. Status is stored
            state.
          </div>
        </div>
        {board.lanes.map((lane) =>
          lane.orders.map((order) => (
            <Card
              key={order.id}
              variant="app"
              topBar={
                order.status === "in_transit_at_risk" ||
                order.status === "pickup_delayed"
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink-900)",
                    }}
                  >
                    {order.id}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-500)" }}>
                    {order.patientId} · {order.hospice}
                  </div>
                </div>
                <Badge tone={toneFor(order.status)}>
                  {formatLaneLabel(order.status)}
                </Badge>
              </div>
              <ul
                style={{
                  margin: "12px 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 4,
                }}
              >
                {order.equipment.map((line) => (
                  <li
                    key={`${order.id}-${line.hcpcs}`}
                    style={{ fontSize: 14, color: "var(--ink-700)" }}
                  >
                    <strong>{line.hcpcs}</strong> {line.name}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--ink-500)",
                }}
              >
                {stampFor(order)}
              </div>
              {"riskWhy" in order && order.riskWhy ? (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "var(--red-500)",
                  }}
                >
                  {order.riskWhy}
                </div>
              ) : null}
            </Card>
          )),
        )}
      </div>
    </main>
  );
}
