import "dotenv/config";
import { runAgent } from "../agent/agent";

async function main() {
  const questions = [
    "Who created Python?",
    "Who created JavaScript?",
    "What is 100 + 50?",
  ];

  for (const question of questions) {
    console.log("\n==============================");
    console.log("Question:", question);

    const result = await runAgent(question);

    console.log("Answer:", result.answer);

    console.log("Trace:");
    console.log(JSON.stringify(result.trace, null, 2));
  }
}

main().catch(console.error);
