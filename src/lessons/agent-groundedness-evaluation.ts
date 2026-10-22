import "dotenv/config";
import { runAgent } from "../agent/agent";
import { evaluateGroundedness } from "./groundedness-evaluator";

async function main() {
  console.log("Starting Agent Groundedness Evaluation...\n");

  const question = "Who created Python?";

  // Step 1: Ask the real agent
  const agentResult = await runAgent(question);

  console.log("Question:");
  console.log(question);

  console.log("\nRetrieved Knowledge:");
  console.log(agentResult.knowledge);

  console.log("\nAgent Answer:");
  console.log(agentResult.answer);

  // Step 2: Check whether knowledge was retrieved
  if (agentResult.knowledge.length === 0) {
    throw new Error(
      "Cannot evaluate groundedness: no knowledge was retrieved.",
    );
  }

  // Step 3: Build context from retrieved knowledge
  const context = agentResult.knowledge.join("\n\n");

  // Step 4: Evaluate the real agent answer
  const evaluation = await evaluateGroundedness(context, agentResult.answer);

  console.log("\nGroundedness Evaluation:");
  console.log(JSON.stringify(evaluation.claims, null, 2));

  console.log("\nSummary:");
  console.log(`Supported: ${evaluation.supportedCount}`);
  console.log(`Unsupported: ${evaluation.unsupportedCount}`);
  console.log(`Passed: ${evaluation.passed}`);

  // Step 5: Verify the expected claim
  const hasSupportedCreatorClaim = evaluation.claims.some(
    (claim) => claim.supported && claim.claim.toLowerCase().includes("guido"),
  );

  if (!hasSupportedCreatorClaim) {
    throw new Error(
      "The evaluator did not identify the supported creator claim.",
    );
  }

  if (!evaluation.passed) {
    throw new Error("Agent answer contains unsupported claims.");
  }

  console.log("\nAgent groundedness evaluation passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
