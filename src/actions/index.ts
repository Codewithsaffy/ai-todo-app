import { google } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { addTodo, getTodos } from "./todo";

// Enhanced system prompt to make the model more intelligent
const SYSTEM_PROMPT = `
You are an advanced Todo AI Assistant designed to manage tasks intelligently and contextually.
Your responsibilities include:
1. Thoroughly analyzing user queries to determine whether to retrieve tasks or add new ones.
2. Using the available tools effectively:
   - "getTodos": Retrieve all current tasks.
   - "createTodo": Add a new task.
3. If a tool call is needed, briefly explain your reasoning and ensure all required parameters are present.
4. If the query is ambiguous or missing details, ask clarifying questions before proceeding.
5. Provide clear, concise, and natural language responses that summarize your actions.
6. If no tool call is required, generate a helpful response using your internal reasoning.

Examples:
User: "Remind me to go to the market today."
AI: "I will call createTodo with title 'Market Reminder', description 'Go to market today', and status 'pending' to add your task."
User: "Show me my tasks."
AI: "This is your task to do. // all task show"

Always validate user intent and provide reasoning for any tool call.
`;

const getTodosTool = tool({
  description: "Retrieve the current list of todos from the database.",
  parameters: z.object({}),
  execute: async () => {
    // Return the todos so the assistant can include them in its response.
     await getTodos();
  },
});

const createTodoTool = tool({
  description:
    "Add a new todo to the database. Requires a title, description, and status.",
  parameters: z.object({
    title: z.string().describe("Title of the todo item"),
    description: z.string().describe("Detailed description of the task"),
    status: z
      .enum(["pending", "in-progress", "completed"])
      .describe("Current status of the task"),
  }),
  execute: async ({ title, description, status }) => {
    await addTodo({
      title,
      description,
      status,
    });
    // Return a confirmation message to the assistant.
  },
});

export const generateMarketingCopy = async () => {
  const answer = await generateText({
    model: google("gemini-2.0-flash", { structuredOutputs: true }),
    tools: {
      getTodos: getTodosTool,
      createTodo: createTodoTool,
    },
    maxSteps: 5,
    system: SYSTEM_PROMPT,
    prompt: "Remind me to go to the gym tomorrow morning",
  });

  console.log(`ANSWER: ${answer.text}`);
};
