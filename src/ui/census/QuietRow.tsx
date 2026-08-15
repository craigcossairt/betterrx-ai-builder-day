import type { ReactNode } from "react";
import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function QuietRow({
  line,
  href,
  selected,
  children,
}: {
  line: CensusLine;
  href?: string;
  selected?: boolean;
  children?: ReactNode;
}) {
  const inner = (
    <>
      <div>
        <b className="quiet-row-who">{line.who}</b>
        <div className="quiet-row-sentence">{line.sentence}</div>
      </div>
      <TrackMark label={line.trackLabel} />
    </>
  );
  const rowClass = selected ? "quiet-row quiet-row--on" : "quiet-row";
  const row = href ? (
    <a className={rowClass} href={href}>
      {inner}
    </a>
  ) : (
    <div className={rowClass}>{inner}</div>
  );
  if (!children) return row;
  return (
    <div className="quiet-row-block">
      {row}
      {children}
    </div>
  );
}
