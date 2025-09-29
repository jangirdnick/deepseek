import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }
    await connectDB();

    const chats = await Chat.find({ userId });

    const formattedChats = chats.map(c => ({
      id: c._id.toString(),
      name: c.name,
      messages: c.messages,
      updatedAt: c.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedChats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
