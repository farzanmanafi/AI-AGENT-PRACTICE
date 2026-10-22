import "dotenv/config";
import { evaluateGroundedness } from "./groundedness-evaluator";

type TestCase = {
  name: string;
  context: string;
  answer: string;
  expectedUnsupported: number;
};

const testCases: TestCase[] = [
  {
    name: "All claims supported",
    context: "Python was created by Guido van Rossum.",
    answer: "Python was created by Guido van Rossum.",
    expectedUnsupported: 0,
  },
  {
    name: "One unsupported claim",
    context: "Python was created by Guido van Rossum.",
    answer:
      "Python was created by Guido van Rossum. Python was created on Mars in 2050.",
    expectedUnsupported: 1,
  },
  {
    name: "No supporting information",
    context: "Python is a programming language.",
    answer: "Python was created by Guido van Rossum.",
    expectedUnsupported: 1,
  },
];

async function main() {
  console.log("Starting Groundedness Scenarios Evaluation...\n");

  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    console.log("--------------------------------");
    console.log(`Test: ${testCase.name}`);

    try {
      const result = await evaluateGroundedness(
        testCase.context,
        testCase.answer,
      );

      const passed = result.unsupportedCount === testCase.expectedUnsupported;

      console.log(`Expected unsupported: ${testCase.expectedUnsupported}`);
      console.log(`Actual unsupported:   ${result.unsupportedCount}`);
      console.log(`Result: ${passed ? "PASS" : "FAIL"}`);

      if (passed) {
        passedTests++;
      } else {
        failedTests++;
      }
    } catch (error) {
      failedTests++;
      console.log(
        "Result: FAIL",
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.log("\n--------------------------------");
  console.log(`Total tests: ${testCases.length}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests > 0) {
    throw new Error("Groundedness scenario evaluation failed.");
  }

  console.log("\nAll groundedness scenario tests passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
