"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, PropsWithChildren, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type Chat = {
  _id: string;
  id: string;
  name: string;
  messages: Message[];
  updatedAt: string;
};

type AppContextValue = {
  user: ReturnType<typeof useUser>["user"] | undefined;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  createNewChat: () => Promise<void>;
  fetchUserChats: () => Promise<void>;
};

export const AppContext = createContext<AppContextValue>({
  user: undefined,
  chats: [],
  setChats: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  createNewChat: async () => {},
  fetchUserChats: async () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const fetchUserChats = useCallback(async () => {
    try {
      if (!user) return;
      const token = await getToken();
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        const chatsList: Chat[] = data.data;
        if (chatsList.length === 0) {
          await createNewChat();
        } else {
          chatsList.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
          setChats(chatsList);
          setSelectedChat(chatsList[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch user chats error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch chats");
    }
  }, [getToken, user]);

  const createNewChat = useCallback(async () => {
    try {
      if (!user) return;
      const token = await getToken();
      await axios.post("/api/chat/create", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserChats();
    } catch (error) {
      console.error("Create new chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create chat");
    }
  }, [getToken, fetchUserChats, user]);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    }
  }, [user, fetchUserChats]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    fetchUserChats
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export type { Message }; // ✅ Fix: Properly export Message type