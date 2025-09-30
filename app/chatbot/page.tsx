"use client";

import { useAuth } from "@/lib/auth-context";
import { useChatbotStore } from "@/lib/stores/chatbot-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ChatUI from "@/components/ChatUI";
import { Header } from "@/components/Header";

function ChatbotContent() {
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
      <Header />

      {/* Chat Interface */}
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <div className="h-full bg-white shadow-sm">
          <ChatUI chatbot={chatbot} user={user} />
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
