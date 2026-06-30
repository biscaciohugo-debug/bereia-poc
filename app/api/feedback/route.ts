import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, answer, vote } = await req.json();

    console.log("[FEEDBACK]", {
      vote,
      question,
      answer: answer?.slice(0, 100),
      at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar feedback:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
