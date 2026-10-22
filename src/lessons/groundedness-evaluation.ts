import "dotenv/config";
import { runAgent } from "../agent/agent";

async function main() {
  console.log("Starting Groundedness Evaluation...\n");

  const question = "Who created Python?";

  const result = await runAgent(question);

  console.log("Question:");
  console.log(question);

  console.log("\nRetrieved Knowledge:");
  console.log(result.knowledge);

  console.log("\nAgent Answer:");
  console.log(result.answer);

  console.log("\nTrace:");
  console.log(JSON.stringify(result.trace, null, 2));

  // Check whether retrieved knowledge exists.
  const hasKnowledge = result.knowledge.length > 0;

  // Check whether the answer is supported by the retrieved knowledge.
  const answerIsGrounded = result.knowledge.some((chunk) =>
    chunk.toLowerCase().includes(result.answer.toLowerCase()),
  );

  console.log("\nEvaluation:");
  console.log(`Knowledge found: ${hasKnowledge ? "PASS" : "FAIL"}`);
  console.log(`Answer grounded: ${answerIsGrounded ? "PASS" : "FAIL"}`);
}

main().catch((error) => {
  console.error("Groundedness evaluation failed:", error);
  process.exitCode = 1;
});
