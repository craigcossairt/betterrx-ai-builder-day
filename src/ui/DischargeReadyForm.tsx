"use client";

import { useActionState } from "react";
import { markDischargeReadyAction } from "@/app/actions";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

export function DischargeReadyForm({ patientId }: { patientId: string }) {
  const [state, formAction, pending] = useActionState(
    markDischargeReadyAction,
    {},
  );
  return (
    <form
      action={formAction}
      style={{ display: "grid", gap: 8, marginTop: 12 }}
    >
      <input type="hidden" name="patientId" value={patientId} />
      <Input
        name="reason"
        label="Override reason"
        hint="Needed only when required equipment is still out."
      />
      {state.error ? (
        <p role="alert" style={{ color: "var(--red-500)", margin: 0, fontSize: 14 }}>
          {state.error}
        </p>
      ) : null}
      <Button variant="outline" size="sm" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Discharge ready"}
      </Button>
    </form>
  );
}
