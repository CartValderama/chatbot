import { ChatbotConfig, Message } from "../types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
const BACKEND_AVAILABLE = false; // Set to true when backend is ready
// ===== END TEMPORARY SECTION =====

// Function to get the user-specific auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("authToken"); // token set after login
}

// Helper to build headers including the Authorization token
function getHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const chatbotService = {
  async getAll(): Promise<ChatbotConfig[]> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) throw new Error("NO_BACKEND"); // Signal to use local storage
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/chatbots`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch chatbots");
    return response.json();
  },

  async get(id: string): Promise<ChatbotConfig> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) throw new Error("NO_BACKEND"); // Signal to use local storage
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch chatbot");
    return response.json();
  },

  async add(chatbot: Omit<ChatbotConfig, "id">): Promise<ChatbotConfig> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) {
      // Generate ID locally when no backend
      return { ...chatbot, id: crypto.randomUUID() };
    }
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/chatbots`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(chatbot),
    });
    if (!response.ok) throw new Error("Failed to add chatbot");
    return response.json();
  },

  async update(
    id: string,
    updates: Partial<ChatbotConfig>
  ): Promise<ChatbotConfig> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) throw new Error("NO_BACKEND"); // Signal to merge locally
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update chatbot");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) return; // Signal success, store will handle deletion
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/chatbots/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete chatbot");
  },
};

export const messageService = {
  async getMessages(chatbotId: string): Promise<Message[]> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) throw new Error("NO_BACKEND"); // Signal to use local storage
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/messages/${chatbotId}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  },

  async addMessage(
    chatbotId: string,
    message: Omit<Message, "id" | "timestamp">
  ): Promise<Message> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) {
      // Generate ID and timestamp locally when no backend
      return {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
    }
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/messages/${chatbotId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error("Failed to add message");
    return response.json();
  },

  async clearMessages(chatbotId: string): Promise<void> {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    if (!BACKEND_AVAILABLE) return; // Signal success, store will handle clearing
    // ===== END TEMPORARY SECTION =====

    const response = await fetch(`${API_BASE_URL}/messages/${chatbotId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to clear messages");
  },
};
