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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Chat with {chatbot.elderlyName}&apos;s Caregiver
              </h1>
              <p className="text-sm text-gray-600">
                Virtual assistant for medication and appointment reminders
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/form?id=${chatbot.id}`}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              Edit Configuration
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <div className="h-full bg-white shadow-sm">
          <ChatUI chatbot={chatbot} />
        </div>
      </main>
    </div>
  );
}
