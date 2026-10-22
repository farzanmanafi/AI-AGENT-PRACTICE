import { askLLM } from "../llm/openai";
import { buildContext } from "./context";
import { searchKnowledgeTool } from "../tools/searchKnowledge";
import { addToolError, type TraceEvent } from "../llm/trace";
import { safeShouldUseKnowledgeBase } from "./safe-llm-router";
type Router = (question: string) => Promise<boolean>;

export async function runAgent(userMessage: string, router?: Router) {
  const messages: any[] = [];
  const trace: TraceEvent[] = [];

  let systemContext = buildContext();
  let knowledge: string[] = [];

  // Step 1: Ask the LLM Router whether we need the knowledge base.
  let useKnowledgeBase: boolean;

  try {
    useKnowledgeBase = await safeShouldUseKnowledgeBase(userMessage, router);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown router error";

    // Record the router error in the trace.
    addToolError(trace, "llmRouter", errorMessage);

    return {
      answer:
        "I couldn't determine how to handle your question. Please try again.",
      trace,
      knowledge: [],
    };
  }

  // Step 2: Search the knowledge base only when the router says YES.
  if (useKnowledgeBase) {
    trace.push({
      type: "tool_call",
      toolName: "searchKnowledge",
      arguments: JSON.stringify({ question: userMessage }),
    });

    try {
      const searchResult = await searchKnowledgeTool.execute({
        question: userMessage,
      });

      if (!searchResult.found) {
        return {
          answer: "I don't know based on the provided information.",
          trace,
          knowledge: [],
        };
      }

      // Keep retrieved knowledge available for evaluation.
      knowledge = searchResult.chunks
        .map((chunk) => chunk.text)
        .filter((text): text is string => text !== null);

      const knowledgeContext = knowledge.join("\n\n");

      systemContext += `

Knowledge base results:
${knowledgeContext}

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
        knowledge: [],
      };
    }
  }

  // Step 3: Send the system context and user question to the LLM.
  messages.push({
    role: "system",
    content: systemContext,
  });

  messages.push({
    role: "user",
    content: userMessage,
  });

  const result = await askLLM(messages);

  // Step 4: Return the answer, trace, and retrieved knowledge.
  return {
    ...result,
    trace: [...trace, ...result.trace],
    knowledge,
  };
}
