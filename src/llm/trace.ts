export type TraceEvent = {
  type: "tool_call" | "tool_error";
  toolName: string;
  arguments?: string;
  message?: string;
};

export function addToolError(
  trace: TraceEvent[],
  toolName: string,
  message: string,
): void {
  trace.push({
    type: "tool_error",
    toolName,
    message,
  });
}
