import "dotenv/config";
import { runAgent } from "../agent/agent";
import { askLLM } from "../llm/openai";

type ClaimResult = {
  claim: string;
  supported: boolean;
  explanation: string;
};

async function main() {
  console.log("Starting Automatic Groundedness Evaluation...\n");

  const question = "Who created Python?";
  const result = await runAgent(question);

  if (result.knowledge.length === 0) {
    throw new Error(
      "No knowledge was retrieved. Check ChromaDB and try again.",
    );
  }

  const context = result.knowledge.join("\n\n");

  console.log("Question:");
  console.log(question);

  console.log("\nRetrieved Knowledge:");
  console.log(context);

  console.log("\nAgent Answer:");
  console.log(result.answer);

  // Ask the LLM to evaluate each claim in the answer.
  const evaluationPrompt = `
You are a groundedness evaluator.

Compare the answer with the provided context.

Context:
${context}

Answer:
${result.answer}

Instructions:
1. Split the answer into separate factual claims.
2. For each claim, decide whether the context supports it.
3. A claim is supported only if the context provides sufficient evidence.
4. Do not use outside knowledge.
5. If the context does not support a claim, mark it unsupported.
6. Return only valid JSON. Do not use Markdown code fences.

Use this exact JSON structure:
{
  "claims": [
    {
      "claim": "A factual claim from the answer",
      "supported": true,
      "explanation": "Why the context supports or does not support it"
    }
  ]
}
`;

  const evaluation = await askLLM([
    {
      role: "system",
      content:
        "You evaluate whether factual claims are supported by a given context. Return valid JSON only.",
    },
    {
      role: "user",
      content: evaluationPrompt,
    },
  ]);

  console.log("\nRaw Evaluation:");
  console.log(evaluation.answer);

  // Parse the evaluator's JSON response.
  const parsed = JSON.parse(evaluation.answer) as {
    claims: ClaimResult[];
  };

  if (!Array.isArray(parsed.claims) || parsed.claims.length === 0) {
    throw new Error("The evaluator returned no claims.");
  }

  let unsupportedCount = 0;

  console.log("\nClaim Results:");

  for (const claim of parsed.claims) {
    const status = claim.supported ? "SUPPORTED" : "UNSUPPORTED";

    console.log(`\nClaim: ${claim.claim}`);
    console.log(`Status: ${status}`);
    console.log(`Explanation: ${claim.explanation}`);

    if (!claim.supported) {
      unsupportedCount++;
    }
  }

  console.log("\n--------------------------------");
  console.log(`Total claims: ${parsed.claims.length}`);
  console.log(`Unsupported claims: ${unsupportedCount}`);

  if (unsupportedCount > 0) {
    console.log("Warning: Some claims lack support in the retrieved context.");
  } else {
    console.log("All extracted claims were judged supported.");
  }
}

main().catch((error) => {
  console.error("Groundedness evaluation failed:", error);
  process.exitCode = 1;
});
