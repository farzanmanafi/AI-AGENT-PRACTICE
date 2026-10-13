export const weatherTool = {
  name: "getWeather",

  description: "Get the weather for a city",

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
    return `The weather in ${args.city} is sunny.`;
  },
};
