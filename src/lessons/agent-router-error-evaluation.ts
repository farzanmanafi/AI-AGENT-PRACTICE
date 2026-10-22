import { runAgent } from "../agent/agent";

async function main() {
  console.log("Starting Agent Router Error Evaluation...\n");

  const failingRouter = async (_question: string): Promise<boolean> => {
    throw new Error("Simulated router failure");
  };

  const result = await runAgent("Who created Python?", failingRouter);

  console.log("Agent Answer:");
  console.log(result.answer);

  console.log("\nTrace:");
  console.log(JSON.stringify(result.trace, null, 2));

  const answerCheck = result.answer.includes("Please try again");

  const traceCheck = result.trace.some(
    (event) =>
      event.type === "tool_error" &&
      event.toolName === "llmRouter" &&
      event.message?.includes("LLM router failed"),
  );

  console.log("\nEvaluation:");

  console.log("Controlled error response:", answerCheck ? "PASS" : "FAIL");

  console.log("Router error recorded in trace:", traceCheck ? "PASS" : "FAIL");

  if (!answerCheck || !traceCheck) {
    throw new Error("Agent Router Error Evaluation failed.");
  }

  console.log("\nAll Agent Router Error checks passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
