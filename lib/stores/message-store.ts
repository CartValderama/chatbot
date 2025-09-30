import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "../types/types";
import { messageService } from "../services/chatbot-service";

interface MessageStore {
  messages: Record<string, Message[]>;
  addMessage: (
    chatbotId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => Promise<void>;
  getMessages: (chatbotId: string) => Message[];
  loadMessages: (chatbotId: string) => Promise<void>;
  clearMessages: (chatbotId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set, get) => ({
      messages: {},

      loadMessages: async (chatbotId) => {
        try {
          const messages = await messageService.getMessages(chatbotId);
          set((state) => ({
            messages: {
              ...state.messages,
              [chatbotId]: messages,
            },
          }));
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, just keep local storage data
          console.log("Using local storage for messages (no backend available)");
          // ===== END TEMPORARY SECTION =====
        }
      },

      addMessage: async (chatbotId, messageData) => {
        try {
          const newMessage = await messageService.addMessage(chatbotId, messageData);
          set((state) => ({
            messages: {
              ...state.messages,
              [chatbotId]: [...(state.messages[chatbotId] || []), newMessage],
            },
          }));
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, the service already returns a message with ID and timestamp
          // So this code path won't be hit, but keeping for safety
          console.log("Message added locally (no backend available)");
          // ===== END TEMPORARY SECTION =====
          console.error("Failed to add message:", error);
          throw error;
        }
      },

      getMessages: (chatbotId) => {
        return get().messages[chatbotId] || [];
      },

      clearMessages: async (chatbotId) => {
        try {
          await messageService.clearMessages(chatbotId);
          set((state) => {
            const { [chatbotId]: deleted, ...remainingMessages } = state.messages;
            return { messages: remainingMessages };
          });
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, service already succeeds, so this won't trigger
          // But keeping for consistency
          console.log("Messages cleared locally (no backend available)");
          // ===== END TEMPORARY SECTION =====
          console.error("Failed to clear messages:", error);
          throw error;
        }
      },
    }),
    {
      name: "message-storage",
    }
  )
);