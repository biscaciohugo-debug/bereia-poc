"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Onboarding, useOnboarding } from "./Onboarding";

type Message = {
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down" | null;
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
  const { show: showOnboarding, ready, dismiss } = useOnboarding();

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

      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.error ? `⚠️ ${data.error}` : data.reply,
          feedback: null,
        },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "⚠️ Não consegui me conectar agora. Tente novamente.",
          feedback: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(index: number, vote: "up" | "down") {
    const question = messages[index - 1]?.content ?? "";
    const answer = messages[index].content;

    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, feedback: vote } : m))
    );

    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, vote }),
    });
  }

  if (!ready) return null;

  return (
    <>
      {showOnboarding && <Onboarding onDone={dismiss} />}

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
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    className="self-end max-w-[85%] bg-[var(--ink)] text-[var(--paper)] rounded-2xl rounded-br-sm px-4 py-3 text-sm whitespace-pre-wrap"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="self-start max-w-[90%]">
                    <div className="bg-white border border-[var(--line)] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>

                    {m.feedback === null && (
                      <div className="flex gap-2 mt-1.5 ml-1">
                        <span className="text-[10px] text-[var(--ink-soft)] self-center">
                          Essa resposta foi útil?
                        </span>
                        <button
                          onClick={() => sendFeedback(i, "up")}
                          className="text-sm hover:scale-110 transition-transform"
                          title="Boa resposta"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => sendFeedback(i, "down")}
                          className="text-sm hover:scale-110 transition-transform"
                          title="Resposta ruim"
                        >
                          👎
                        </button>
                      </div>
                    )}
                    {m.feedback === "up" && (
                      <p className="text-[10px] text-[var(--ink-soft)] mt-1.5 ml-1">
                        Obrigado pelo feedback! 🙏
                      </p>
                    )}
                    {m.feedback === "down" && (
                      <p className="text-[10px] text-[var(--ink-soft)] mt-1.5 ml-1">
                        Obrigado! Vamos melhorar. 🙏
                      </p>
                    )}
                  </div>
                )
              )}
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
              className="flex-1 border border-[var(--line)] rounded-full px-4 py-3 text-sm bg-white focus:outline-none focus:border-[var(--gold)]"
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
    </>
  );
}
