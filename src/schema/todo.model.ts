import mongoose, {  model, models, Document } from "mongoose";

// Define Todo Type
interface ITodo extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent re-declaration of the model
const Todo = models.Todo || model<ITodo>("Todo", todoSchema);

export default Todo;
export type { ITodo };
