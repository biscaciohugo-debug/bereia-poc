import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { DEVOTIONAL_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

// TODO (pós-POC): cachear o devocional do dia (ex: tabela `devotionals` no
// Supabase, chave = data) em vez de gerar a cada request. Por enquanto,
// para a POC, geramos sob demanda — simples e suficiente para validar.

export async function GET() {
  try {
    const today = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `${DEVOTIONAL_PROMPT}\n\nData de hoje: ${today}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const devotional = textBlock && "text" in textBlock ? textBlock.text : "";

    return NextResponse.json({ devotional, date: today });
  } catch (err) {
    console.error("Erro no devocional:", err);
    return NextResponse.json(
      { error: "Erro ao gerar devocional." },
      { status: 500 }
    );
  }
}
