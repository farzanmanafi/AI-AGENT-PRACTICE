import { shouldUseKnowledgeBaseWithLLM } from "./llm-router";

type Router = (question: string) => Promise<boolean>;

export async function safeShouldUseKnowledgeBase(
  question: string,
  router: Router = shouldUseKnowledgeBaseWithLLM,
): Promise<boolean> {
  try {
    return await router(question);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown router error";

    throw new Error(`LLM router failed: ${message}`);
  }
}
