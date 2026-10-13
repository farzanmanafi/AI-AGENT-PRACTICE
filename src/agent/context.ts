import { getMemory } from "../memory/memory";

export function buildContext() {
  const memory = getMemory();

  return `
Important user memory:

Name: ${memory.name ?? "Unknown"}
Learning: ${memory.learning ?? "Unknown"}
Project: ${memory.project ?? "Unknown"}
`;
}

export function getRecentMessages(messages: any[], limit: number = 10) {
  return messages.slice(-limit);
}
