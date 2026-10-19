import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { log } from "node:console";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const text = "I want a cheap laptop for programming";

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  console.log("response:", response);
  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Embedding was not returned");
  }

  console.log("Original text:", text);
  console.log("Vector length:", vector.length);
  console.log("First 5 numbers:", vector.slice(0, 5));
}

main().catch(console.error);
