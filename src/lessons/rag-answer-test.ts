import "dotenv/config";
import OpenAI from "openai";
import { searchKnowledgeTool } from "../tools/searchKnowledge";

async function main() {
  const question = "Who created Javascript?";

  // Step 1: Search the knowledge base
  const searchResult = await searchKnowledgeTool.execute({ question });

  if (!searchResult.found) {
    console.log("Answer: I don't know based on the provided information.");
    return;
  }

  // Step 2: Build context from retrieved chunks
  const context = searchResult.chunks.map((chunk) => chunk.text).join("\n\n");

  console.log("Retrieved context:");
  console.log(context);

  // Step 3: Ask Groq to answer using that context
  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "Answer using only the provided context. If the answer is not in the context, say you don't know based on the provided information.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion:\n${question}`,
      },
    ],
  });

  console.log("\nFinal answer:");
  console.log(response.choices[0]?.message.content ?? "No answer returned.");
}

main().catch((error) => {
  console.error("RAG answer test failed:", error);
  process.exitCode = 1;
});
