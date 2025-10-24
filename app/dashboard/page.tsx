"use client";

import { useAuth } from "@/lib/auth-context";
import MedicationDashboard from "@/components/MedicationDashboard";
import MedicationNotifications from "@/components/MedicationNotifications";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/Header";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Medication Schedule
          </h2>
          <p className="text-gray-600 px-0.5 max-w-xl">
            Hello, {user.name}! View your medication reminders and manage your prescriptions. The chatbot will notify you when it's time to take your medication.
          </p>
        </div>

        <MedicationDashboard userId={user.id} />
      </main>

      {/* Floating notification system */}
      <MedicationNotifications userId={user.id} />
    </div>
  );
}
