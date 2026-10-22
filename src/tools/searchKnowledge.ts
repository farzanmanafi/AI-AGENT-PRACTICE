import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { ChromaClient } from "chromadb";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey });

const chroma = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});

async function createEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Query embedding was not returned");
  }

  return vector;
}

export const searchKnowledgeTool = {
  name: "searchKnowledge",

  description:
    "Search the Python course knowledge base for information relevant to a user's question. Use this when answering questions about the stored course material.",

  parameters: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "The question to search for in the knowledge base",
      },
    },
    required: ["question"],
  },

  async execute(args: { question: string }) {
    const question = args.question.trim();

    if (!question) {
      throw new Error("Question must not be empty");
    }

    const collection = await chroma.getOrCreateCollection({
      name: "python_course",
      embeddingFunction: null,
    });

    const queryVector = await createEmbedding(question);

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: 2,
    });

    const documents = results.documents[0] ?? [];
    const distances = results.distances[0] ?? [];

    const threshold = 0.7;

    const candidates = documents.map((document, index) => {
      const distance = distances[index];

      return {
        text: document,
        distance,
        accepted:
          distance !== null && distance !== undefined && distance <= threshold,
      };
    });

    const relevantChunks = candidates
      .filter((chunk) => chunk.accepted)
      .map(({ text, distance }) => ({
        text,
        distance,
      }));

    if (relevantChunks.length === 0) {
      return {
        found: false,
        message:
          "No sufficiently close information was found in the knowledge base.",
        threshold,
        chunks: [],
        candidates,
      };
    }

    return {
      found: true,
      threshold,
      chunks: relevantChunks,
      candidates,
    };
  },
};
