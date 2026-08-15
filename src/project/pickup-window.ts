export const PROPOSE_DAYS = ["Today", "Tomorrow", "In two days"] as const;
export const PROPOSE_HOURS = [8, 10, 12, 14, 16, 18] as const;

export function formatHour(hour: number): string {
  const ap = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve} ${ap}`;
}

export function formatProposedWindow(
  day: number,
  start: number,
  end: number,
): string | null {
  if (end <= start) return null;
  const label = PROPOSE_DAYS[day];
  if (!label) return null;
  return `${label}, ${formatHour(start)}–${formatHour(end)}`;
}
