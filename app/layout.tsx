import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bereia — Estudo Bíblico com IA",
  description: "Converse, pesquise e aprofunde seu estudo da Bíblia com inteligência artificial.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bereia",
  },
};

export const viewport: Viewport = {
  themeColor: "#2b2620",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
