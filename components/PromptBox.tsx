import { assets } from "@/assets/assets";
import { useAppContext, Message } from "@/context/AppContext";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

interface PromptBoxProps {
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

function PromptBox({ isLoading, setIsLoading }: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");
  const { user, setChats, selectedChat, setSelectedChat } = useAppContext();
  const { getToken } = useAuth();


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

const sendPrompt = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return toast.error("Please sign in to send a message");
  if (isLoading) return toast.error("Please wait for the previous prompt response");
  if (!selectedChat) return toast.error("Please select a chat first");
  if (!prompt.trim()) return toast.error("Please enter a valid message");

  setIsLoading(true);
  const promptCopy = prompt.trim();
  setPrompt("");

  const userPrompt: Message = {
    role: "user",
    content: promptCopy,
    timestamp: Date.now(),
  };

  // Optimistic UI update
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === selectedChat.id
        ? { ...chat, messages: [...chat.messages, userPrompt] }
        : chat
    )
  );

  setSelectedChat((prev) =>
    prev ? { ...prev, messages: [...prev.messages, userPrompt] } : prev
  );

  try {
    const token = await getToken();
    console.log("Sending request with chatId:", selectedChat.id); // Debug log

    const { data } = await axios.post(
      "/api/chat/ai",
      { chatId: selectedChat.id, prompt: promptCopy },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API response:", data); // Debug log

    if (data.success) {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.data.content,
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      );

      setSelectedChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, assistantMessage] } : prev
      );
    } else {
      toast.error(data.message || "AI response failed");
      setPrompt(promptCopy);
    }
  } catch (error) {
    console.error("Frontend error:", error); // Debug log
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || error.message);
    } else {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
    setPrompt(promptCopy);
  } finally {
    setIsLoading(false);
  }
};




  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${(selectedChat?.messages?.length ?? 0) > 0 ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent max-h-[20rem] overflow-y-scroll"
        rows={2}
        placeholder="Message DeepSeek"
        required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-sm border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-sm border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Image className="h-5 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            type="submit"
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
            disabled={!prompt || isLoading}
          >
            <Image
              className="h-3.5 cursor-pointer"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>

  );
}

export default PromptBox;
