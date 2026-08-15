import type { ReactNode } from "react";

export function CensusFooter({
  note,
  strip,
}: {
  role?: string;
  surface?: string;
  note?: string;
  strip?: ReactNode;
}) {
  return (
    <footer className="census-foot">
      {strip ?? (note ? <p className="census-foot-note">{note}</p> : null)}
    </footer>
  );
}
