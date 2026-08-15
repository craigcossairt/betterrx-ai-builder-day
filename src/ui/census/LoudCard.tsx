import type { ReactNode } from "react";
import type { CensusLine } from "@/project/census";
import { TrackMark } from "@/ui/census/TrackMark";

export function LoudCard({
  line,
  href,
  children,
}: {
  line: CensusLine;
  href?: string;
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
      className={
        line.tone === "coral" ? "loud-card loud-card--coral" : "loud-card"
      }
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
