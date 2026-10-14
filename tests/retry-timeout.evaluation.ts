import { retry, withTimeout } from "../src/llm/retry";

let attempts = 0;

async function slowOperation(): Promise<string> {
  attempts++;

  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return "Success";
}

async function main() {
  console.log("Starting Retry + Timeout Evaluation...");

  try {
    const result = await retry(
      () => withTimeout(() => slowOperation(), 500),
      3,
    );

    console.log("❌ TEST FAILED");
    console.log("Result:", result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.log("Attempts:", attempts);
    console.log("Expected error:", message);

    if (attempts === 3 && message === "Tool timeout") {
      console.log("✅ RETRY + TIMEOUT TEST PASSED");
    } else {
      console.log("❌ RETRY + TIMEOUT TEST FAILED");
    }
  }
}

main();
