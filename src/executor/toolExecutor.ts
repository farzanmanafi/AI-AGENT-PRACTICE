// import { toolRegistry } from "../tools/toolRegistry";

// export function executeTool(toolName: string, argumentsString: string) {
//   try {
//     const tool = toolRegistry[toolName as keyof typeof toolRegistry];

//     if (!tool) {
//       throw new Error(`Unknown tool: ${toolName}`);
//     }

//     const args = JSON.parse(argumentsString);

//     return tool.execute(args);
//   } catch (error) {
//     return {
//       error: true,
//       message: error instanceof Error ? error.message : "Unknown tool error",
//     };
//   }
// }

import { toolRegistry } from "../tools/toolRegistry";

export function executeTool(toolName: string, argumentsString: string) {
  const tool = toolRegistry[toolName as keyof typeof toolRegistry];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  const args = JSON.parse(argumentsString);

  return tool.execute(args);
}
