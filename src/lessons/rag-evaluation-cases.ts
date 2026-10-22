export type RagExpectedBehavior =
  | "knowledge_found"
  | "knowledge_not_found"
  | "no_rag"
  | "rag_error";

export type RagEvaluationCase = {
  name: string;
  question: string;
  expected: RagExpectedBehavior;
  expectedAnswer?: string;
};
export const ragEvaluationCases: RagEvaluationCase[] = [
  {
    name: "Python creator",
    question: "Who created Python?",
    expected: "knowledge_found",
    expectedAnswer: "Guido van Rossum",
  },
  {
    name: "Unknown knowledge",
    question: "Who created JavaScript?",
    expected: "knowledge_not_found",
  },
  {
    name: "Python usage",
    question: "What is Python used for?",
    expected: "knowledge_found",
    expectedAnswer: "web development",
  },
  {
    name: "Normal calculation",
    question: "What is 100 + 50?",
    expected: "no_rag",
  },
];
