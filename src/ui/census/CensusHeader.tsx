export function CensusHeader({ lede }: { lede: string }) {
  return (
    <header className="census-head">
      <p className="census-lede">{lede}</p>
    </header>
  );
}
