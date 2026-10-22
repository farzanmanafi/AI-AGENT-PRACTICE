import "dotenv/config";
import { searchKnowledgeTool } from "../tools/searchKnowledge";

async function main() {
  console.log("Starting RAG error test...");

  try {
    const result = await searchKnowledgeTool.execute({
      question: "Who created Python?",
    });

    console.log("Unexpected success:", result);
  } catch (error) {
    console.log("RAG error caught!");

    if (error instanceof Error) {
      console.log("Error name:", error.name);
      console.log("Error message:", error.message);
    } else {
      console.log("Unknown error:", error);
    }
  }
}

main().catch((error) => {
  console.error("Test failed unexpectedly:", error);
  process.exitCode = 1;
});
