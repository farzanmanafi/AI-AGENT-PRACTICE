import "dotenv/config";
import { shouldUseKnowledgeBaseWithLLM } from "../agent/llm-router";

const testCases = [
  {
    question: "Who created Python?",
    expected: true,
  },
  {
    question: "Explain how Python lists work.",
    expected: true,
  },
  {
    question: "What is 100 + 50?",
    expected: false,
  },
  {
    question: "What is the weather today?",
    expected: false,
  },
];

async function main() {
  console.log("Starting LLM Router Evaluation...\n");

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`Question: ${testCase.question}`);

    try {
      const actual = await shouldUseKnowledgeBaseWithLLM(testCase.question);

      const success = actual === testCase.expected;

      console.log(`Expected: ${testCase.expected}`);
      console.log(`Actual:   ${actual}`);
      console.log(`Result:   ${success ? "PASS" : "FAIL"}`);

      if (success) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
      console.log(
        "Result: FAIL",
        error instanceof Error ? error.message : error,
      );
    }

    console.log("--------------------------------");
  }

  console.log(`\nTotal: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    throw new Error("LLM Router evaluation failed.");
  }

  console.log("\nAll LLM router tests passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
