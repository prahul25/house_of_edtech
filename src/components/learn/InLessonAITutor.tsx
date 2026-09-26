"use client";

import { useState } from "react";
import { askTutorAIAction } from "@/lib/actions/ai";
import { Bot, User, X, MessageSquare, Send, Brain } from "lucide-react";

export default function InLessonAITutor({
  lessonTitle,
  lessonContent,
}: {
  lessonTitle: string;
  lessonContent: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    {
      role: "ai",
      text: `Hello! I'm your lesson assistant for **${lessonTitle}**. Ask me any technical clarification about the concepts or code snippets.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    const res = await askTutorAIAction(lessonTitle, lessonContent, query);
    setLoading(false);

    if (res.success && res.answer) {
      setMessages((prev) => [...prev, { role: "ai", text: res.answer }]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I couldn't process that query right now. Please try rephrasing your question.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm sm:max-w-md">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-xs shadow-2xl transition-all transform hover:scale-105 cursor-pointer backdrop-blur-xl"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span>Ask In-Lesson Assistant</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col h-[480px] animate-slide-up">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Lesson Copilot</h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                  {lessonTitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[82%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none font-medium"
                      : "bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 pl-8">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-400"></span>
                <span className="text-[11px]">Analyzing lesson context...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this lesson..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
