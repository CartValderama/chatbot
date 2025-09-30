import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatbotConfig } from "../types/types";
import { chatbotService } from "../services/chatbot-service";

interface ChatbotStore {
  chatbots: ChatbotConfig[];
  addChatbot: (chatbot: Omit<ChatbotConfig, "id">) => Promise<void>;
  updateChatbot: (id: string, chatbot: Partial<ChatbotConfig>) => Promise<void>;
  deleteChatbot: (id: string) => Promise<void>;
  getChatbot: (id: string) => ChatbotConfig | undefined;
  loadChatbots: () => Promise<void>;
}

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set, get) => ({
      chatbots: [],

      loadChatbots: async () => {
        try {
          const chatbots = await chatbotService.getAll();
          set({ chatbots });
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, just keep local storage data
          console.log("Using local storage (no backend available)");
          // ===== END TEMPORARY SECTION =====
        }
      },

      addChatbot: async (chatbotData) => {
        try {
          const newChatbot = await chatbotService.add(chatbotData);
          set((state) => ({
            chatbots: [...state.chatbots, newChatbot],
          }));
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, generate ID locally and add to state
          if ((error as Error).message === "NO_BACKEND") {
            const newChatbot = {
              ...chatbotData,
              id: crypto.randomUUID(),
            };
            set((state) => ({
              chatbots: [...state.chatbots, newChatbot],
            }));
            return;
          }
          // ===== END TEMPORARY SECTION =====
          console.error("Failed to add chatbot:", error);
          throw error;
        }
      },

      updateChatbot: async (id, updates) => {
        try {
          const updatedChatbot = await chatbotService.update(id, updates);
          set((state) => ({
            chatbots: state.chatbots.map((chatbot) =>
              chatbot.id === id ? updatedChatbot : chatbot
            ),
          }));
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, update locally
          if ((error as Error).message === "NO_BACKEND") {
            set((state) => ({
              chatbots: state.chatbots.map((chatbot) =>
                chatbot.id === id ? { ...chatbot, ...updates } : chatbot
              ),
            }));
            return;
          }
          // ===== END TEMPORARY SECTION =====
          console.error("Failed to update chatbot:", error);
          throw error;
        }
      },

      deleteChatbot: async (id) => {
        try {
          await chatbotService.delete(id);
          set((state) => ({
            chatbots: state.chatbots.filter((chatbot) => chatbot.id !== id),
          }));
        } catch (error) {
          // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
          // When no backend, delete locally (service already succeeds, so this won't trigger)
          // But keeping for consistency
          // ===== END TEMPORARY SECTION =====
          console.error("Failed to delete chatbot:", error);
          throw error;
        }
      },

      getChatbot: (id) => {
        return get().chatbots.find((chatbot) => chatbot.id === id);
      },
    }),
    {
      name: "chatbot-storage",
    }
  )
);
