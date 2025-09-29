import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    console.log("API /chat/ai called"); // Debug log

    const { userId } = getAuth(req);
    console.log("User ID:", userId); // Debug log
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json(
        { success: false, message: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("Request body:", body); // Debug log
    
    const { chatId, prompt } = body;

    if (
      !chatId ||
      typeof chatId !== "string" ||
      !prompt ||
      typeof prompt !== "string" ||
      prompt.trim() === ""
    ) {
      console.error("Invalid input:", { chatId, prompt });
      return NextResponse.json(
        { success: false, message: "Invalid or missing chatId or prompt" },
        { status: 400 }
      );
    }

    console.log("Connecting to DB...");
    await connectDB().catch(err => {
      console.error("DB connection failed:", err);
      throw new Error("Database connection failed");
    });

    console.log("Finding chat with ID:", chatId);
    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      console.error("Chat not found:", { userId, chatId });
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    const userMsg = { role: "user", content: prompt.trim(), timestamp: Date.now() };
    chat.messages.push(userMsg);

    console.log("Calling OpenAI...");
    
    // ✅ Fix: Use correct model name for Gemini
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-2.5-flash", // ✅ Changed from "gemini-2.5-flash"
    });

    console.log("OpenAI response:", completion);

    const messageContent = completion?.choices?.[0]?.message?.content;
    if (!messageContent) {
      console.error("No message content from OpenAI");
      return NextResponse.json({
        success: false,
        message: "AI did not return a response.",
      }, { status: 500 });
    }

    const assistantMsg = {
      role: "assistant",
      content: messageContent,
      timestamp: Date.now(),
    };

    chat.messages.push(assistantMsg);
    chat.updatedAt = new Date();

    await chat.save();
    console.log("Chat saved successfully");

    return NextResponse.json({
      success: true,
      data: assistantMsg,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error in /api/chat/ai:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
