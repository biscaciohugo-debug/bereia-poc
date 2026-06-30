import { Header } from "@/components/Header";
import { ChatView } from "@/components/ChatView";

export default function Home() {
  return (
    <main>
      <Header active="chat" />
      <ChatView />
    </main>
  );
}
