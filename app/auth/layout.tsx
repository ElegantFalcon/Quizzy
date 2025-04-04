"use client"; // ✅ Add this to enable Client Components

import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    Q
                  </div>
                  QuizApp
                </Link>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
              {children}
            </main>
            <footer className="border-t py-4">
              <div className="container flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} QuizApp. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
