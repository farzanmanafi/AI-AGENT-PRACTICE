import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { runAgent } from "./agent/agent";

const rl = readline.createInterface({
  input,
  output,
});

async function main() {
  while (true) {
    const message = await rl.question("You: ");

    if (message.toLowerCase() === "exit") {
      break;
    }

    const answer = await runAgent(message);

    console.log("AI:", answer);
  }

  rl.close();
}

main();
