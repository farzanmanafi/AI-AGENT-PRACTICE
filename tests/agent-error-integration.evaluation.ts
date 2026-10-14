import { runAgent } from "../src/agent/agent";

async function main() {
  console.log("Starting Agent error integration test...");

  const result = await runAgent(
    'Use the "failingTool" tool. If it fails, explain the error to me.',
  );

  console.log("\nFinal answer:");
  console.log(result.answer);

  console.log("\nTrace:");
  console.log(result.trace);

  const toolCalls = result.trace.filter(
    (event) => event.type === "tool_call" && event.toolName === "failingTool",
  );

  const toolErrors = result.trace.filter(
    (event) => event.type === "tool_error" && event.toolName === "failingTool",
  );

  if (toolCalls.length > 0 && toolErrors.length > 0) {
    console.log("\n✅ TEST PASSED");
    console.log("Agent called failingTool and recorded its error.");
  } else {
    console.log("\n❌ TEST FAILED");
    console.log("Expected tool call and tool error were not both found.");
  }
}

main().catch((error) => {
  console.error("Test crashed:", error);
});
