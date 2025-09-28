import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatbotConfig, Message } from "./types/types";

interface ChatbotStore {
  chatbots: ChatbotConfig[];
  messages: Record<string, Message[]>;
  addChatbot: (
    chatbot: Omit<ChatbotConfig, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateChatbot: (id: string, chatbot: Partial<ChatbotConfig>) => void;
  deleteChatbot: (id: string) => void;
  getChatbot: (id: string) => ChatbotConfig | undefined;
  addMessage: (
    chatbotId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  getMessages: (chatbotId: string) => Message[];
}

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set, get) => ({
      chatbots: [],
      messages: {},

      addChatbot: (chatbotData) => {
        const newChatbot: ChatbotConfig = {
          ...chatbotData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          chatbots: [...state.chatbots, newChatbot],
        }));
      },

      updateChatbot: (id, updates) => {
        set((state) => ({
          chatbots: state.chatbots.map((chatbot) =>
            chatbot.id === id
              ? { ...chatbot, ...updates, updatedAt: new Date().toISOString() }
              : chatbot
          ),
        }));
      },

      deleteChatbot: (id) => {
        set((state) => {
          const { [id]: deleted, ...remainingMessages } = state.messages;
          return {
            chatbots: state.chatbots.filter((chatbot) => chatbot.id !== id),
            messages: remainingMessages,
          };
        });
      },

      getChatbot: (id) => {
        return get().chatbots.find((chatbot) => chatbot.id === id);
      },

      addMessage: (chatbotId, messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          messages: {
            ...state.messages,
            [chatbotId]: [...(state.messages[chatbotId] || []), newMessage],
          },
        }));
      },

      getMessages: (chatbotId) => {
        return get().messages[chatbotId] || [];
      },
    }),
    {
      name: "chatbot-storage",
    }
  )
);
