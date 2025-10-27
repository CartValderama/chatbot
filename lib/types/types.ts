// User (Elder) types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
  userType: 'Elder' | 'Doctor';
  phone?: string;
  birthDate?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  primaryDoctorId?: number;
  speciality?: string; // For doctors
  hospital?: string; // For doctors
}

// Medicine types
export interface Medicine {
  id: string;
  name: string;
  type?: string;
  dosage: string;
  sideEffects?: string;
  instructions?: string;
}

// Prescription types
export interface Prescription {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  doctorName?: string;
}

// Medication Reminder types
export interface MedicationReminder {
  id: string;
  userId: string;
  prescriptionId: string;
  medicineName: string;
  dosage: string;
  reminderDateTime: string;
  status: 'Pending' | 'Sent' | 'Acknowledged' | 'Missed';
  notes?: string;
}

// Chat Message types
export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  intent?: string;
}

// Legacy types for backward compatibility (can be removed later)
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
