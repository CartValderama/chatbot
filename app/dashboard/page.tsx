"use client";

import { useAuth } from "@/lib/auth-context";
import { useChatbotStore } from "@/lib/stores/chatbot-store";
import Dashboard from "@/components/dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/Header";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const chatbots = useChatbotStore((state) => state.chatbots);

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
            Your Virtual Caregivers
          </h2>
          <p className="text-gray-600 px-0.5 max-w-xl">
            Manage chatbot configurations for elderly users. Each chatbot can
            provide medication reminders, appointment alerts, and daily routine
            assistance.
          </p>
        </div>

        <Dashboard chatbots={chatbots} />
      </main>
    </div>
  );
}
