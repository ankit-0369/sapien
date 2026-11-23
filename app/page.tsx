"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed || isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsPending(true);

    // Simulate delayed Echo reply
    setTimeout(() => {
      const echoMessage: Message = {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: `Echo: ${trimmed}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, echoMessage]);
      setIsPending(false);
    }, 700);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
      {/* Header with Demo Mode Banner */}
      <header className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight">Sapien Assistant</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Demo mode: no AI connected
            </span>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Clear chat
            </button>
          )}
        </div>
      </header>

      {/* Message Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                💬
              </div>
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                No messages yet
              </h2>
              <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                Type a message below to test the chat UI. In this stage, messages will be echoed back locally.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.sender === "user";
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                      isUser
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {message.text}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    {message.timestamp}
                  </span>
                </div>
              );
            })
          )}

          {/* Pending indicator */}
          {isPending && (
            <div className="flex flex-col items-start">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                Echoing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form Footer */}
      <footer className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-xl border border-zinc-300 bg-white p-2 shadow-xs focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message... (Press Enter to send, Shift+Enter for newline)"
              rows={1}
              className="max-h-36 min-h-[38px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-zinc-400 focus:outline-none dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isPending}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Send
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
