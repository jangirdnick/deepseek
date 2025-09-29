import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    const { chatId, name } = await req.json();
    if (!chatId || !name) {
      return NextResponse.json({
        success: false,
        message: "Missing chatId or name"
      }, { status: 400 });
    }

    await connectDB();
    await Chat.findOneAndUpdate({ _id: chatId, userId }, { name });

    return NextResponse.json({
      success: true,
      message: "Chat renamed successfully"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
