import OpenAI from "openai";
import "dotenv/config";

import { executeTool } from "../executor/toolExecutor";
import { toolRegistry } from "../tools/toolRegistry";
import { retry, withTimeout } from "./retry";

const client = new OpenAI({
  //1. اتصال به Groq
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

//ساخت Tool Schema
const tools = Object.values(toolRegistry).map((tool) => ({
  type: "function" as const,

  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));

export async function askLLM(messages: any[]) {
  const MAX_ITERATIONS = 10;

  // برای Evaluation و Debugging
  const trace: any[] = [];
  //3. Agent Loop
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const response = await client.chat.completions.create({
      //4. درخواست به LLM
      model: "openai/gpt-oss-20b",
      messages,
      tools,
    });

    const choice = response.choices[0];

    if (!choice) {
      throw new Error("LLM returned no choices");
    }

    const assistantMessage = choice.message;

    messages.push(assistantMessage);

    // --------------------------------
    // No Tool Call → Final Answer
    // --------------------------------

    if (!assistantMessage.tool_calls) {
      //5. آیا Tool لازم است؟
      return {
        answer: assistantMessage.content ?? "",
        trace,
      };
    }

    // --------------------------------
    // Tool Calls
    // --------------------------------

    for (const toolCall of assistantMessage.tool_calls) {
      // فقط function tool calls را پشتیبانی می‌کنیم
      if (toolCall.type !== "function") continue;

      // ذخیره Tool Call برای Evaluation
      trace.push({
        type: "tool_call",
        toolName: toolCall.function.name,
        arguments: toolCall.function.arguments,
      });

      try {
        const result = await retry(
          () =>
            withTimeout(
              () =>
                Promise.resolve(
                  executeTool(
                    toolCall.function.name,
                    toolCall.function.arguments,
                  ),
                ),
              5000,
            ),
          3,
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: JSON.stringify(result),
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown tool error";

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: JSON.stringify({
            error: true,
            message: errorMessage,
          }),
        });
      }
    }
  }

  // اگر Agent بیش از 10 مرحله رفت
  return {
    answer: "Agent stopped because it reached the maximum number of steps.",

    trace,
  };
}
