import "dotenv/config";
import { evaluateGroundedness } from "./groundedness-evaluator";

async function main() {
  console.log("Starting Groundedness Evaluator Test...\n");

  const context = `
Python is a programming language.
Python was created by Guido van Rossum.
`;

  const answer = `
Python was created by Guido van Rossum.
Python was created on Mars in 2050.
`;

  const result = await evaluateGroundedness(context, answer);

  console.log("Claims:");
  console.log(JSON.stringify(result.claims, null, 2));

  console.log("\nSummary:");
  console.log(`Supported: ${result.supportedCount}`);
  console.log(`Unsupported: ${result.unsupportedCount}`);
  console.log(`Passed: ${result.passed}`);

  const foundSupported = result.claims.some(
    (claim) => claim.supported && claim.claim.toLowerCase().includes("guido"),
  );

  const foundUnsupported = result.claims.some(
    (claim) => !claim.supported && claim.claim.toLowerCase().includes("mars"),
  );

  if (!foundSupported || !foundUnsupported) {
    throw new Error("Groundedness evaluator test failed.");
  }

  if (result.passed !== false) {
    throw new Error("Expected passed=false because one claim is unsupported.");
  }

  console.log("\nAll groundedness evaluator tests passed!");
}

main().catch((error) => {
  console.error("Test failed:", error);
  process.exitCode = 1;
});
