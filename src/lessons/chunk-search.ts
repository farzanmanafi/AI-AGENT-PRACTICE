import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({
    apiKey,
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

  const query = "Who created Python?";

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
  });

  const queryVector = response.embeddings?.[0]?.values;

  if (!queryVector) {
    throw new Error("Query embedding was not returned");
  }

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 3,
  });

  console.log("Question:");
  console.log(query);

  console.log("\nRelevant chunks:");

  for (const document of results.documents[0] ?? []) {
    console.log("-", document);
  }
}

main().catch(console.error);
