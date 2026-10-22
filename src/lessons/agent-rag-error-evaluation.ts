import "dotenv/config";
import { runAgent } from "../agent/agent";

async function main() {
  console.log("Starting Agent RAG Error Evaluation...");

  const result = await runAgent("Who created Python?");

  console.log("\nAnswer:");
  console.log(result.answer);

  console.log("\nTrace:");
  console.log(JSON.stringify(result.trace, null, 2));

  const hasSearchCall = result.trace.some(
    (event) =>
      event.type === "tool_call" && event.toolName === "searchKnowledge",
  );

  const hasSearchError = result.trace.some(
    (event) =>
      event.type === "tool_error" && event.toolName === "searchKnowledge",
  );

  const correctAnswer =
    result.answer === "Knowledge search failed. Please try again.";

  console.log("\nAssertions:");
  console.log("Search call recorded:", hasSearchCall);
  console.log("Search error recorded:", hasSearchError);
  console.log("Expected error answer returned:", correctAnswer);

  if (!hasSearchCall || !hasSearchError || !correctAnswer) {
    throw new Error("Agent RAG error evaluation failed");
  }

  console.log("\nAll RAG error checks passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
