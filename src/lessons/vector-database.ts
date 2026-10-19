import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const chroma = new ChromaClient({
    path: "http://localhost:8000",
  });

  // Create or get our collection
  const collection = await chroma.getOrCreateCollection({
    name: "learning_documents",
  });

  const texts = [
    "Python is a programming language.",
    "You can learn Python by practicing every day.",
    "Pizza is a popular Italian food.",
    "The weather is sunny today.",
  ];

  // Create embeddings and store documents
  for (const [i, text] of texts.entries()) {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

    const vector = response.embeddings?.[0]?.values;

    if (!vector) {
      throw new Error(`Embedding missing for document ${i}`);
    }

    await collection.upsert({
      ids: [`doc-${i}`],
      documents: [text],
      embeddings: [vector],
    });
  }

  console.log("Documents saved!");

  // Search for a relevant document
  const query = "How can I learn Python?";

  const queryResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: query,
  });

  const queryVector = queryResponse.embeddings?.[0]?.values;

  if (!queryVector) {
    throw new Error("Query embedding was not returned");
  }

  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 2,
  });

  console.log("\nSearch results:");

  for (const document of results.documents[0] ?? []) {
    console.log(document);
  }
}

main().catch(console.error);
