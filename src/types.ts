export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  url: string;
}

export interface NumberedProblem extends Problem {
  number: number;
}

export type SetId = "blind75" | "neetcode150" | "neetcode250";

export interface ProblemSet {
  id: SetId;
  label: string;
  shortLabel: string;
  problems: Problem[];
}
