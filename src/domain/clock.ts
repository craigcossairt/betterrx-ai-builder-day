export type Instant = string & { readonly brand: "Instant" };

export type Clock = {
  now(): Instant;
};

export const DEMO_TIME_ZONE = "America/Chicago";

export function asInstant(isoUtc: string): Instant {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(isoUtc)) {
    throw new Error(`not a UTC instant: ${isoUtc}`);
  }
  return isoUtc as Instant;
}

export const systemClock: Clock = {
  now() {
    return asInstant(new Date().toISOString());
  },
};

export function frozenClock(at: Instant | string): Clock {
  const instant = asInstant(
    at.endsWith("Z") ? at : `${at}Z`.replace("ZZ", "Z"),
  );
  return { now: () => instant };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function atZone(date: Date, timeZone: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function fromZoneLocal(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Instant {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const shown = atZone(new Date(guess), timeZone);
  const deltaMinutes =
    (shown.hour - hour) * 60 +
    (shown.minute - minute) +
    (shown.day - day) * 24 * 60;
  return asInstant(new Date(guess - deltaMinutes * 60_000).toISOString());
}

export function resolveWireTime(wire: string, clock: Clock): Instant {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(wire)) {
    return asInstant(wire);
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(wire)) {
    const [date, time] = wire.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    return fromZoneLocal(year, month, day, hour, minute, DEMO_TIME_ZONE);
  }
  const now = new Date(clock.now());
  const local = atZone(now, DEMO_TIME_ZONE);
  const todayMatch = /^today-(\d{2}):(\d{2})$/.exec(wire);
  if (todayMatch) {
    return fromZoneLocal(
      local.year,
      local.month,
      local.day,
      Number(todayMatch[1]),
      Number(todayMatch[2]),
      DEMO_TIME_ZONE,
    );
  }
  const yesterdayMatch = /^yesterday-(\d{2}):(\d{2})$/.exec(wire);
  if (yesterdayMatch) {
    const yesterday = new Date(
      Date.UTC(local.year, local.month - 1, local.day - 1),
    );
    const y = atZone(yesterday, "UTC");
    return fromZoneLocal(
      y.year,
      y.month,
      y.day,
      Number(yesterdayMatch[1]),
      Number(yesterdayMatch[2]),
      DEMO_TIME_ZONE,
    );
  }
  const daysAgo = /^(\d+)-days-ago$/.exec(wire);
  if (daysAgo) {
    const shifted = new Date(now.getTime() - Number(daysAgo[1]) * 86_400_000);
    return asInstant(shifted.toISOString());
  }
  throw new Error(`unresolved wire time: ${wire}`);
}
