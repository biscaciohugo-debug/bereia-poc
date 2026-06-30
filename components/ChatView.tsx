"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const EXEMPLOS = [
  "O que significa João 3:16?",
  "Como lidar com a ansiedade segundo a Bíblia?",
  "Quem foi o rei Davi?",
  "O que a Bíblia diz sobre perdão?",
];

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (data.error) {
        setMessages([
          ...next,
          { role: "assistant", content: `⚠️ ${data.error}` },
        ]);
      } else {
        setMessages([...next, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "⚠️ Não consegui me conectar agora. Tente novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 py-8">
          {messages.length === 0 && (
            <div className="py-10">
              <h1 className="font-[var(--font-display)] text-3xl mb-3 leading-snug">
                Sobre o que da Bíblia
                <br />
                você quer entender hoje?
              </h1>
              <p className="text-[var(--ink-soft)] text-sm mb-8 max-w-md">
                Pergunte sobre um versículo, um personagem, um tema ou peça
                ajuda para aplicar a Bíblia na sua vida.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {EXEMPLOS.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => sendMessage(ex)}
                    className="text-left text-sm border border-[var(--line)] rounded-lg px-4 py-3 hover:border-[var(--gold)] hover:bg-white transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "self-end max-w-[85%] bg-[var(--ink)] text-[var(--paper)] rounded-2xl rounded-br-sm px-4 py-3 text-sm whitespace-pre-wrap"
                    : "self-start max-w-[90%] bg-white border border-[var(--line)] rounded-2xl rounded-bl-sm px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start text-[var(--ink-soft)] text-sm px-4 py-2">
                Consultando as Escrituras…
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-[var(--paper)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="max-w-3xl mx-auto px-5 py-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo sobre a Bíblia…"
            className="flex-1 border border-[var(--line)] rounded-full px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--gold)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[var(--ink)] text-[var(--paper)] rounded-full px-5 py-3 text-sm font-medium disabled:opacity-40 hover:bg-[var(--gold-deep)] transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
