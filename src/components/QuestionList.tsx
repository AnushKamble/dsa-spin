import type { NumberedProblem, SetId } from "../types";
import { PROBLEM_SETS } from "../lib/sets";
import { DifficultyBadge } from "./DifficultyBadge";

interface QuestionListProps {
  setId: SetId;
  problems: NumberedProblem[];
  completedIds: Set<string>;
  selectedId: string | null;
  completedCount: number;
  total: number;
}

export function QuestionList({
  setId,
  problems,
  completedIds,
  selectedId,
  completedCount,
  total,
}: QuestionListProps) {
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white sm:text-base">
              {PROBLEM_SETS[setId].label} · All questions
            </h2>
            <p className="text-[11px] text-white/45">
              Randomly numbered — order stays fixed between visits
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm font-bold text-white">
              {completedCount}
              <span className="text-white/40"> / {total}</span>
            </span>
            <p className="text-[11px] text-white/45">completed</p>
          </div>
        </div>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-white/[0.06] overflow-y-auto lg:max-h-[calc(100vh-13.5rem)]">
        {problems.map((p) => {
          const done = completedIds.has(p.id);
          const isSelected = p.id === selectedId;
          return (
            <li
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2.5 transition sm:px-5 ${
                isSelected ? "bg-brand-500/[0.12]" : "hover:bg-white/[0.03]"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
                  done
                    ? "bg-emerald-400/15 text-emerald-300"
                    : isSelected
                      ? "bg-brand-500 text-white"
                      : "bg-white/[0.06] text-white/55"
                }`}
              >
                {p.number}
              </span>

              <div className="min-w-0 flex-1">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`block truncate text-sm font-medium transition hover:text-brand-400 ${
                    done ? "text-white/40 line-through" : "text-white/90"
                  }`}
                  title={p.title}
                >
                  {p.title}
                </a>
                <span className="block truncate text-[11px] text-white/35">
                  {p.category}
                </span>
              </div>

              <DifficultyBadge difficulty={p.difficulty} className="shrink-0" />

              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-300"
                    : "border-white/15 text-transparent"
                }`}
                aria-label={done ? "Completed" : "Not completed"}
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
