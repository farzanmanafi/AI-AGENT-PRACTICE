import { withTimeout } from "../src/llm/retry";
async function testTimeout() {
  console.log("Starting Timeout Evaluation...");

  try {
    await withTimeout(
      () =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve("Tool finished");
          }, 3000);
        }),
      1000,
    );

    console.log("❌ TEST FAILED");
    console.log("Expected a timeout, but the tool succeeded.");
  } catch (error) {
    if (error instanceof Error && error.message === "Tool timeout") {
      console.log("Expected error: Tool timeout");
      console.log("✅ TIMEOUT TEST PASSED");
    } else {
      console.log("❌ TEST FAILED");
      console.log(error);
    }
  }
}

async function testFastTool() {
  console.log("\nStarting Fast Tool Evaluation...");

  try {
    const result = await withTimeout(() => Promise.resolve("Success"), 1000);

    console.log("Result:", result);

    if (result === "Success") {
      console.log("✅ FAST TOOL TEST PASSED");
    } else {
      console.log("❌ FAST TOOL TEST FAILED");
    }
  } catch (error) {
    console.log("❌ FAST TOOL TEST FAILED");
    console.log(error);
  }
}

async function runTests() {
  await testTimeout();
  await testFastTool();
}

runTests();
