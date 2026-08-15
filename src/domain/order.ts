export type OrderId = string & { readonly brand: "OrderId" };
export type PatientId = string & { readonly brand: "PatientId" };
export type VendorId = string & { readonly brand: "VendorId" };
export type HospiceName = string & { readonly brand: "HospiceName" };

export type Hcpcs = "E0250" | "E1390" | "E1130";
export type SupplyCode =
  | "SUP-WOUND"
  | "SUP-FOAM"
  | "SUP-SALINE"
  | "SUP-BRIEFS"
  | "SUP-PADS"
  | "SUP-GLOVES";
export type LineCode = Hcpcs | SupplyCode;
export type OrderKind = "dme" | "supply";
export type OrderType = "admission" | "routine" | "stat";
export type PickupTrigger = "patient_status_deceased" | "nurse_request";

export const SUPPLY_CODES = [
  "SUP-WOUND",
  "SUP-FOAM",
  "SUP-SALINE",
  "SUP-BRIEFS",
  "SUP-PADS",
  "SUP-GLOVES",
] as const;

export type EquipmentLine = {
  hcpcs: LineCode;
  name: string;
};

export function isHcpcs(code: string): code is Hcpcs {
  return code === "E0250" || code === "E1390" || code === "E1130";
}

export function isSupplyCode(code: string): code is SupplyCode {
  return (SUPPLY_CODES as readonly string[]).includes(code);
}

export function orderKind(order: { kind?: OrderKind }): OrderKind {
  return order.kind ?? "dme";
}

export type ProofOfDelivery = {
  signature: boolean;
  timestamp: boolean;
  photoUrl?: string;
};

type OrderBase = {
  id: OrderId;
  patientId: PatientId;
  hospice: HospiceName;
  kind?: OrderKind;
  equipment: readonly [EquipmentLine, ...EquipmentLine[]];
  notes?: string;
};

export type OrderedOrder = OrderBase & {
  status: "ordered";
  orderType: OrderType;
  orderedAt: import("./clock").Instant;
  targetAt: import("./clock").Instant;
  vendorId: null;
  quotedVendorId?: VendorId;
  quotedEta?: import("./clock").Instant;
};

export type DispatchedOrder = OrderBase & {
  status: "dispatched";
  orderType: OrderType;
  vendorId: VendorId;
  eta: import("./clock").Instant;
};

export type InTransitAtRiskOrder = OrderBase & {
  status: "in_transit_at_risk";
  orderType: OrderType;
  vendorId: VendorId;
  eta: import("./clock").Instant;
  dischargeAt: import("./clock").Instant;
  riskWhy: string;
};

export type DeliveredOrder = OrderBase & {
  status: "delivered";
  vendorId: VendorId;
  deliveredAt: import("./clock").Instant;
  proofOfDelivery: ProofOfDelivery;
};

export type PickupTriggeredOrder = OrderBase & {
  status: "pickup_triggered";
  vendorId: VendorId;
  trigger: PickupTrigger;
  triggeredAt: import("./clock").Instant;
};

export type PickupDelayedOrder = OrderBase & {
  status: "pickup_delayed";
  vendorId: VendorId;
  trigger: PickupTrigger;
  triggeredAt: import("./clock").Instant;
  riskWhy: string;
};

export type PickedUpOrder = OrderBase & {
  status: "picked_up";
  vendorId: VendorId;
  trigger: PickupTrigger;
  triggeredAt: import("./clock").Instant;
  pickedUpAt: import("./clock").Instant;
};

export type Order =
  | OrderedOrder
  | DispatchedOrder
  | InTransitAtRiskOrder
  | DeliveredOrder
  | PickupTriggeredOrder
  | PickupDelayedOrder
  | PickedUpOrder;

export type OrderStatus = Order["status"];

export function asOrderId(raw: string): OrderId {
  return raw as OrderId;
}

export function asPatientId(raw: string): PatientId {
  return raw as PatientId;
}

export function asVendorId(raw: string): VendorId {
  return raw as VendorId;
}

export function asHospiceName(raw: string): HospiceName {
  return raw as HospiceName;
}
