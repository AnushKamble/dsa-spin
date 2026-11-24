import type { ProblemSet, SetId } from "../types";
import { BLIND_75 } from "../data/blind75";
import { NEETCODE_150 } from "../data/neetcode150";
import { NEETCODE_250 } from "../data/neetcode250";

export const PROBLEM_SETS: Record<SetId, ProblemSet> = {
  blind75: {
    id: "blind75",
    label: "Blind 75",
    shortLabel: "Blind 75",
    problems: BLIND_75,
  },
  neetcode150: {
    id: "neetcode150",
    label: "NeetCode 150",
    shortLabel: "NC 150",
    problems: NEETCODE_150,
  },
  neetcode250: {
    id: "neetcode250",
    label: "NeetCode 250",
    shortLabel: "NC 250",
    problems: NEETCODE_250,
  },
};

export const SET_ORDER: SetId[] = ["blind75", "neetcode150", "neetcode250"];
