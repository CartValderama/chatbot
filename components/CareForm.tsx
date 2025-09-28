"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatbotStore } from "@/lib/store";
import { ChatbotConfig, Medication, Appointment } from "@/lib/types/types";

interface FormData {
  elderlyName: string;
  medications: Medication[];
  appointments: Appointment[];
  notes: string;
}

export default function CareForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const { addChatbot, updateChatbot, getChatbot } = useChatbotStore();

  const existingChatbot = editId ? getChatbot(editId) : null;

  const form = useForm({
    defaultValues: {
      elderlyName: existingChatbot?.elderlyName || "",
      medications: existingChatbot?.medications || [],
      appointments: existingChatbot?.appointments || [],
      notes: existingChatbot?.notes || "",
    },
    onSubmit: async ({ value }) => {
      const validMedications = value.medications.filter(
        (med) => med.name.trim() && med.time.trim()
      );
      const validAppointments = value.appointments.filter(
        (apt) => apt.title.trim() && apt.date.trim() && apt.time.trim()
      );

      const chatbotData = {
        elderlyName: value.elderlyName.trim(),
        medications: validMedications,
        appointments: validAppointments,
        notes: value.notes.trim(),
      };

      if (editId) {
        updateChatbot(editId, chatbotData);
      } else {
        addChatbot(chatbotData);
      }

      router.push("/dashboard");
    },
  });

  const addMedication = () => {
    form.setFieldValue("medications", [
      ...form.getFieldValue("medications"),
      {
        id: crypto.randomUUID(),
        name: "",
        time: "",
        dosage: "",
      },
    ]);
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const medications = form.getFieldValue("medications");
    const updated = medications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    form.setFieldValue("medications", updated);
  };

  const removeMedication = (index: number) => {
    const medications = form.getFieldValue("medications");
    form.setFieldValue(
      "medications",
      medications.filter((_, i) => i !== index)
    );
  };

  const addAppointment = () => {
    form.setFieldValue("appointments", [
      ...form.getFieldValue("appointments"),
      {
        id: crypto.randomUUID(),
        title: "",
        date: "",
        time: "",
        location: "",
      },
    ]);
  };

  const updateAppointment = (
    index: number,
    field: keyof Appointment,
    value: string
  ) => {
    const appointments = form.getFieldValue("appointments");
    const updated = appointments.map((apt, i) =>
      i === index ? { ...apt, [field]: value } : apt
    );
    form.setFieldValue("appointments", updated);
  };

  const removeAppointment = (index: number) => {
    const appointments = form.getFieldValue("appointments");
    form.setFieldValue(
      "appointments",
      appointments.filter((_, i) => i !== index)
    );
  };

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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="elderlyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Elderly Person&apos;s Name *
              </label>
              <form.Field
                name="elderlyName"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Name is required" : undefined,
                }}
              >
                {(field) => (
                  <input
                    type="text"
                    id="elderlyName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter the elderly person's name"
                  />
                )}
              </form.Field>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Medications
                </label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  + Add Medication
                </button>
              </div>
              <form.Field name="medications">
                {(field) => (
                  <div className="space-y-3">
                    {field.state.value.map((medication, index) => (
                      <div
                        key={medication.id}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-md"
                      >
                        <input
                          type="text"
                          placeholder="Medication name"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={medication.name}
                          onChange={(e) =>
                            updateMedication(index, "name", e.target.value)
                          }
                        />
                        <input
                          type="time"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={medication.time}
                          onChange={(e) =>
                            updateMedication(index, "time", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Dosage (optional)"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={medication.dosage || ""}
                          onChange={(e) =>
                            updateMedication(index, "dosage", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {field.state.value.length === 0 && (
                      <p className="text-gray-500 text-sm italic">
                        No medications added yet. Click &quot;Add
                        Medication&quot; to get started.
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Appointments
                </label>
                <button
                  type="button"
                  onClick={addAppointment}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  + Add Appointment
                </button>
              </div>
              <form.Field name="appointments">
                {(field) => (
                  <div className="space-y-3">
                    {field.state.value.map((appointment, index) => (
                      <div
                        key={appointment.id}
                        className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-md"
                      >
                        <input
                          type="text"
                          placeholder="Appointment title"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={appointment.title}
                          onChange={(e) =>
                            updateAppointment(index, "title", e.target.value)
                          }
                        />
                        <input
                          type="date"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={appointment.date}
                          onChange={(e) =>
                            updateAppointment(index, "date", e.target.value)
                          }
                        />
                        <input
                          type="time"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={appointment.time}
                          onChange={(e) =>
                            updateAppointment(index, "time", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Location (optional)"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={appointment.location || ""}
                          onChange={(e) =>
                            updateAppointment(index, "location", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeAppointment(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {field.state.value.length === 0 && (
                      <p className="text-gray-500 text-sm italic">
                        No appointments added yet. Click &quot;Add
                        Appointment&quot; to get started.
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes
              </label>
              <form.Field name="notes">
                {(field) => (
                  <textarea
                    id="notes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Any additional information, preferences, or special instructions..."
                  />
                )}
              </form.Field>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editId
                      ? "Update Chatbot"
                      : "Create Chatbot"}
                  </button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
