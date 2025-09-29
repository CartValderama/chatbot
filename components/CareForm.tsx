"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatbotStore } from "@/lib/store";
import { Medication, Appointment } from "@/lib/types/types";

export default function CareForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const { addChatbot, updateChatbot, getChatbot } = useChatbotStore();
  const existingChatbot = editId ? getChatbot(editId) : null;

  // Form state
  const [elderlyName, setElderlyName] = useState(existingChatbot?.elderlyName || "");
  const [medications, setMedications] = useState<Medication[]>(existingChatbot?.medications || []);
  const [appointments, setAppointments] = useState<Appointment[]>(existingChatbot?.appointments || []);
  const [notes, setNotes] = useState(existingChatbot?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMedication = () => {
    const newMedication: Medication = {
      id: crypto.randomUUID(),
      name: "",
      time: "",
      dosage: "",
    };
    setMedications([...medications, newMedication]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const addAppointment = () => {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      title: "",
      date: "",
      time: "",
      location: "",
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (index: number, field: keyof Appointment, value: string) => {
    const updated = appointments.map((apt, i) =>
      i === index ? { ...apt, [field]: value } : apt
    );
    setAppointments(updated);
  };

  const removeAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validMedications = medications.filter(
        (med) => med.name.trim() && med.time.trim()
      );
      const validAppointments = appointments.filter(
        (apt) => apt.title.trim() && apt.date.trim() && apt.time.trim()
      );

      const chatbotData = {
        elderlyName: elderlyName.trim(),
        medications: validMedications,
        appointments: validAppointments,
        notes: notes.trim(),
      };

      if (editId) {
        updateChatbot(editId, chatbotData);
      } else {
        addChatbot(chatbotData);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving chatbot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = elderlyName.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editId ? "Edit Chatbot Configuration" : "Create New Chatbot"}
            </h1>
            <p className="text-gray-600 mt-2">
              Configure a virtual caregiver for an elderly user with
              personalized reminders and assistance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="elderlyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Elderly Person&apos;s Name *
              </label>
              <input
                type="text"
                id="elderlyName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={elderlyName}
                onChange={(e) => setElderlyName(e.target.value)}
                placeholder="Enter the elderly person's name"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Medications
                </label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Medication
                </button>
              </div>
              <div className="space-y-3">
                {medications.map((medication, index) => (
                  <div
                    key={medication.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-md"
                  >
                    <input
                      type="text"
                      placeholder="Medication name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={medication.name}
                      onChange={(e) =>
                        updateMedication(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="time"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={medication.time}
                      onChange={(e) =>
                        updateMedication(index, "time", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Dosage (optional)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={medication.dosage || ""}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {medications.length === 0 && (
                  <p className="text-gray-500 text-sm italic">
                    No medications added yet. Click &quot;Add Medication&quot; to get started.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Appointments
                </label>
                <button
                  type="button"
                  onClick={addAppointment}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Appointment
                </button>
              </div>
              <div className="space-y-3">
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-md"
                  >
                    <input
                      type="text"
                      placeholder="Appointment title"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={appointment.title}
                      onChange={(e) =>
                        updateAppointment(index, "title", e.target.value)
                      }
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={appointment.date}
                      onChange={(e) =>
                        updateAppointment(index, "date", e.target.value)
                      }
                    />
                    <input
                      type="time"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={appointment.time}
                      onChange={(e) =>
                        updateAppointment(index, "time", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Location (optional)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={appointment.location || ""}
                      onChange={(e) =>
                        updateAppointment(index, "location", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeAppointment(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-gray-500 text-sm italic">
                    No appointments added yet. Click &quot;Add Appointment&quot; to get started.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information, preferences, or special instructions..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : editId
                  ? "Update Chatbot"
                  : "Create Chatbot"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}