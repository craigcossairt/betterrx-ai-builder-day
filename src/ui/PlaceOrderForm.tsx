"use client";

import { placeOrderAction } from "@/app/actions";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

export function PlaceOrderForm() {
  return (
    <form action={placeOrderAction} style={{ display: "grid", gap: 10 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
        Equipment
        <select
          name="hcpcs"
          defaultValue="E0250"
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: "11px 14px",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-md)",
            fontFamily: "inherit",
          }}
        >
          <option value="E0250">E0250 Hospital bed · $2.57/day CMS-shaped</option>
          <option value="E1390">
            E1390 Oxygen concentrator · $3.34/day CMS-shaped
          </option>
        </select>
      </label>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }}>
        Vendor
        <select
          name="vendorId"
          defaultValue="vendor-1"
          style={{
            display: "block",
            width: "100%",
            marginTop: 6,
            padding: "11px 14px",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-md)",
            fontFamily: "inherit",
          }}
        >
          <option value="vendor-1">
            Preferred: vendor-1 · in stock · beats window · lower price
          </option>
          <option value="vendor-2">
            Alternate: vendor-2 · unknown stock · later ETA · higher price
          </option>
        </select>
      </label>
      <Input
        name="overrideReason"
        label="Override reason"
        hint="Required if you skip the preferred option."
      />
      <Input
        name="donReason"
        label="Director of nursing reason"
        hint="Required when the daily rate is $3.00 or more (E1390)."
      />
      <Button variant="app" type="submit">
        Place STAT order
      </Button>
    </form>
  );
}
