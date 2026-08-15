import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function QuietRow({ line }: { line: CensusLine }) {
  return (
    <div className="quiet-row">
      <div>
        <b className="quiet-row-who">{line.who}</b>
        <div className="quiet-row-sentence">{line.sentence}</div>
      </div>
      <TrackMark label={line.trackLabel} />
    </div>
  );
}
