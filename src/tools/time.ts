export const timeTool = {
  name: "getTime",

  description: "Get the current time for a city",

  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "The city name",
      },
    },

    required: ["city"],
  },

  execute(args: { city: string }) {
    return `The current time in ${args.city} is 2:30 PM.`;
  },
};
