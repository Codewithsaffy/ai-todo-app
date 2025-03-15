"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Send,
  PaperclipIcon,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ImagePlus,
  FileAudio,
  MoreHorizontal,
  Clock,
  Check,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Message } from "ai"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import TodoList from "./todo-list"
import { getTodos } from "@/actions/todo"

interface ChatInterfaceProps {
  onChatComplete?: () => void
}

export default function ChatInterface({ onChatComplete }: ChatInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAttaching, setIsAttaching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
   const [todos, setTodos] = useState<ITodo[]>([])
  
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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",
    onFinish: () => {
      if (onChatComplete) onChatComplete()
    },
  })

  // Suggested prompts for conversation
  const suggestedPrompts = [
    { text: "Show all my tasks", icon: "📋" },
    { text: "Add a task to buy groceries", icon: "🛒" },
    { text: "Find tasks related to work", icon: "💼" },
    { text: "Mark my first task as completed", icon: "✅" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus textarea on mount and expansion
  useEffect(() => {
    textareaRef.current?.focus()
  }, [isExpanded])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleAttachToggle = () => {
    setIsAttaching((prev) => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.closest("form")
      if (form) form.requestSubmit()
    }
  }

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl border shadow-xl">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 bg-primary/10 ring-2 ring-primary/20 ring-offset-1">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              TaskMaster AI
              <Badge
                variant="outline"
                className="bg-primary/10 text-xs font-medium text-primary border-primary/20 flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" /> AI Powered
              </Badge>
            </h2>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Thinking...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" /> Ready to assist
                </span>
              )}
            </p>
          </div>
        </div>

      </div>


        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {/* Show suggestion UI only if no messages exist and input is empty */}
          {messages.length === 0 && input.trim() === "" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8"
            >
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Bot className="h-12 w-12 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary/10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.2, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </div>

              <div className="space-y-3 max-w-md">
                <h3 className="text-xl font-semibold">
                  How can I help you with your tasks today?
                </h3>
                <p className="text-muted-foreground text-sm">
                  I can help you manage your tasks through natural conversation.
                  Try one of these examples to get started:
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt) => (
                  <motion.button
                    key={prompt.text}
                    className="flex items-center max-w-xl gap-2 p-3 text-sm text-left rounded-lg border bg-card hover:bg-accent transition-colors shadow-sm"
                    onClick={() => handlePromptSelect(prompt.text)}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span className="text-xl">{prompt.icon}</span>
                    <span className="truncate font-medium">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                timestamp={formatTimestamp()}
              />
            ))
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-start gap-3"
            >
              <Avatar className="h-8 w-8 mt-1 ring-2 ring-primary/10">
                <AvatarFallback className="bg-primary/90 text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-muted/30 border-muted shadow-sm">
                <div className="flex space-x-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.2,
                    }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary/70"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.4,
                    }}
                  />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat messages */}
      

      {/* Chat input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={cn(
                "pr-12 resize-none focus-visible:ring-1 focus-visible:ring-primary/30 transition-all",
                isExpanded
                  ? "min-h-[120px] max-h-[200px]"
                  : "min-h-[56px] max-h-[56px]"
              )}
              autoFocus
            />

            <div className="absolute bottom-2 right-2 flex items-center gap-2">
       

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "h-8 w-8 text-muted-foreground hover:text-foreground",
                        isExpanded && "rotate-180"
                      )}
                      onClick={handleToggleExpand}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isExpanded ? "Collapse" : "Expand"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-sm"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Attachment panel */}
      
        </form>

      </div>
    </div>
  )
}

interface ChatMessageProps {
  message: Message
  isLast: boolean
  timestamp: string
}

function ChatMessage({ message, isLast, timestamp }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-start gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1 ring-2 ring-primary/10">
          <AvatarFallback className="bg-primary/90 text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <motion.div
        className={cn("max-w-[75%] space-y-1")}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            "p-3 shadow-sm",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
              : "bg-muted/30 border-muted"
          )}
        >
          <div className="whitespace-pre-wrap text-sm">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </Card>

        <div className="text-xs text-muted-foreground px-1 flex items-center gap-1">
          <span>{isUser ? "You" : "AI Assistant"}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timestamp}
          </span>
        </div>
      </motion.div>

      {isUser && (
        <Avatar className="h-8 w-8 mt-1 ring-2 ring-secondary/20">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}
