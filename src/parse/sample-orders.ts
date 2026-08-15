import { resolveWireTime, type Clock, type Instant } from "@/domain/clock";
import {
  asHospiceName,
  asOrderId,
  asPatientId,
  asVendorId,
  type EquipmentLine,
  type Order,
  type OrderType,
  type PickupTrigger,
} from "@/domain/order";

export class ParseError extends Error {
  readonly path: string;
  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.path = path;
  }
}

type WireEquipment = { hcpcs: string; name: string };
type WireRisk = { flagged: boolean; why: string };
type WireProof = { signature: boolean; timestamp: boolean };
type WireOrder = {
  id: string;
  status: string;
  patientId: string;
  hospice: string;
  equipment: WireEquipment[];
  orderType?: string;
  orderedAt?: string;
  targetAt?: string;
  vendorId?: string | null;
  eta?: string;
  dischargeAt?: string;
  deliveredAt?: string;
  proofOfDelivery?: WireProof;
  trigger?: string;
  triggeredAt?: string;
  risk?: WireRisk;
  notes?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mapWireHcpcs(wire: string, name: string): EquipmentLine {
  if (wire === "E0601" && /oxygen/i.test(name)) {
    return { hcpcs: "E1390", name: "Oxygen Concentrator" };
  }
  if (wire === "E0250" || wire === "E1390" || wire === "E1130") {
    return { hcpcs: wire, name };
  }
  throw new ParseError("equipment.hcpcs", `unknown HCPCS ${wire}`);
}

function requireNonEmptyEquipment(
  lines: EquipmentLine[],
  path: string,
): readonly [EquipmentLine, ...EquipmentLine[]] {
  if (lines.length === 0) {
    throw new ParseError(path, "equipment is empty");
  }
  return lines as [EquipmentLine, ...EquipmentLine[]];
}

function asOrderType(raw: string | undefined, path: string): OrderType {
  if (raw === "admission" || raw === "routine" || raw === "stat") return raw;
  throw new ParseError(path, `unknown orderType ${raw ?? "missing"}`);
}

function asTrigger(raw: string | undefined, path: string): PickupTrigger {
  if (raw === "patient_status_deceased" || raw === "nurse_request") return raw;
  throw new ParseError(path, `unknown trigger ${raw ?? "missing"}`);
}

function requireTime(
  raw: string | undefined,
  clock: Clock,
  path: string,
): Instant {
  if (!raw) throw new ParseError(path, "missing timestamp");
  return resolveWireTime(raw, clock);
}

function requireVendor(
  raw: string | null | undefined,
  path: string,
): ReturnType<typeof asVendorId> {
  if (!raw) throw new ParseError(path, "vendor required after ordered");
  return asVendorId(raw);
}

export function parseSampleOrders(raw: unknown, clock: Clock): Order[] {
  if (!isRecord(raw) || !Array.isArray(raw.orders)) {
    throw new ParseError("$", "expected { orders: [] }");
  }
  return raw.orders.map((item, index) => {
    const path = `orders[${index}]`;
    if (!isRecord(item)) throw new ParseError(path, "not an object");
    const wire = item as unknown as WireOrder;
    const equipment = requireNonEmptyEquipment(
      (wire.equipment ?? []).map((line) =>
        mapWireHcpcs(line.hcpcs, line.name),
      ),
      `${path}.equipment`,
    );
    const base = {
      id: asOrderId(wire.id),
      patientId: asPatientId(wire.patientId),
      hospice: asHospiceName(wire.hospice),
      equipment,
      notes: wire.notes,
    };
    switch (wire.status) {
      case "ordered":
        return {
          ...base,
          status: "ordered",
          orderType: asOrderType(wire.orderType, `${path}.orderType`),
          orderedAt: requireTime(wire.orderedAt, clock, `${path}.orderedAt`),
          targetAt: requireTime(wire.targetAt, clock, `${path}.targetAt`),
          vendorId: null,
        };
      case "dispatched":
        return {
          ...base,
          status: "dispatched",
          orderType: asOrderType(wire.orderType, `${path}.orderType`),
          vendorId: requireVendor(wire.vendorId, `${path}.vendorId`),
          eta: requireTime(wire.eta, clock, `${path}.eta`),
        };
      case "in_transit_at_risk":
        return {
          ...base,
          status: "in_transit_at_risk",
          orderType: asOrderType(wire.orderType, `${path}.orderType`),
          vendorId: requireVendor(wire.vendorId, `${path}.vendorId`),
          eta: requireTime(wire.eta, clock, `${path}.eta`),
          dischargeAt: requireTime(
            wire.dischargeAt,
            clock,
            `${path}.dischargeAt`,
          ),
          riskWhy: wire.risk?.why ?? "",
        };
      case "delivered":
        return {
          ...base,
          status: "delivered",
          vendorId: requireVendor(wire.vendorId, `${path}.vendorId`),
          deliveredAt: requireTime(
            wire.deliveredAt,
            clock,
            `${path}.deliveredAt`,
          ),
          proofOfDelivery: wire.proofOfDelivery ?? {
            signature: false,
            timestamp: false,
          },
        };
      case "pickup_triggered":
        return {
          ...base,
          status: "pickup_triggered",
          vendorId: requireVendor(wire.vendorId, `${path}.vendorId`),
          trigger: asTrigger(wire.trigger, `${path}.trigger`),
          triggeredAt: requireTime(
            wire.triggeredAt,
            clock,
            `${path}.triggeredAt`,
          ),
        };
      case "pickup_delayed":
        return {
          ...base,
          status: "pickup_delayed",
          vendorId: requireVendor(wire.vendorId, `${path}.vendorId`),
          trigger: asTrigger(wire.trigger, `${path}.trigger`),
          triggeredAt: requireTime(
            wire.triggeredAt,
            clock,
            `${path}.triggeredAt`,
          ),
          riskWhy: wire.risk?.why ?? "",
        };
      default:
        throw new ParseError(`${path}.status`, `unknown status ${wire.status}`);
    }
  });
}
