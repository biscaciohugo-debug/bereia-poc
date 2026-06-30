import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { BIBLE_ASSISTANT_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma mensagem enviada." },
        { status: 400 }
      );
    }

    // TODO (pós-POC): aplicar limite diário de perguntas por usuário aqui,
    // consultando o Supabase antes de chamar a IA.

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: BIBLE_ASSISTANT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && "text" in textBlock ? textBlock.text : "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Erro no chat:", err);
    return NextResponse.json(
      { error: "Erro ao gerar resposta. Tente novamente." },
      { status: 500 }
    );
  }
}
