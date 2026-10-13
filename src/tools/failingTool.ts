export const failingTool = {
  name: "failingTool",

  description: "A tool used for testing errors",

  parameters: {
    type: "object",
    properties: {},
  },

  execute() {
    throw new Error("Test tool failed");
  },
};
