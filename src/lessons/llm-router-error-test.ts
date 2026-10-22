import { safeShouldUseKnowledgeBase } from "../agent/safe-llm-router";

async function main() {
  console.log("Starting LLM Router Error Test...\n");

  try {
    const result = await safeShouldUseKnowledgeBase("Who created Python?");

    console.log("Router result:", result);
    console.log("\nRouter completed successfully.");
  } catch (error) {
    console.log("Router error caught!");

    console.log(
      "Error message:",
      error instanceof Error ? error.message : error,
    );
  }
}

main().catch((error) => {
  console.error("Test failed:", error);
  process.exitCode = 1;
});
