import type { NumberedProblem } from "../types";
import { DifficultyBadge } from "./DifficultyBadge";

interface QuestionCardProps {
  problem: NumberedProblem | null;
  completed: boolean;
  onToggleDone: () => void;
}

export function QuestionCard({ problem, completed, onToggleDone }: QuestionCardProps) {
  if (!problem) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-6 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-white/40">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white/70">No question yet</p>
        <p className="mt-1 text-xs text-white/40">
          Spin the wheel to get a random question for practice.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        completed
          ? "border-emerald-400/30 bg-emerald-400/[0.06]"
          : "border-brand-500/30 bg-brand-500/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400">
            Your question · #{problem.number}
          </p>
          <h3
            className={`mt-1 break-words text-base font-bold leading-snug sm:text-lg ${
              completed ? "text-white/60 line-through" : "text-white"
            }`}
          >
            {problem.title}
          </h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-sm font-extrabold tabular-nums text-white">
          {problem.number}
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="max-w-full truncate rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/60">
          {problem.category}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={problem.url}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.08] sm:text-sm"
        >
          Open on LeetCode
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
        <button
          type="button"
          onClick={onToggleDone}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition active:scale-[0.98] sm:text-sm ${
            completed
              ? "bg-emerald-500 text-ink-950 hover:bg-emerald-400"
              : "bg-white text-ink-950 hover:bg-white/90"
          }`}
        >
          {completed ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Completed · Undo
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Mark as done
            </>
          )}
        </button>
      </div>
    </div>
  );
}
