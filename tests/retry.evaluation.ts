import { retry } from "../src/llm/retry";

let attempts = 0;

async function testRetry() {
  console.log("Starting Retry Evaluation...");

  try {
    await retry(async () => {
      attempts++;

      console.log(`Attempt ${attempts}`);

      throw new Error("Test tool failed");
    }, 3);
  } catch (error) {
    console.log("Final Error:");

    console.log(error instanceof Error ? error.message : "Unknown error");
  }

  console.log("Expected attempts: 3");
  console.log("Actual attempts:", attempts);

  if (attempts === 3) {
    console.log("✅ RETRY TEST PASSED");
  } else {
    console.log("❌ RETRY TEST FAILED");
  }
}

testRetry();
