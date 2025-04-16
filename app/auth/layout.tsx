"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* ✅ Navbar shown on login & signup pages */}
        <Navbar />

        {/* ✅ Center the content below the navbar */}
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          {children}
        </main>
      </ThemeProvider>
    </div>
  )
}
