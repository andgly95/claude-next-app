"use client";
import React, { useState, useRef, useEffect } from "react";
import { Message, ChatResponse } from "@/types";
import { Send, User, Bot } from "lucide-react";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data: ChatResponse = await response.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.content[0].text },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-purple-700 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Claude 3.5 Sonnet Chatbot</h1>
      </header>
      <main className="flex-grow overflow-hidden flex flex-col p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.role === "user" ? (
                    <User className="w-4 h-4 mr-2" />
                  ) : (
                    <Bot className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">
                    {message.role === "user" ? "You" : "Claude"}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
