"use client";

import { ChatbotConfig } from "@/lib/types/types";
import { useChatbotStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardGridProps {
  chatbots: ChatbotConfig[];
}

export default function DashboardGrid({ chatbots }: DashboardGridProps) {
  const router = useRouter();
  const deleteChatbot = useChatbotStore((state) => state.deleteChatbot);

  const getNextReminder = (chatbot: ChatbotConfig) => {
    if (chatbot.medications.length === 0 && chatbot.appointments.length === 0) {
      return "No reminders set";
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Check today's medications
    const todayMeds = chatbot.medications
      .filter((med) => {
        const medTime = new Date(`${today}T${med.time}`);
        return medTime > now;
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    if (todayMeds.length > 0) {
      return `Medication: ${todayMeds[0].name} at ${todayMeds[0].time}`;
    }

    // Check upcoming appointments
    const futureAppointments = chatbot.appointments
      .filter((apt) => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate > now;
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );

    if (futureAppointments.length > 0) {
      const apt = futureAppointments[0];
      return `Appointment: ${apt.title} on ${apt.date} at ${apt.time}`;
    }

    return "No upcoming reminders";
  };

  const handleDelete = (id: string, elderlyName: string) => {
    if (
      confirm(`Are you sure you want to delete the chatbot for ${elderlyName}?`)
    ) {
      deleteChatbot(id);
    }
  };

  if (chatbots.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No chatbots configured
        </h3>
        <p className="text-gray-600 mb-4">
          Create your first virtual caregiver to get started.
        </p>
        <Link
          href="/form"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
        >
          Create Chatbot
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {chatbots.map((chatbot) => (
        <div
          key={chatbot.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {chatbot.elderlyName}
            </h3>
            <div className="flex space-x-2">
              <Link
                href={`/form?id=${chatbot.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(chatbot.id, chatbot.elderlyName)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Medications:</span>{" "}
              {chatbot.medications.length}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Appointments:</span>{" "}
              {chatbot.appointments.length}
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Next Reminder:
            </div>
            <div className="text-sm text-gray-600">
              {getNextReminder(chatbot)}
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              href={`/chatbot?id=${chatbot.id}`}
              className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Open Chat
            </Link>
          </div>

          {chatbot.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium mb-1">
                Notes:
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {chatbot.notes}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
