import type { Metadata } from "next";
import { Cormorant, Jost, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NavLinks } from "./components/NavLinks";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Murtaza & Sarrah",
  description: "We're getting married — October 20, 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", cormorant.variable, jost.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-body">
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-wide text-foreground hover:text-accent transition-colors"
            >
              M&thinsp;&&thinsp;S
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-border/40 py-10 text-center">
          <p className="font-display text-lg text-accent tracking-widest">
            Murtaza & Sarrah
          </p>
          <p className="text-xs text-text-secondary mt-2 font-body tracking-wide uppercase">
            October 20, 2026
          </p>
        </footer>
      </body>
    </html>
  );
}
