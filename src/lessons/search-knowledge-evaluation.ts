import { searchKnowledgeTool } from "../tools/searchKnowledge";

async function main() {
  const questions = [
    "Who created Python?",
    "Who created JavaScript?",
    "What is Python used for?",
  ];

  for (const question of questions) {
    console.log("\n-------------------------");
    console.log("Question:", question);

    const result = await searchKnowledgeTool.execute({
      question,
    });

    console.log("Found:", result.found);
    console.log("Accepted chunks:", result.chunks.length);

    const firstChunk = result.chunks[0];

    if (result.found) {
      result.chunks.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1}:`, chunk.text);
        console.log(`Distance: ${chunk.distance}`);
      });
    }
  }
}

main().catch(console.error);
