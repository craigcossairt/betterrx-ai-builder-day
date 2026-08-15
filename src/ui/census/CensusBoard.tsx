import type { CensusLine } from "@/project/census";
import { LoudActions } from "@/ui/census/LoudActions";
import { LoudCard } from "@/ui/census/LoudCard";
import { QuietRow } from "@/ui/census/QuietRow";
import type { RoleId } from "@/ui/roles";

export function CensusBoard({
  lines,
  role,
}: {
  lines: readonly CensusLine[];
  role: RoleId;
}) {
  const loud = lines.filter((line) => line.kind === "loud");
  const quiet = lines.filter((line) => line.kind === "quiet");
  return (
    <section className="census-board" aria-label="Patient census">
      <div className="loud-stack">
        {loud.map((line) => (
          <LoudCard key={line.order.id} line={line}>
            <LoudActions order={line.order} role={role} />
          </LoudCard>
        ))}
      </div>
      <div className="quiet-list">
        {quiet.map((line) => (
          <QuietRow key={line.order.id} line={line} />
        ))}
      </div>
    </section>
  );
}
