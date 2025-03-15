"use client"

import { type ITodo } from "@/actions/todo"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"

interface TodoListProps {
  todos: ITodo[]
}

export default function TodoList({ todos }: TodoListProps) {
  return (
    <div className="p-4">
      {todos.length === 0 ? (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            Add your tasks to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {todos.map((todo, index) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{todo.title}</h3>
                <Badge className="capitalize">
                  {todo.status.replace("-", " ")}
                </Badge>
              </div>
              <p className="text-sm text-gray-700">{todo.description}</p>
              {todo.createdAt && (
                <div className="mt-2 text-xs text-gray-500">
                  Created: {new Date(todo.createdAt).toLocaleString()}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
