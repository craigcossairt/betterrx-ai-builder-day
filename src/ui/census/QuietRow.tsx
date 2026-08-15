import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function QuietRow({
  line,
  href,
}: {
  line: CensusLine;
  href?: string;
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
  if (href) {
    return (
      <a className="quiet-row" href={href}>
        {inner}
      </a>
    );
  }
  return <div className="quiet-row">{inner}</div>;
}
