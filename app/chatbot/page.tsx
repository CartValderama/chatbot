"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import ChatUI from "@/components/ChatUI";
import { Header } from "@/components/Header";

function ChatbotContent() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Create a simple medication chatbot config
  const medicationChatbot = {
    id: 'medication-assistant',
    chatbotName: 'Medication Assistant',
    tasks: [],
    notes: 'Helps with medication reminders and questions'
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Chat Interface */}
      <main className="flex-1 max-w-4xl mx-auto w-full overflow-hidden">
        <div className="h-full bg-white shadow-sm">
          <ChatUI chatbot={medicationChatbot} user={user} />
        </div>
      </main>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatbotContent />
    </Suspense>
  );
}
