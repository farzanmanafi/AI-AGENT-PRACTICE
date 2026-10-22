import "dotenv/config";
import { runAgent } from "../agent/agent";

type Claim = {
  text: string;
  expected: "supported" | "unsupported";
};

async function main() {
  console.log("Starting Claim-Level Groundedness Evaluation...\n");

  const question = "Who created Python?";
  const result = await runAgent(question);

  if (result.knowledge.length === 0) {
    throw new Error(
      "No knowledge was retrieved. Check ChromaDB and try again.",
    );
  }

  console.log("Retrieved Knowledge:");
  console.log(result.knowledge.join("\n"));

  console.log("\nAgent Answer:");
  console.log(result.answer);

  // Two example claims to evaluate against the retrieved knowledge.
  const claims: Claim[] = [
    {
      text: "Python was created by Guido van Rossum.",
      expected: "supported",
    },
    {
      text: "Python was released in 1991.",
      expected: "unsupported",
    },
  ];

  let failedTests = 0;

  console.log("\nClaim Evaluation:");

  for (const claim of claims) {
    // Simple exact-text check, ignoring uppercase/lowercase.
    const supported = result.knowledge.some((chunk) =>
      chunk.toLowerCase().includes(claim.text.toLowerCase()),
    );

    const actual = supported ? "supported" : "unsupported";
    const passed = actual === claim.expected;

    console.log(`\nClaim: ${claim.text}`);
    console.log(`Expected: ${claim.expected}`);
    console.log(`Actual:   ${actual}`);
    console.log(`Result:   ${passed ? "PASS" : "FAIL"}`);

    if (!passed) {
      failedTests++;
    }
  }

  console.log("\n--------------------------------");
  console.log(`Total claims: ${claims.length}`);
  console.log(`Failed tests: ${failedTests}`);

  if (failedTests > 0) {
    throw new Error(`${failedTests} claim evaluation test(s) failed`);
  }

  console.log("All claim evaluation tests passed!");
}

main().catch((error) => {
  console.error("Claim evaluation failed:", error);
  process.exitCode = 1;
});
