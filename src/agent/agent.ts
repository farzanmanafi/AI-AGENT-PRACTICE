import { askLLM } from "../llm/openai";
import { buildContext } from "./context";
import { searchKnowledgeTool } from "../tools/searchKnowledge";
import { addToolError, type TraceEvent } from "../llm/trace";
import { shouldUseKnowledgeBase } from "./router";

export async function runAgent(userMessage: string) {
  const messages: any[] = [];
  const trace: TraceEvent[] = [];

  let systemContext = buildContext();

  const useKnowledgeBase = shouldUseKnowledgeBase(userMessage);

  if (useKnowledgeBase) {
    trace.push({
      type: "tool_call",
      toolName: "searchKnowledge",
      arguments: JSON.stringify({
        question: userMessage,
      }),
    });

    try {
      const searchResult = await searchKnowledgeTool.execute({
        question: userMessage,
      });

      if (!searchResult.found) {
        return {
          answer: "I don't know based on the provided information.",
          trace,
        };
      }

      const knowledge = searchResult.chunks
        .map((chunk) => chunk.text)
        .join("\n\n");

      systemContext += `

Knowledge base results:
${knowledge}

Instructions:
Answer the user's question using only the knowledge base results above.
If the answer is not supported by these results, say you don't know based on the provided information.
`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown search error";

      addToolError(trace, "searchKnowledge", errorMessage);

      return {
        answer: "Knowledge search failed. Please try again.",
        trace,
      };
    }
  }

  messages.push({
    role: "system",
    content: systemContext,
  });

  messages.push({
    role: "user",
    content: userMessage,
  });

  const result = await askLLM(messages);

  return {
    ...result,
    trace: [...trace, ...result.trace],
  };
}
