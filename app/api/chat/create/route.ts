import connectDB from "@/config/db";
import Chat, { IChat } from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    await connectDB();
    const chatData: Partial<IChat> = {
      userId,
      messages: [],
      name: "New Chat"
    };

    const newChat = await Chat.create(chatData);

    return NextResponse.json({
      success: true,
      data: {
        id: newChat._id.toString(),
        name: newChat.name,
        messages: newChat.messages,
        updatedAt: newChat.updatedAt
      },
      message: "Chat created"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
