import { askLLM } from "../llm/openai";

export async function shouldUseKnowledgeBaseWithLLM(
  question: string,
): Promise<boolean> {
  const result = await askLLM([
    {
      role: "system",
      content: `
You are a router for a Python programming course assistant.

Decide whether the user's question needs information from the course knowledge base.

Return only one word:
- YES: the question needs course knowledge, programming explanations, or stored lesson information.
- NO: the question is unrelated to the course knowledge base, such as simple arithmetic or weather.

Do not answer the user's question. Only classify it.
`,
    },
    {
      role: "user",
      content: question,
    },
  ]);

  const decision = result.answer.trim().toUpperCase();

  if (decision === "YES") {
    return true;
  }

  if (decision === "NO") {
    return false;
  }

  throw new Error(`Invalid router decision: ${result.answer}`);
}
