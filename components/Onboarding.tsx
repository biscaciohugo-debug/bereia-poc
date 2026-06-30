"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "bereia_onboarded";

const FEATURES = [
  {
    icon: "✦",
    title: "Chat bíblico inteligente",
    desc: "Pergunte qualquer coisa sobre a Bíblia e receba respostas com contexto histórico, explicação e aplicação prática.",
  },
  {
    icon: "☀",
    title: "Devocional diário",
    desc: "Um devocional novo gerado especialmente para você todos os dias.",
  },
  {
    icon: "✶",
    title: "Para todo tipo de cristão",
    desc: "Seja você um novo convertido, líder de célula, professor de EBD ou pastor — o Bereia se adapta à sua necessidade.",
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  function handleStart() {
    localStorage.setItem(STORAGE_KEY, "1");
    onDone();
  }

  return (
    <div className="fixed inset-0 bg-[var(--paper)] z-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--ink)] flex items-center justify-center mb-6">
          <span className="text-[var(--gold)] text-3xl font-bold font-[var(--font-display)]">B</span>
        </div>

        <h1 className="font-[var(--font-display)] text-4xl mb-2">Bereia</h1>
        <p className="text-[var(--ink-soft)] text-sm mb-10 max-w-xs">
          Seu assistente de estudo bíblico com inteligência artificial
        </p>

        <div className="w-full flex flex-col gap-4 mb-10 text-left">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 items-start bg-white border border-[var(--line)] rounded-xl px-4 py-4">
              <span className="text-[var(--gold)] text-xl mt-0.5">{f.icon}</span>
              <div>
                <p className="font-medium text-sm mb-0.5">{f.title}</p>
                <p className="text-[var(--ink-soft)] text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-[var(--ink)] text-[var(--paper)] rounded-full py-4 text-sm font-medium hover:bg-[var(--gold-deep)] transition-colors"
        >
          Começar a estudar
        </button>

        <p className="text-[10px] text-[var(--ink-soft)] mt-4 max-w-xs">
          Projeto em fase beta. As respostas são geradas por IA e não substituem orientação pastoral ou teológica profissional.
        </p>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    setShow(!done);
    setReady(true);
  }, []);

  return { show, ready, dismiss: () => setShow(false) };
}
