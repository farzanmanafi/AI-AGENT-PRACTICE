import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const sentenceA = "I want a cheap laptop for programming";

  const sentenceB = "I need an affordable computer for coding";

  const resultA = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: sentenceA,
  });

  const resultB = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: sentenceB,
  });

  const vectorA = resultA.embeddings?.[0]?.values;
  const vectorB = resultB.embeddings?.[0]?.values;

  if (!vectorA || !vectorB) {
    throw new Error("Could not create embeddings");
  }

  if (vectorA.length !== vectorB.length) {
    throw new Error("Embedding vectors have different lengths");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    const a = vectorA[i];
    const b = vectorB[i];

    if (a === undefined || b === undefined) {
      throw new Error(`Missing embedding value at index ${i}`);
    }

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  const similarity =
    dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));

  console.log("Sentence A:", sentenceA);
  console.log("Sentence B:", sentenceB);
  console.log("Cosine Similarity:", similarity.toFixed(4));
}

main().catch(console.error);
