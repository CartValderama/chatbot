export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Medication {
  id: string;
  name: string;
  time: string;
  dosage?: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
}

export interface ChatbotConfig {
  id: string;
  elderlyName: string;
  medications: Medication[];
  appointments: Appointment[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}