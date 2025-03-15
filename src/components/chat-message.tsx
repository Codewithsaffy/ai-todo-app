import type { Message } from "ai"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
 

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  console.log(message)
  return (
    <div
      className={cn("flex items-start gap-4 rounded-lg p-4", message.role === "user" ? "bg-muted/50" : "bg-primary/5")}
    >
      <div
        className={cn(
          "rounded-full p-2 flex items-center justify-center",
          message.role === "user" ? "bg-primary/10" : "bg-primary text-primary-foreground",
        )}
      >
        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium">{message.role === "user" ? "You" : "AI Assistant"}</div>
        <div >{"- hi"}</div>
      </div>
    </div>
  )
}

