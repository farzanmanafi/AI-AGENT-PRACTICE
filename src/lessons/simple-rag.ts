import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";
import OpenAI from "openai";

async function createEmbedding(
  ai: GoogleGenAI,
  text: string,
): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Embedding was not returned");
  }

  return vector;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const chroma = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
  });

  const collection = await chroma.getOrCreateCollection({
    name: "python_course",
    embeddingFunction: null,
  });

  const question = "Who created python?";

  // 1. Convert question to vector
  const queryVector = await createEmbedding(ai, question);

  // 2. Search Chroma
  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 2,
  });

  const threshold = 0.7;

  const documents = results.documents[0] ?? [];
  const distances = results.distances[0] ?? [];

  const relevantChunks = documents.filter((_, index) => {
    const distance = distances[index];

    return distance !== null && distance !== undefined && distance <= threshold;
  });

  console.log("\nFiltered chunks:");
  console.log(relevantChunks);

  const context = relevantChunks.join("\n\n");

  if (relevantChunks.length === 0) {
    console.log("\nFinal Answer:");
    console.log("I don't know based on the provided information.");
    return;
  }

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "Answer the user's question using only the provided context. If the answer is not in the context, say you don't know based on the provided information.",
      },
      {
        role: "user",
        content: `Context:
${context}

Question:
${question}`,
      },
    ],
  });

  const answer = response.choices[0]?.message.content;

  console.log("\nFinal Answer:");
  console.log(answer ?? "No answer returned.");

  console.log("Question:");
  console.log(question);

  console.log("\nRetrieved context:");

  for (const chunk of relevantChunks) {
    console.log("-", chunk);
  }
}

main().catch(console.error);
