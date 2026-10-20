import { shouldUseKnowledgeBase } from "../agent/router";

const questions = [
  "Who created Python?",
  "What is TypeScript?",
  "What is 20 + 30?",
];

for (const question of questions) {
  console.log(question, "=>", shouldUseKnowledgeBase(question));
}
