import { useEffect, useMemo } from "react";
import type { SetId } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useProblemSet } from "./hooks/useProblemSet";
import { Navbar } from "./components/Navbar";
import { Wheel } from "./components/Wheel";
import { QuestionList } from "./components/QuestionList";
import { QuestionCard } from "./components/QuestionCard";
import { PROBLEM_SETS } from "./lib/sets";
import { playComplete, setSoundEnabled } from "./lib/sounds";

export default function App() {
  const [setId, setSetId] = useLocalStorage<SetId>("dsa-spinner:set:v1", "blind75");
  const [soundOn, setSoundOn] = useLocalStorage<boolean>(
    "dsa-spinner:sound:v1",
    true,
  );
  const activeSet = PROBLEM_SETS[setId] ?? PROBLEM_SETS.blind75;

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const {
    problems,
    completedIds,
    completedCount,
    total,
    selectedId,
    setSelected,
    markDone,
    resetProgress,
  } = useProblemSet(activeSet.id);

  const selectedProblem = useMemo(
    () => problems.find((p) => p.id === selectedId) ?? null,
    [problems, selectedId],
  );

  const remaining = useMemo(
    () => problems.filter((p) => !completedIds.has(p.id)),
    [problems, completedIds],
  );

  const handleResult = (problem: (typeof problems)[number]) => {
    setSelected(problem.id);
  };

  const handleToggleDone = () => {
    if (!selectedProblem) return;
    const willComplete = !completedIds.has(selectedProblem.id);
    markDone(selectedProblem.id, willComplete);
    if (willComplete) playComplete();
  };

  return (
    <div className="min-h-screen">
      <Navbar
        setId={activeSet.id}
        onChange={setSetId}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((prev) => !prev)}
      />

      <main className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-6">
          <div className="order-2 min-w-0 lg:order-1">
            <QuestionList
              setId={activeSet.id}
              problems={problems}
              completedIds={completedIds}
              selectedId={selectedId}
              completedCount={completedCount}
              total={total}
            />
          </div>

          <aside className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-[5.25rem] lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 lg:max-h-[calc(100vh-6.75rem)] lg:overflow-y-auto lg:overscroll-contain">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-white sm:text-base">
                    Random wheel
                  </h2>
                  <p className="truncate text-[11px] text-white/45">
                    {activeSet.label} · {remaining.length} of{" "}
                    {activeSet.problems.length} left
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetProgress}
                  disabled={completedCount === 0 && !selectedId}
                  className="shrink-0 cursor-pointer rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white/55 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reset progress
                </button>
              </div>

              <Wheel
                key={activeSet.id}
                problems={remaining}
                onResult={handleResult}
              />

              <div className="mt-4">
                <QuestionCard
                  problem={selectedProblem}
                  completed={
                    selectedProblem ? completedIds.has(selectedProblem.id) : false
                  }
                  onToggleDone={handleToggleDone}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
