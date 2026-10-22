import { safeShouldUseKnowledgeBase } from "../agent/safe-llm-router";

async function main() {
  console.log("Starting LLM Router Error Evaluation...\n");

  const failingRouter = async (_question: string): Promise<boolean> => {
    throw new Error("Simulated router failure");
  };

  let errorCaught = false;
  let errorMessage = "";

  try {
    await safeShouldUseKnowledgeBase("Who created Python?", failingRouter);
  } catch (error) {
    errorCaught = true;

    errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.log("Router error caught!");
    console.log("Error message:", errorMessage);
  }

  console.log("\nEvaluation:");

  const caughtCheck = errorCaught;

  const messageCheck = errorMessage.includes("LLM router failed");

  console.log("Error caught:", caughtCheck ? "PASS" : "FAIL");

  console.log(
    "Error message contains 'LLM router failed':",
    messageCheck ? "PASS" : "FAIL",
  );

  if (!caughtCheck || !messageCheck) {
    throw new Error("LLM Router error evaluation failed.");
  }

  console.log("\nAll LLM Router error checks passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
