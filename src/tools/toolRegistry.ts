import { calculatorTool } from "./calculator";
import { weatherTool } from "./weather";
import { timeTool } from "./time";
import { failingTool } from "./failingTool";

export const toolRegistry = {
  calculate: calculatorTool,
  getWeather: weatherTool,
  getTime: timeTool,
  failingTool: failingTool,
};
