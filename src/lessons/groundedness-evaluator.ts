import "dotenv/config";
import { askLLM } from "../llm/openai";

type ClaimEvaluation = {
  claim: string;
  supported: boolean;
  explanation: string;
};

type GroundednessResult = {
  claims: ClaimEvaluation[];
  supportedCount: number;
  unsupportedCount: number;
  passed: boolean;
};

export async function evaluateGroundedness(
  context: string,
  answer: string,
): Promise<GroundednessResult> {
  const result = await askLLM([
    {
      role: "system",
      content:
        "You are a careful groundedness evaluator. Return valid JSON only.",
    },
    {
      role: "user",
      content: `
Evaluate every factual claim in the answer using ONLY the context.

Context:
${context}

Answer:
${answer}

Return JSON in this exact format:
{
  "claims": [
    {
      "claim": "the factual claim",
      "supported": true,
      "explanation": "short reason"
    }
  ]
}

Rules:
- Split the answer into individual factual claims.
- supported must be true only if the context supports the claim.
- If the context does not support a claim, set supported to false.
- Do not use outside knowledge.
- Do not omit factual claims.
- Return valid JSON only, without Markdown fences.
`,
    },
  ]);

  const parsed = JSON.parse(result.answer) as {
    claims: ClaimEvaluation[];
  };

  if (!Array.isArray(parsed.claims)) {
    throw new Error("Invalid judge response: claims must be an array.");
  }

  const supportedCount = parsed.claims.filter(
    (claim) => claim.supported === true,
  ).length;

  const unsupportedCount = parsed.claims.filter(
    (claim) => claim.supported === false,
  ).length;

  return {
    claims: parsed.claims,
    supportedCount,
    unsupportedCount,
    passed: unsupportedCount === 0,
  };
}
