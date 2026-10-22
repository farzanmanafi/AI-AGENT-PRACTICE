import "dotenv/config";
import { runAgent } from "../agent/agent";
import { ragEvaluationCases } from "./rag-evaluation-cases";

async function main() {
  console.log("Starting RAG Evaluation...\n");

  let failedTests = 0;

  for (const testCase of ragEvaluationCases) {
    console.log("--------------------------------");
    console.log(`Test: ${testCase.name}`);
    console.log(`Question: ${testCase.question}`);

    const result = await runAgent(testCase.question);

    // Check whether the agent called the knowledge search tool.
    const hasSearchCall = result.trace.some(
      (event) =>
        event.type === "tool_call" && event.toolName === "searchKnowledge",
    );

    // Check whether the knowledge search tool failed.
    const hasSearchError = result.trace.some(
      (event) =>
        event.type === "tool_error" && event.toolName === "searchKnowledge",
    );

    // Determine the actual behavior.
    let actual: string;

    if (hasSearchError) {
      actual = "rag_error";
    } else if (hasSearchCall) {
      if (result.answer === "I don't know based on the provided information.") {
        actual = "knowledge_not_found";
      } else {
        actual = "knowledge_found";
      }
    } else {
      actual = "no_rag";
    }

    // Check whether the agent followed the expected behavior.
    const behaviorCheck = actual === testCase.expected;

    // Check whether the answer contains the expected text.
    const answerCheck =
      !testCase.expectedAnswer ||
      result.answer
        .toLowerCase()
        .includes(testCase.expectedAnswer.toLowerCase());

    const finalPassed = behaviorCheck && answerCheck;

    console.log(`Expected: ${testCase.expected}`);
    console.log(`Actual:   ${actual}`);
    console.log(`Answer:   ${result.answer}`);
    console.log(`Behavior check: ${behaviorCheck ? "PASS" : "FAIL"}`);
    console.log(`Answer check:   ${answerCheck ? "PASS" : "FAIL"}`);
    console.log(`Result:         ${finalPassed ? "PASS" : "FAIL"}`);

    if (!finalPassed) {
      failedTests++;
    }
  }

  console.log("\n--------------------------------");
  console.log("Evaluation finished.");
  console.log(`Total tests: ${ragEvaluationCases.length}`);
  console.log(`Failed tests: ${failedTests}`);
  console.log(`Passed tests: ${ragEvaluationCases.length - failedTests}`);

  if (failedTests > 0) {
    throw new Error(`${failedTests} evaluation test(s) failed`);
  }

  console.log("All RAG evaluation tests passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
