import fs from "node:fs";

const memoryFile = "src/memory/store.json";

export function saveMemory(key: string, value: string) {
  const memory = JSON.parse(fs.readFileSync(memoryFile, "utf-8"));

  memory[key] = value;

  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

export function getMemory() {
  return JSON.parse(fs.readFileSync(memoryFile, "utf-8"));
}
