export const calculatorTool = {
  name: "calculate",

  description: "Multiply two numbers",

  parameters: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number",
      },

      b: {
        type: "number",
        description: "Second number",
      },
    },

    required: ["a", "b"],
  },

  execute(args: { a: number; b: number }) {
    return args.a * args.b;
  },
};
