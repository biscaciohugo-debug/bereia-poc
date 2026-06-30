"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";

export default function DevocionalPage() {
  const [devotional, setDevotional] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/devotional")
      .then((r) => r.json())
      .then((data) => {
        setDevotional(data.devotional ?? null);
        setDate(data.date ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <Header active="devocional" />
      <div className="max-w-2xl mx-auto px-5 py-12">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--gold-deep)] mb-2">
          {date || "Hoje"}
        </p>
        <h1 className="font-[var(--font-display)] text-3xl mb-8">
          Devocional do dia
        </h1>

        {loading && (
          <p className="text-[var(--ink-soft)] text-sm">
            Preparando o devocional de hoje…
          </p>
        )}

        {!loading && devotional && (
          <div className="bg-white border border-[var(--line)] rounded-2xl px-6 py-8 whitespace-pre-wrap leading-relaxed text-[var(--ink)]">
            {devotional}
          </div>
        )}

        {!loading && !devotional && (
          <p className="text-[var(--ink-soft)] text-sm">
            Não foi possível carregar o devocional agora. Tente recarregar a
            página.
          </p>
        )}
      </div>
    </main>
  );
}
