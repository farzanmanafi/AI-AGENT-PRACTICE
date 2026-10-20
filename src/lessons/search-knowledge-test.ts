import "dotenv/config";
import { searchKnowledgeTool } from "../tools/searchKnowledge";

async function main() {
  const question = "Who created Python?";

  console.log("Question:", question);
  console.log("\nSearching knowledge base...");

  const result = await searchKnowledgeTool.execute({ question });

  console.log("\nSearch result:");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Search test failed:", error);
  process.exitCode = 1;
});
