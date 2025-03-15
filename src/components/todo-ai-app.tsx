"use client"

import { useState, useEffect, useCallback } from "react"
import type { ITodo } from "@/actions/todo"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, ListTodo } from "lucide-react"
import TodoList from "@/components/todo-list"
import ChatInterface from "@/components/chat-interface"
import { getTodos } from "@/actions/todo"
import { motion, AnimatePresence } from "motion/react"

export default function TodoAIApp() {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [activeTab, setActiveTab] = useState("chat")

  const refreshTodos = useCallback(async () => {
    try {
      const fetchedTodos = await getTodos()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
    } finally {
    }
  }, [])

  useEffect(() => {
    refreshTodos()
  }, [refreshTodos])

  return (


        <Card className="w-full  shadow-lg pb-0 border-slate-200 dark:border-slate-800 flex-1 flex flex-col">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="todos" className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  <span>My Tasks</span>
                  {todos.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {todos.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "chat" ? (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col"
                >
                  <ChatInterface onChatComplete={refreshTodos} />
                </motion.div>
              ) : (
                <motion.div
                  key="todos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 p-6"
                >
                  <TodoList todos={todos}  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
  )
}

