"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"prescription" | "reminder" | "manage">("prescription");

  // Users list
  const [users, setUsers] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Prescription form
  const [prescriptionForm, setPrescriptionForm] = useState({
    userId: "",
    doctorId: "",
    medicineId: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    instructions: "",
  });

  // Reminder form
  const [reminderForm, setReminderForm] = useState({
    userId: "",
    prescriptionId: "",
    reminderDateTime: "",
    notes: "",
  });

  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [allReminders, setAllReminders] = useState<any[]>([]);
  const [editingReminder, setEditingReminder] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [usersRes, medsRes, docsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/medicines"),
        fetch("/api/admin/doctors"),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (medsRes.ok) setMedicines(await medsRes.json());
      if (docsRes.ok) setDoctors(await docsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPrescriptions = async (userId: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/medications/prescriptions?userId=${userId}&activeOnly=false`);
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const fetchAllReminders = async (userId?: string) => {
    try {
      const url = userId
        ? `/api/medications/reminders?userId=${userId}&activeOnly=false`
        : `/api/medications/reminders?userId=1&activeOnly=false`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAllReminders(data.reminders || []);
      }
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    try {
      const res = await fetch(`/api/medications/reminders?reminderId=${reminderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ Reminder deleted successfully!");
        fetchAllReminders();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to delete reminder");
      }
    } catch (error) {
      setMessage("❌ Error deleting reminder");
    }
  };

  const handleUpdateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder) return;

    try {
      const res = await fetch("/api/medications/reminders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminderId: editingReminder.id,
          reminderDateTime: editingReminder.reminderDateTime,
          notes: editingReminder.notes,
        }),
      });

      if (res.ok) {
        setMessage("✅ Reminder updated successfully!");
        setEditingReminder(null);
        fetchAllReminders();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update reminder");
      }
    } catch (error) {
      setMessage("❌ Error updating reminder");
    }
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medications/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionForm),
      });

      if (res.ok) {
        setMessage("✅ Prescription added successfully!");
        setPrescriptionForm({
          userId: prescriptionForm.userId,
          doctorId: "",
          medicineId: "",
          dosage: "",
          frequency: "",
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          instructions: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to add prescription");
      }
    } catch (error) {
      setMessage("❌ Error adding prescription");
    }
  };

  const handleReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/medications/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderForm),
      });

      if (res.ok) {
        setMessage("✅ Reminder added successfully!");
        setReminderForm({
          userId: reminderForm.userId,
          prescriptionId: "",
          reminderDateTime: "",
          notes: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to add reminder");
      }
    } catch (error) {
      setMessage("❌ Error adding reminder");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Panel - Medication Management
          </h2>
          <p className="text-gray-600">
            Add prescriptions and schedule medication reminders for patients
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab("prescription")}
            variant={activeTab === "prescription" ? "default" : "outline"}
          >
            Add Prescription
          </Button>
          <Button
            onClick={() => setActiveTab("reminder")}
            variant={activeTab === "reminder" ? "default" : "outline"}
          >
            Schedule Reminder
          </Button>
          <Button
            onClick={() => {
              setActiveTab("manage");
              fetchAllReminders();
            }}
            variant={activeTab === "manage" ? "default" : "outline"}
          >
            Manage Reminders
          </Button>
        </div>

        {/* Prescription Form */}
        {activeTab === "prescription" && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">New Prescription</h3>
            <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Patient</Label>
                  <Select
                    value={prescriptionForm.userId}
                    onValueChange={(value) =>
                      setPrescriptionForm({ ...prescriptionForm, userId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.User_ID} value={u.User_ID.toString()}>
                          {u.First_Name} {u.Last_Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Doctor</Label>
                  <Select
                    value={prescriptionForm.doctorId}
                    onValueChange={(value) =>
                      setPrescriptionForm({ ...prescriptionForm, doctorId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem key={d.Doctor_ID} value={d.Doctor_ID.toString()}>
                          {d.Name} - {d.Speciality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Medicine</Label>
                  <Select
                    value={prescriptionForm.medicineId}
                    onValueChange={(value) =>
                      setPrescriptionForm({ ...prescriptionForm, medicineId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map((m) => (
                        <SelectItem key={m.Medicine_ID} value={m.Medicine_ID.toString()}>
                          {m.Name} ({m.Type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Dosage</Label>
                  <Input
                    value={prescriptionForm.dosage}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })
                    }
                    placeholder="e.g., 10mg"
                    required
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Input
                    value={prescriptionForm.frequency}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })
                    }
                    placeholder="e.g., Once daily, Twice daily"
                    required
                  />
                </div>

                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={prescriptionForm.startDate}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>End Date (optional)</Label>
                  <Input
                    type="date"
                    value={prescriptionForm.endDate}
                    onChange={(e) =>
                      setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Instructions</Label>
                <Textarea
                  value={prescriptionForm.instructions}
                  onChange={(e) =>
                    setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })
                  }
                  placeholder="Special instructions for taking this medication"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Prescription
              </Button>
            </form>
          </Card>
        )}

        {/* Reminder Form */}
        {activeTab === "reminder" && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Schedule Reminder</h3>
            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Patient</Label>
                  <Select
                    value={reminderForm.userId}
                    onValueChange={(value) => {
                      setReminderForm({ ...reminderForm, userId: value, prescriptionId: "" });
                      fetchPrescriptions(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.User_ID} value={u.User_ID.toString()}>
                          {u.First_Name} {u.Last_Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Prescription</Label>
                  <Select
                    value={reminderForm.prescriptionId}
                    onValueChange={(value) =>
                      setReminderForm({ ...reminderForm, prescriptionId: value })
                    }
                    disabled={!reminderForm.userId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select prescription" />
                    </SelectTrigger>
                    <SelectContent>
                      {prescriptions.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.medicineName} - {p.dosage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={reminderForm.reminderDateTime}
                    onChange={(e) =>
                      setReminderForm({ ...reminderForm, reminderDateTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Notes (optional)</Label>
                <Textarea
                  value={reminderForm.notes}
                  onChange={(e) =>
                    setReminderForm({ ...reminderForm, notes: e.target.value })
                  }
                  placeholder="Additional notes for this reminder"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Schedule Reminder
              </Button>
            </form>
          </Card>
        )}

        {/* Manage Reminders */}
        {activeTab === "manage" && (
          <div className="space-y-6">
            {editingReminder ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Edit Reminder</h3>
                <form onSubmit={handleUpdateReminder} className="space-y-4">
                  <div>
                    <Label>Medicine: {editingReminder.medicineName}</Label>
                  </div>
                  <div>
                    <Label>Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={editingReminder.reminderDateTime?.slice(0, 16)}
                      onChange={(e) =>
                        setEditingReminder({
                          ...editingReminder,
                          reminderDateTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={editingReminder.notes || ""}
                      onChange={(e) =>
                        setEditingReminder({
                          ...editingReminder,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingReminder(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">All Reminders</h3>
                {allReminders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reminders found</p>
                ) : (
                  <div className="space-y-3">
                    {allReminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="border rounded-lg p-4 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {reminder.medicineName} - {reminder.dosage}
                          </h4>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Time:</span>{" "}
                            {new Date(reminder.reminderDateTime).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span>{" "}
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                reminder.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : reminder.status === "Acknowledged"
                                  ? "bg-green-100 text-green-800"
                                  : reminder.status === "Missed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {reminder.status}
                            </span>
                          </p>
                          {reminder.notes && (
                            <p className="text-sm text-gray-500 mt-1">{reminder.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingReminder(reminder)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteReminder(reminder.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
