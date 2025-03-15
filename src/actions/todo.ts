"use server"

import { dbConnect } from "@/helper/db"
import Todo from "@/schema/todo.model"

export interface ITodo {
  _id?: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  createdAt?: string
  updatedAt?: string
}

// ✅ **Create Todo**
export const addTodo = async (todo: ITodo): Promise<ITodo> => {
  try {
    await dbConnect()
    const createdTodo = await Todo.create(todo)
    console.log("createdTodo")
    return JSON.parse(JSON.stringify(createdTodo))
  } catch (error) {
    console.error("❌ Error creating Todo:", error)
    throw new Error("Failed to create Todo")
  }
}

// ✅ **Read Todos (All)**
export const getTodos = async (): Promise<ITodo[]> => {
  try {
    await dbConnect()
    const todos = await Todo.find().sort({ createdAt: -1 })
    console.log(todos)
  
    return JSON.parse(JSON.stringify(todos))
  } catch (error) {
    console.error("❌ Error fetching Todos:", error)
    throw new Error("Failed to fetch Todos")
  }
}

// ✅ **Update Todo**
export const updateTodo = async (id: string, updatedData: Partial<ITodo>): Promise<ITodo | null> => {
  try {
    await dbConnect()
    const updatedTodo = await Todo.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
    return updatedTodo ? JSON.parse(JSON.stringify(updatedTodo)) : null
  } catch (error) {
    console.error("❌ Error updating Todo:", error)
    throw new Error("Failed to update Todo")
  }
}

// ✅ **Delete Todo**
export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    await dbConnect()
    const deleted = await Todo.findByIdAndDelete(id)
    return Boolean(deleted)
  } catch (error) {
    console.error("❌ Error deleting Todo:", error)
    throw new Error("Failed to delete Todo")
  }
}

// ✅ **Search Todos (Only User's Todos)**
export const searchTodos = async ({ query }: { query: string }): Promise<ITodo[]> => {
  try {
    await dbConnect()
    const todos = await Todo.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(todos))
  } catch (error) {
    console.error("❌ Error searching Todos:", error)
    throw new Error("Failed to search Todos")
  }
}
