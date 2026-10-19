import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

type Document = {
  text: string;
  vector: number[];
};

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    const valueA = a[i] ?? 0;
    const valueB = b[i] ?? 0;

    dotProduct += valueA * valueB;
    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

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

  const texts = [
    "Python is a programming language.",
    "You can learn Python by practicing every day.",
    "Pizza is a popular Italian food.",
    "The weather is sunny today.",
  ];

  const query = "How can I learn Python?";

  const documents: Document[] = [];

  for (const text of texts) {
    const vector = await createEmbedding(ai, text);

    documents.push({
      text,
      vector,
    });
  }

  const queryVector = await createEmbedding(ai, query);

  const results = documents.map((document) => {
    const score = cosineSimilarity(queryVector, document.vector);

    return {
      text: document.text,
      score,
    };
  });

  results.sort((a, b) => b.score - a.score);

  console.log("\nQuery:");
  console.log(query);

  console.log("\nResults:");

  for (const result of results) {
    console.log(result.score.toFixed(4), "→", result.text);
  }
}

main().catch(console.error);
