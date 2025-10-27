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

  const isPatient = user.userType === 'Elder';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isPatient ? 'My Medications' : 'Medication Schedule'}
          </h2>
          <p className="text-gray-600 px-0.5 max-w-xl">
            {isPatient
              ? `Hello, ${user.name}! Here are your medication reminders and prescriptions. You can view them here (read-only) or chat with your assistant for help.`
              : `Hello, ${user.name}! View medication reminders and manage prescriptions. Use the Admin Panel to add or modify patient medications.`
            }
          </p>
        </div>

        <MedicationDashboard userId={user.id} />
      </main>

      {/* Floating notification system - only for patients */}
      {isPatient && <MedicationNotifications userId={user.id} />}
    </div>
  );
}
