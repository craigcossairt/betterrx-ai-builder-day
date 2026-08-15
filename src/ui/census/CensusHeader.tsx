export function CensusHeader({ lede, href }: { lede: string; href?: string }) {
  return (
    <header className="census-head">
      {href ? (
        <a className="census-lede census-lede-link" href={href}>
          {lede}
        </a>
      ) : (
        <p className="census-lede">{lede}</p>
      )}
    </header>
  );
}
