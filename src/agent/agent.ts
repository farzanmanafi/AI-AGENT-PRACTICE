import { askLLM } from "../llm/openai";
import { buildContext } from "./context";

export async function runAgent(userMessage: string) {
  const messages: any[] = [];

  const context = buildContext();

  messages.push({
    role: "system",
    content: context,
  });

  messages.push({
    role: "user",
    content: userMessage,
  });

  return askLLM(messages);
}
