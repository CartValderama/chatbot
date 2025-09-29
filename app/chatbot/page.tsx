"use client";

import { useAuth } from "@/lib/auth-context";
import { useChatbotStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatUI from "@/components/ChatUI";
import Link from "next/link";

export default function ChatbotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatbotId = searchParams.get("id");

  const getChatbot = useChatbotStore((state) => state.getChatbot);
  const [chatbot, setChatbot] = useState(
    chatbotId ? getChatbot(chatbotId) : null
  );

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!chatbotId) {
      router.push("/dashboard");
      return;
    }

    const foundChatbot = getChatbot(chatbotId);
    if (!foundChatbot) {
      router.push("/dashboard");
      return;
    }

    setChatbot(foundChatbot);
  }, [user, chatbotId, router, getChatbot]);

  if (!user || !chatbot) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-gray-900 text-lg font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chat with {chatbot.elderlyName}&apos;s Caregiver
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Your virtual assistant for medication and appointment reminders
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/form?id=${chatbot.id}`}
              className="text-blue-600 hover:text-blue-800 text-lg font-medium px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Edit Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-sm" style={{ height: 'calc(100vh - 140px)' }}>
          <ChatUI chatbot={chatbot} />
        </div>
      </main>
    </div>
  );
}
