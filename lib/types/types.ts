export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  name: string;
  time: string;
  description?: string;
  priority?: "high" | "normal";
}

export interface ChatbotConfig {
  id: string;
  chatbotName: string;
  tasks: Task[];
  notes: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}
