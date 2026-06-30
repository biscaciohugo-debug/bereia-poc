import Link from "next/link";

export function Header({ active }: { active: "chat" | "devocional" }) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-[var(--font-display)] text-xl tracking-tight">
            Bereia
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink-soft)]">
            estudo bíblico com IA
          </span>
        </div>
        <nav className="flex gap-5 text-sm">
          <Link
            href="/"
            className={
              active === "chat"
                ? "text-[var(--gold-deep)] font-medium"
                : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }
          >
            Chat
          </Link>
          <Link
            href="/devocional"
            className={
              active === "devocional"
                ? "text-[var(--gold-deep)] font-medium"
                : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
            }
          >
            Devocional
          </Link>
        </nav>
      </div>
    </header>
  );
}
