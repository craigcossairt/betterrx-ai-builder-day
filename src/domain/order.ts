export type OrderId = string & { readonly brand: "OrderId" };
export type PatientId = string & { readonly brand: "PatientId" };
export type VendorId = string & { readonly brand: "VendorId" };
export type HospiceName = string & { readonly brand: "HospiceName" };

export type Hcpcs = "E0250" | "E1390" | "E1130";
export type OrderType = "admission" | "routine" | "stat";
export type PickupTrigger = "patient_status_deceased" | "nurse_request";

export type EquipmentLine = {
  hcpcs: Hcpcs;
  name: string;
};

export type ProofOfDelivery = {
  signature: boolean;
  timestamp: boolean;
};

type OrderBase = {
  id: OrderId;
  patientId: PatientId;
  hospice: HospiceName;
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

export type Order =
  | OrderedOrder
  | DispatchedOrder
  | InTransitAtRiskOrder
  | DeliveredOrder
  | PickupTriggeredOrder
  | PickupDelayedOrder;

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
