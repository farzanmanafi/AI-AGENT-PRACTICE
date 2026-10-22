import "dotenv/config";
import { shouldUseKnowledgeBase } from "../agent/router";
import { shouldUseKnowledgeBaseWithLLM } from "../agent/llm-router";

const questions = [
  "Who created Python?",
  "Explain how Python lists work.",
  "What is 100 + 50?",
  "What is the weather today?",
  "How can I store data in a dictionary?",
  "Explain the difference between a list and a tuple.",
];

async function main() {
  console.log("Starting Router Comparison...\n");

  for (const question of questions) {
    const oldDecision = shouldUseKnowledgeBase(question);
    const newDecision = await shouldUseKnowledgeBaseWithLLM(question);

    console.log(`Question: ${question}`);
    console.log(`Keyword Router: ${oldDecision}`);
    console.log(`LLM Router:     ${newDecision}`);
    console.log("--------------------------------");
  }

  console.log("\nRouter comparison completed.");
}

main().catch((error) => {
  console.error("Comparison failed:", error);
  process.exitCode = 1;
});
