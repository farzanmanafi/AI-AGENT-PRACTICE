import "dotenv/config";
import { askLLM } from "../llm/openai";

async function main() {
  console.log("Starting Groundedness Judge Evaluation...\n");

  const context = `
Python is a programming language.
Python was created by Guido van Rossum.
`;

  const answer = `
Python was created by Guido van Rossum.
Python was created on Mars in 2050.
`;

  const prompt = `
Evaluate each factual claim in the answer using only the context.

Context:
${context}

Answer:
${answer}

Return only valid JSON in this format:
{
  "claims": [
    {
      "claim": "claim text",
      "supported": true,
      "explanation": "short explanation"
    }
  ]
}

Rules:
- Extract each factual claim separately.
- supported must be true only when the context supports the claim.
- Do not use outside knowledge.
- Do not omit any factual claims.
`;

  const result = await askLLM([
    {
      role: "system",
      content:
        "You are a careful groundedness evaluator. Return valid JSON only.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  console.log("Context:");
  console.log(context);

  console.log("Answer under evaluation:");
  console.log(answer);

  console.log("Raw judge response:");
  console.log(result.answer);

  const parsed = JSON.parse(result.answer) as {
    claims: {
      claim: string;
      supported: boolean;
      explanation: string;
    }[];
  };

  if (!Array.isArray(parsed.claims)) {
    throw new Error("Invalid evaluation format: claims must be an array.");
  }

  const supportedCount = parsed.claims.filter(
    (claim) => claim.supported,
  ).length;

  const unsupportedCount = parsed.claims.filter(
    (claim) => !claim.supported,
  ).length;

  console.log("\nSummary:");
  console.log(`Total claims: ${parsed.claims.length}`);
  console.log(`Supported: ${supportedCount}`);
  console.log(`Unsupported: ${unsupportedCount}`);

  const foundSupported = parsed.claims.some(
    (claim) => claim.supported && claim.claim.includes("Guido van Rossum"),
  );

  const foundUnsupported = parsed.claims.some(
    (claim) => !claim.supported && claim.claim.includes("Mars"),
  );

  console.log(`Supported claim detected: ${foundSupported ? "PASS" : "FAIL"}`);
  console.log(
    `Unsupported claim detected: ${foundUnsupported ? "PASS" : "FAIL"}`,
  );

  if (!foundSupported || !foundUnsupported) {
    throw new Error("Groundedness judge evaluation failed.");
  }

  console.log("\nAll groundedness judge checks passed!");
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
  process.exitCode = 1;
});
