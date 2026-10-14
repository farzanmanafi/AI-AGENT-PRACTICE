import { executeTool } from "../src/executor/toolExecutor";
import { retry, withTimeout } from "../src/llm/retry";

async function main() {
  let attempts = 0;

  try {
    const result = await retry(() => {
      attempts++;

      return withTimeout(async () => executeTool("failingTool", "{}"), 1000);
    }, 3);

    console.log("❌ TEST FAILED: Expected an error");
    console.log(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.log("Attempts:", attempts);
    console.log("Error message:", message);

    if (attempts === 3 && message === "Test tool failed") {
      console.log("✅ TEST PASSED");
    } else {
      console.log("❌ TEST FAILED");
    }
  }
}

main();
