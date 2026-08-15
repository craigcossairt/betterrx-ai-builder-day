import type { ReactNode } from "react";
import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function QuietRow({
  line,
  href,
  children,
}: {
  line: CensusLine;
  href?: string;
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
  const row = href ? (
    <a className="quiet-row" href={href}>
      {inner}
    </a>
  ) : (
    <div className="quiet-row">{inner}</div>
  );
  if (!children) return row;
  return (
    <div className="quiet-row-block">
      {row}
      {children}
    </div>
  );
}
