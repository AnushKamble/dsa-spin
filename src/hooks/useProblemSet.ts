import { useCallback, useEffect, useMemo } from "react";
import type { NumberedProblem, Problem, SetId } from "../types";
import { PROBLEM_SETS } from "../lib/sets";
import { seededShuffle } from "../lib/random";
import { useLocalStorage } from "./useLocalStorage";

type NumberingMap = Record<string, string[]>;
type SelectedMap = Record<string, string | null>;

function normalizeOrder(
  stored: string[] | undefined,
  problems: Problem[],
  setId: SetId,
): string[] {
  const ids = problems.map((p) => p.id);
  const validIds = new Set(ids);

  if (!stored) return seededShuffle(ids, setId);

  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of stored) {
    if (validIds.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  const missing = ids.filter((id) => !seen.has(id));
  if (missing.length > 0) {
    result.push(...seededShuffle(missing, `${setId}:missing`));
  }
  return result;
}

export function useProblemSet(setId: SetId) {
  const [numberingMap, setNumberingMap] = useLocalStorage<NumberingMap>(
    "dsa-spinner:numbering:v1",
    {},
  );
  const [completedList, setCompletedList] = useLocalStorage<string[]>(
    "dsa-spinner:completed:v2",
    [],
  );
  const [selectedMap, setSelectedMap] = useLocalStorage<SelectedMap>(
    "dsa-spinner:selected:v1",
    {},
  );

  const problems = PROBLEM_SETS[setId].problems;

  const order = useMemo(
    () => normalizeOrder(numberingMap[setId], problems, setId),
    [numberingMap, problems, setId],
  );

  useEffect(() => {
    const stored = numberingMap[setId];
    if (!stored || stored.length !== order.length || stored.some((id, i) => id !== order[i])) {
      setNumberingMap((prev) => ({ ...prev, [setId]: order }));
    }
  }, [numberingMap, order, setId, setNumberingMap]);

  const byId = useMemo(() => {
    const map = new Map<string, Problem>();
    for (const p of problems) map.set(p.id, p);
    return map;
  }, [problems]);

  const numbered = useMemo<NumberedProblem[]>(() => {
    return order.flatMap((id, index) => {
      const problem = byId.get(id);
      return problem ? [{ ...problem, number: index + 1 }] : [];
    });
  }, [order, byId]);

  const completedIds = useMemo(
    () => new Set(completedList),
    [completedList],
  );

  const rawSelected = selectedMap[setId] ?? null;
  const selectedId = rawSelected && byId.has(rawSelected) ? rawSelected : null;

  const markDone = useCallback(
    (id: string, done: boolean) => {
      setCompletedList((prev) => {
        const set = new Set(prev);
        if (done) set.add(id);
        else set.delete(id);
        return [...set];
      });
    },
    [setCompletedList],
  );

  const setSelected = useCallback(
    (id: string | null) => {
      setSelectedMap((prev) => ({ ...prev, [setId]: id }));
    },
    [setSelectedMap, setId],
  );

  const resetProgress = useCallback(() => {
    const idsInSet = new Set(PROBLEM_SETS[setId].problems.map((p) => p.id));
    setCompletedList((prev) => prev.filter((id) => !idsInSet.has(id)));
    setSelectedMap((prev) => ({ ...prev, [setId]: null }));
  }, [setCompletedList, setSelectedMap, setId]);

  const completedCount = numbered.reduce(
    (count, p) => (completedIds.has(p.id) ? count + 1 : count),
    0,
  );

  return {
    setId,
    problems: numbered,
    completedIds,
    completedCount,
    total: numbered.length,
    selectedId,
    setSelected,
    markDone,
    resetProgress,
  };
}
