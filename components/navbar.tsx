"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useAuth } from "@/contexts/auth-context"

export function Navbar({ showTitle=true, showBackground=true }: { showTitle?: boolean; showBackground: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav
      className={`px-6 py-4 flex items-center justify-between ${
        showBackground
          ? 'bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm'
          : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {showTitle && (
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Quizzy
          </Link>
        )}
      </div>

      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <>
            <Link href="/my-quizzes" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              My Quizzes
            </Link>
            <Link href="/create" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Create Quiz
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Register
            </Link>
          </>
        )}
        <Link href="/help" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          Help
        </Link>
        <ThemeToggle />
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden px-6 py-4 space-y-4">
          {user ? (
            <>
              <Link href="/my-quizzes" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                My Quizzes
              </Link>
              <Link href="/create" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Create Quiz
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                Register
              </Link>
            </>
          )}
          <Link href="/help" className="bg-white text-gray-900 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 rounded-sm px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Help
          </Link>
        </div>
      )}
    </nav>
  )
}
