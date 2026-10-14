import { addToolError, type TraceEvent } from "../src/llm/trace";

const trace: TraceEvent[] = [];

// Record the tool call
trace.push({
  type: "tool_call",
  toolName: "failingTool",
  arguments: "{}",
});

// Record the tool error
addToolError(trace, "failingTool", "Test tool failed");

console.log("Trace:", trace);

const hasToolCall = trace.some((event) => event.type === "tool_call");

const hasToolError = trace.some(
  (event) =>
    event.type === "tool_error" &&
    event.toolName === "failingTool" &&
    event.message === "Test tool failed",
);

if (hasToolCall && hasToolError && trace.length === 2) {
  console.log("✅ TEST PASSED");
} else {
  console.log("❌ TEST FAILED");
}
