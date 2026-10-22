import { shouldUseKnowledgeBase } from "../agent/router";

const testCases = [
  {
    question: "Who created Python?",
    expected: true,
  },
  {
    question: "Explain JavaScript",
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
  console.log("Starting Router Evaluation...\n");

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const actual = shouldUseKnowledgeBase(testCase.question);
    const success = actual === testCase.expected;

    console.log(`Question: ${testCase.question}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Actual:   ${actual}`);
    console.log(`Result:   ${success ? "PASS" : "FAIL"}`);
    console.log("--------------------------------");

    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(`\nTotal: ${testCases.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    throw new Error("Router evaluation failed.");
  }

  console.log("\nAll router tests passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
