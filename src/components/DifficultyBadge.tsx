import type { Difficulty } from "../types";

const STYLES: Record<Difficulty, string> = {
  Easy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Medium: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Hard: "border-rose-400/30 bg-rose-400/10 text-rose-300",
};

export function DifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STYLES[difficulty]} ${className}`}
    >
      {difficulty}
    </span>
  );
}
