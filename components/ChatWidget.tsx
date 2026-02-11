"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, LogIn } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function ChatWidget() {
  const { isSignedIn, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Load Chat History when opened
  useEffect(() => {
    if (isOpen && isSignedIn) {
      setIsLoading(true);
      fetch("/api/chat/history")
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen, isSignedIn]);

  const handleSend = async () => {
    if (!input.trim() || !isSignedIn) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to connect to AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold text-sm">ASTU Assistant</span>
              <span className="text-[10px] opacity-80">Online | RAG Powered</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 rounded-full p-1 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 text-black">
            {!isSignedIn ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <LogIn className="text-gray-400" size={40} />
                <p className="text-sm text-gray-600">Please sign in to chat with the ASTU AI.</p>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Sign In Now</button>
                </SignInButton>
              </div>
            ) : (
              <>
                {messages.length === 0 && !isLoading && (
                  <p className="text-gray-400 text-center text-xs mt-10">How can I help you today?</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      m.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none shadow-sm"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border p-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="animate-spin text-indigo-600" size={18} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          {isSignedIn && (
            <div className="p-3 border-t bg-white flex gap-2">
              <input
                className="flex-1 text-sm outline-none bg-gray-100 p-2.5 rounded-xl text-black border border-transparent focus:border-indigo-300 transition-all"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 transition-colors shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-indigo-700 transition-all group"
        >
          <MessageCircle size={30} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}