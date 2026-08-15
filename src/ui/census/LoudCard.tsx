import type { ReactNode } from "react";
import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function LoudCard({
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
  const body = (
    <>
      <div className="loud-card-top">
        <b className="loud-card-who">{line.who}</b>
        <TrackMark label={line.trackLabel} />
      </div>
      <p className="loud-card-sentence">{line.sentence}</p>
      {line.aside ? <p className="loud-card-aside">{line.aside}</p> : null}
    </>
  );
  return (
    <article
      className={[
        "loud-card",
        line.tone === "coral" ? "loud-card--coral" : "",
        selected ? "loud-card--on" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {href ? (
        <a className="loud-card-link" href={href}>
          {body}
        </a>
      ) : (
        body
      )}
      {children}
    </article>
  );
}
