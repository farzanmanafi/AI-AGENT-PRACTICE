import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";

function chunkText(
  text: string,
  sentencesPerChunk: number,
  overlap: number,
): string[] {
  if (sentencesPerChunk <= 0) {
    throw new Error("Chunk size must be positive");
  }

  if (overlap < 0 || overlap >= sentencesPerChunk) {
    throw new Error("Invalid overlap");
  }

  const sentences = text
    .split(".")
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const chunks: string[] = [];

  const step = sentencesPerChunk - overlap;

  for (let i = 0; i < sentences.length; i += step) {
    const chunk = sentences.slice(i, i + sentencesPerChunk).join(". ") + ".";

    chunks.push(chunk);
  }

  return chunks;
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

  const chroma = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false,
  });

  // We pass our own Gemini embeddings, so Chroma doesn't need an embedding function
  const collection = await chroma.getOrCreateCollection({
    name: "python_course",
    embeddingFunction: null,
  });

  const document = `
    Python is a programming language.
    Python was created by Guido van Rossum.
    Python has a simple syntax.
    Python is used for web development.
    Python is also used for data analysis.
  `;

  const chunks = chunkText(document, 2, 1);

  console.log("Number of chunks:", chunks.length);

  for (const [i, chunk] of chunks.entries()) {
    console.log(`\nCreating embedding for chunk ${i + 1}...`);

    const vector = await createEmbedding(ai, chunk);

    await collection.upsert({
      ids: [`python-chunk-${i}`],
      documents: [chunk],
      embeddings: [vector],
    });

    console.log("Saved!");
  }

  console.log("\nAll chunks saved.");
}

main().catch(console.error);
