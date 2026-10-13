import { runAgent } from "../src/agent/agent";

const testCases = [
  {
    name: "Calculator test",
    input: "What is 10 multiplied by 5?",
    expectedAnswer: "50",
    expectedTools: ["calculate"],
  },

  {
    name: "Weather test",
    input: "What is the weather in London?",
    expectedAnswer: "London",
    expectedTools: ["getWeather"],
  },

  {
    name: "Time test",
    input: "What time is it in London?",
    expectedAnswer: "London",
    expectedTools: ["getTime"],
  },

  {
    name: "Multi-step test",
    input:
      "Calculate 10 multiplied by 5 and then tell me the weather in London.",
    expectedAnswer: "London",
    expectedTools: ["calculate", "getWeather"],
  },
];

async function runTest(testCase: any): Promise<boolean> {
  console.log("\n==============================");
  console.log(testCase.name);
  console.log("==============================");

  const result = await runAgent(testCase.input);

  console.log("Answer:");
  console.log(result.answer);

  console.log("Trace:");
  console.log(result.trace);

  // -------------------------
  // Check Answer
  // -------------------------

  const answerPassed = result.answer.includes(testCase.expectedAnswer);

  // -------------------------
  // Get all Tool Calls
  // -------------------------

  const toolCalls = result.trace.filter(
    (item: any) => item.type === "tool_call",
  );

  // -------------------------
  // Get Tool Names
  // -------------------------

  const actualTools = toolCalls.map((toolCall: any) => toolCall.toolName);

  console.log("Expected Tools:");
  console.log(testCase.expectedTools);

  console.log("Actual Tools:");
  console.log(actualTools);

  // -------------------------
  // Check Tools
  // -------------------------

  const toolsPassed =
    JSON.stringify(actualTools) === JSON.stringify(testCase.expectedTools);

  // -------------------------
  // Results
  // -------------------------

  if (answerPassed) {
    console.log("✅ Answer PASS");
  } else {
    console.log("❌ Answer FAIL");
  }

  if (toolsPassed) {
    console.log("✅ Tools PASS");
  } else {
    console.log("❌ Tools FAIL");
  }

  if (answerPassed && toolsPassed) {
    console.log("\n🎉 TEST PASSED");
  } else {
    console.log("\n❌ TEST FAILED");
  }

  if (answerPassed && toolsPassed) {
    console.log("\n🎉 TEST PASSED");

    return true;
  } else {
    console.log("\n❌ TEST FAILED");

    return false;
  }
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;
  for (const testCase of testCases) {
    const result = await runTest(testCase);

    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("\n==============================");
  console.log("Evaluation Summary");
  console.log("==============================");

  console.log("Passed:", passed);
  console.log("Failed:", failed);
  console.log("Total:", testCases.length);
}

runAllTests();
