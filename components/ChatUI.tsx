"use client";

import { useState, useEffect, useRef } from "react";
import { useChatbotStore } from "@/lib/store";
import { ChatbotConfig, Message } from "@/lib/types/types";

interface ChatUIProps {
  chatbot: ChatbotConfig;
}

export default function ChatUI({ chatbot }: ChatUIProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState<"unknown" | "connected" | "error">(
    "unknown"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const { addMessage, getMessages } = useChatbotStore();
  const messages = getMessages(chatbot.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/chat", { method: "GET" });
        const data = await response.json();
        setApiStatus(data.status === "healthy" ? "connected" : "error");
      } catch (error) {
        setApiStatus("error");
      }
    };

    checkApiStatus();
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          chatbot: chatbot,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Check if there was an API error but still got a response
      if (data.error) {
        console.warn("Chatbot API warning:", data.error);
      }

      return (
        data.response ||
        `I'm sorry, ${chatbot.elderlyName}, I didn't receive a proper response. Please try asking your question again.`
      );
    } catch (error) {
      console.error("Error calling chat API:", error);
      // Enhanced fallback response
      return `I'm sorry, ${chatbot.elderlyName}, I'm having trouble connecting to my knowledge base right now. This might be due to network issues or API configuration. Please try again in a moment, or contact your caregiver for assistance.`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message
    addMessage(chatbot.id, {
      content: message.trim(),
      sender: "user",
    });

    const userMessage = message.trim();
    setMessage("");
    setIsTyping(true);

    try {
      // Call the API to get bot response
      const botResponse = await generateBotResponse(userMessage);

      // Add a small delay for better UX (simulating thinking time)
      setTimeout(() => {
        addMessage(chatbot.id, {
          content: botResponse,
          sender: "bot",
        });
        setIsTyping(false);
      }, 500 + Math.random() * 1000);
    } catch (error) {
      console.error("Error generating bot response:", error);
      setTimeout(() => {
        addMessage(chatbot.id, {
          content: `I'm sorry, ${chatbot.elderlyName}, I'm having trouble responding right now. Please try again in a moment.`,
          sender: "bot",
        });
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* API Status Indicator */}
      {apiStatus === "error" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg m-4 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-500 text-xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-lg text-yellow-800 font-medium">
                Connection issue - Using simplified responses for now.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-xl p-8 max-w-2xl mx-auto border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Hello, {chatbot.elderlyName}!
              </h3>
              <p className="text-xl text-blue-800 leading-relaxed">
                I&apos;m your virtual caregiver assistant. I can help you with:
                <br /><br />
                • Medication reminders<br />
                • Appointment information<br />
                • Daily routine assistance<br /><br />
                Feel free to ask me anything!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-6 py-4 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900 border border-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap text-lg leading-relaxed">{msg.content}</p>
              <p
                className={`text-sm mt-2 ${
                  msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl px-6 py-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-600">Typing</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your message here...`}
              className="w-full resize-none border-2 border-gray-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={1}
              style={{ minHeight: "60px", maxHeight: "140px" }}
            />
          </div>

          {/* Voice Input Button */}
          {typeof window !== "undefined" &&
            ((window as any).webkitSpeechRecognition ||
              (window as any).SpeechRecognition) && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`px-5 py-4 rounded-xl text-lg font-medium transition-colors min-w-[80px] ${
                  isListening
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-gray-300"
                }`}
              >
                {isListening ? "⏹️ Stop" : "🎤 Voice"}
              </button>
            )}

          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
