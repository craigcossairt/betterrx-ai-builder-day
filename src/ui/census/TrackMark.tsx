import type { TrackLabel } from "@/project/census";

const TONE: Record<TrackLabel, string> = {
  "AT RISK": "track-mark--coral",
  "PICKUP LATE": "track-mark--red",
  DONE: "track-mark--green",
  WAITING: "track-mark--muted",
  "ON THE WAY": "track-mark--muted",
  PICKUP: "track-mark--muted",
};

export function TrackMark({ label }: { label: TrackLabel }) {
  return <span className={`track-mark ${TONE[label]}`}>{label}</span>;
}
