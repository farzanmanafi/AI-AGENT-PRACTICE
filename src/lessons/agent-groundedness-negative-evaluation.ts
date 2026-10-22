import "dotenv/config";
import { evaluateGroundedness } from "./groundedness-evaluator";

async function main() {
  console.log("Starting Negative Groundedness Evaluation...\n");

  const context = `
Python is a programming language.
Python was created by Guido van Rossum.
`;

  // This answer contains one unsupported claim.
  const answer = `
Python was created by Guido van Rossum.
Python was created on Mars in 2050.
`;

  const result = await evaluateGroundedness(context, answer);

  console.log("Answer:");
  console.log(answer);

  console.log("\nEvaluation:");
  console.log(JSON.stringify(result.claims, null, 2));

  console.log("\nSummary:");
  console.log(`Supported: ${result.supportedCount}`);
  console.log(`Unsupported: ${result.unsupportedCount}`);
  console.log(`Passed: ${result.passed}`);

  const foundUnsupportedMarsClaim = result.claims.some(
    (claim) =>
      claim.supported === false && claim.claim.toLowerCase().includes("mars"),
  );

  if (!foundUnsupportedMarsClaim) {
    throw new Error("Unsupported Mars claim was not detected.");
  }

  if (result.passed !== false) {
    throw new Error("Expected the evaluation to fail.");
  }

  console.log("\nNegative groundedness evaluation passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
