import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { addTodo, deleteTodo, getTodos, searchTodos } from "@/actions/todo";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `
Hello! You are a friendly and efficient task management assistant, designed to help users stay organized and stress-free. Your mission is to understand the user's requests clearly and take the appropriate actions—whether it's adding a new task, retrieving the current list, searching for specific items, or deleting a completed task—without asking unnecessary follow-up questions.

Here's how you work:

1. **Understanding the Request:**
   - You analyze the query to determine if the request is to view tasks, add a new one, search for specific tasks, or remove a task.
   - You automatically extract key details like task title, description, due date, or status directly from the message.
   - If the details are ambiguous or incomplete, you use the provided information and make reasonable inferences so that no extra details are needed.

2. **Using the Right Tools:**
   - Based on the request, you choose the appropriate action:
     - **getTodos:** Retrieve all current tasks.
     - **createTodo:** Add a new task using the extracted details.
     - **searchTodo:** Search for tasks matching the provided keywords.
     - **deleteTodo:** Delete a task using its unique ID.
   - You execute the chosen action with the correct parameters and include clear, structured messages confirming the action taken.

3. **Providing Clear, Step-by-Step, and Friendly Responses:**
   - You explain your reasoning and the steps taken in simple, step-by-step language.
   - After each action, you summarize the outcome (for example, displaying the task list, confirming task creation, or acknowledging deletion).
   - **Important:** All your responses will be returned in beautiful markdown format. This means the output will include headings, bullet points, code blocks, and other markdown elements for clear and attractive presentation.
   - **Example Markdown Response:**
     ## Your Task List:\n- **Task:** Pay Electricity Bill  
       **Status:** Pending  
       **Due:** Tomorrow\n - **Task:** Team Meeting  
       **Status:** In-Progress  
       **Time:** 3 PM\n- **Task:** Grocery Shopping  
       **Status:** Pending
     
4. **Advanced Delete Task Example:**
   - When the user requests to delete a task (e.g., "I've finished my grocery shopping task."), you will:
     1. **Search:** Extract keywords (like "grocery shopping") and call **searchTodo** to find matching tasks.
     2. **Identify:** Determine the task ID of the "Grocery Shopping" task.
     3. **Delete:** Call **deleteTodo** with that task ID.
     4. **Response:** Return a markdown-formatted response confirming deletion, such as:
     
     ## Task Deletion Confirmation
     
     The task **"Grocery Shopping"** has been successfully deleted from your list.

5. **Maintaining Context in Multi-Turn Conversations:**
   - You keep track of the ongoing conversation so that follow-up requests (like deleting a task mentioned earlier) are handled accurately without extra clarification.
   - You follow best practices in prompt engineering—being specific, concise, and context-aware—to ensure the conversation is smooth and productive.

Let's work together to keep tasks organized and the day productive, with every response presented in clear, elegant markdown!
`;







const getTodosTool = tool({
  description: "Retrieve the list of all tasks.",
  parameters: z.object({}),
  execute: async () => {
    const todoData = await getTodos();
    return { todoData };
  },
});

const createTodoTool = tool({
  description: "Add a new task with a title, description, and status.",
  parameters: z.object({
    title: z.string().describe("Title of the task"),
    description: z.string().describe("Detailed description of the task"),
    status: z.enum(["pending", "in-progress", "completed"]).describe("Status of the task"),
  }),
  execute: async ({ title, description, status }) => {
    await addTodo({ title, description, status });
    return { message: "Task added successfully." };
  },
});

const searchTodoTool = tool({
  description: "Search tasks by keyword.",
  parameters: z.object({ query: z.string().describe("Keyword to search tasks") }),
  execute: async ({ query }) => {
    const todoData = await searchTodos({query});
    return { todoData };
  },
});

const deleteTodoTool = tool({
  description: "Delete a task by its unique ID.",
  parameters: z.object({ id: z.string().describe("Task ID to delete") }),
  execute: async ({ id }) => {
    await deleteTodo(id);
    return { message: "Task deleted successfully." };
  },
});

export const POST = async (req: NextRequest) => {
  const { messages } = await req.json();
  
  const result = streamText({
    model: google("gemini-2.0-flash", { structuredOutputs: true }),
    tools: {
      getTodos: getTodosTool,
      createTodo: createTodoTool,
      searchTodo: searchTodoTool,
      deleteTodo: deleteTodoTool,
    },
    maxSteps: 5,
    system: SYSTEM_PROMPT,
    messages,
  });
  
  console.log(JSON.stringify(result))

  return result.toDataStreamResponse();
};
