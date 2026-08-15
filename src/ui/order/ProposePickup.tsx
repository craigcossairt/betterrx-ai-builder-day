"use client";

import { useState } from "react";
import { setPickupWindowAction } from "@/app/actions";
import { Button } from "@/ui/Button";
import {
  formatHour,
  formatProposedWindow,
  PROPOSE_DAYS,
  PROPOSE_HOURS,
} from "@/project/pickup-window";

export function ProposePickup({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [start, setStart] = useState(16);
  const [end, setEnd] = useState(18);
  const windowLabel = formatProposedWindow(day, start, end);
  return (
    <div className="propose-box">
      <Button
        variant="ghost"
        type="button"
        onClick={() => setOpen((on) => !on)}
      >
        {open ? "Close the picker" : "Neither — propose a time"}
      </Button>
      {open ? (
        <form action={setPickupWindowAction} className="propose-form">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="window" value={windowLabel ?? ""} />
          <div className="propose-days">
            {PROPOSE_DAYS.map((label, index) => (
              <button
                key={label}
                type="button"
                className={
                  day === index ? "propose-chip propose-chip--on" : "propose-chip"
                }
                onClick={() => setDay(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="chart-label">Earliest</span>
          <div className="propose-hours">
            {PROPOSE_HOURS.map((hour) => (
              <button
                key={`s${hour}`}
                type="button"
                className={
                  start === hour ? "propose-chip propose-chip--on" : "propose-chip"
                }
                onClick={() => {
                  setStart(hour);
                  if (end <= hour) setEnd(hour + 2);
                }}
              >
                {formatHour(hour)}
              </button>
            ))}
          </div>
          <span className="chart-label">Latest</span>
          <div className="propose-hours">
            {PROPOSE_HOURS.map((hour) => (
              <button
                key={`e${hour}`}
                type="button"
                className={
                  end === hour ? "propose-chip propose-chip--on" : "propose-chip"
                }
                onClick={() => setEnd(hour)}
              >
                {formatHour(hour)}
              </button>
            ))}
          </div>
          <p className="order-sub">
            {windowLabel
              ? `You are offering ${windowLabel}. The nurse and the family see the window.`
              : "The latest time has to be after the earliest."}
          </p>
          <Button variant="app" type="submit" disabled={!windowLabel}>
            {windowLabel ? `Send ${windowLabel}` : "Pick a later end time"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
