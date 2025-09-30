import { ChatbotConfig } from "../types/types";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatbotAPIResponse {
  response: string;
  error?: string;
}

export interface APIConfig {
  url: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class ChatbotAPI {
  private config: APIConfig;

  constructor() {
    this.config = {
      url: "",
      apiKey: "",
      model: "gpt-3.5-turbo",
      maxTokens: 150,
      temperature: 0.7,
    };
  }

  private createSystemPrompt(chatbot: ChatbotConfig): string {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tasksText =
      chatbot.tasks.length > 0
        ? chatbot.tasks
            .map(
              (task) =>
                `- ${task.name} at ${task.time}${
                  task.description ? ` (${task.description})` : ""
                }${task.priority === "high" ? " [IMPORTANT]" : ""}`
            )
            .join("\n")
        : "No tasks scheduled";

    return `You are a caring virtual caregiver assistant named ${chatbot.chatbotName}.

CURRENT CONTEXT:
- Current time: ${currentTime}
- Current date: ${currentDate}
- Assistant name: ${chatbot.chatbotName}

DAILY TASKS SCHEDULE:
${tasksText}

ADDITIONAL NOTES:
${chatbot.notes || "No additional notes"}

INSTRUCTIONS:
- Be warm, caring, and patient in your responses
- Keep responses concise (1-3 sentences unless asked for details)
- Prioritize task reminders and important activities
- Provide helpful health and wellness advice when appropriate
- If asked about tasks or schedule, refer to the specific information provided above
- Use emojis sparingly and only when appropriate
- Be encouraging about completing tasks on time
- For high priority tasks marked as [IMPORTANT], emphasize their importance

Remember: You are a supportive companion focused on helping maintain a healthy daily routine and providing friendly conversation.`;
  }

  async generateResponse(
    userMessage: string,
    chatbot: ChatbotConfig
  ): Promise<ChatbotAPIResponse> {
    try {
      if (!this.config.apiKey || !this.config.url) {
        return {
          response: `Hello! I'm having trouble connecting to my knowledge base right now. Please make sure the chatbot API is properly configured, or try again later.`,
          error: "API configuration missing",
        };
      }

      const messages: ChatMessage[] = [
        {
          role: "system",
          content: this.createSystemPrompt(chatbot),
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      const response = await this.callExternalAPI(messages);
      return response;
    } catch (error) {
      console.error("Chatbot API error:", error);
      return {
        response: `I'm sorry, I'm having trouble processing your message right now. Please try again in a moment.`,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async callExternalAPI(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    try {
      // OpenAI API format
      if (this.config.url.includes("openai.com")) {
        return await this.callOpenAI(messages);
      }

      // Anthropic Claude API format
      if (this.config.url.includes("anthropic.com")) {
        return await this.callAnthropic(messages);
      }

      // Cohere API format
      if (this.config.url.includes("cohere.ai")) {
        return await this.callCohere(messages);
      }

      // Hugging Face API format
      if (this.config.url.includes("huggingface.co")) {
        return await this.callHuggingFace(messages);
      }

      // Generic/Custom API format
      return await this.callGenericAPI(messages);
    } catch (error) {
      throw new Error(
        `API call failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async callOpenAI(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      response: data.choices[0]?.message?.content || "No response generated",
    };
  }

  private async callAnthropic(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        system: systemMessage?.content,
        messages: userMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Anthropic API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      response: data.content[0]?.text || "No response generated",
    };
  }

  private async callCohere(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    const lastMessage = messages[messages.length - 1];
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n\n");

    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Cohere API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      response: data.generations[0]?.text || "No response generated",
    };
  }

  private async callHuggingFace(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    const prompt = messages.map((m) => m.content).join(" ");

    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: this.config.maxTokens,
          temperature: this.config.temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Hugging Face API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      response: data[0]?.generated_text || "No response generated",
    };
  }

  private async callGenericAPI(
    messages: ChatMessage[]
  ): Promise<ChatbotAPIResponse> {
    const response = await fetch(this.config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Try to extract response from common response formats
    const responseText =
      data.response ||
      data.choices?.[0]?.message?.content ||
      data.content?.[0]?.text ||
      data.generated_text ||
      data.text ||
      "No response generated";

    return { response: responseText };
  }

  // Test API connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.config.apiKey || !this.config.url) {
        return { success: false, error: "API configuration missing" };
      }

      // Simple test message
      const testMessage: ChatMessage[] = [
        {
          role: "user",
          content: 'Hello, can you respond with "API connection successful"?',
        },
      ];

      const response = await this.callExternalAPI(testMessage);
      return { success: !response.error };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Connection test failed",
      };
    }
  }
}

export const chatbotAPI = new ChatbotAPI();
