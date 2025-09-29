import mongoose from "mongoose";

// Message type for both backend and frontend
export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Chat type for Mongoose and TS
export interface IChat extends mongoose.Document {
  userId: string;
  name: string;
  messages: IMessage[];
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true }
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema<IChat>({
  userId: { type: String, required: true },
  name: { type: String, default: "New Chat" },
  messages: { type: [messageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", chatSchema);
// export type { IMessage, IChat };
