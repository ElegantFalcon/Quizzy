"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Ripple } from "@/components/magicui/ripple"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Remove the early return that was causing issues
  // if (!mounted || authLoading) return null

  const handleCreateClick = () => {
    if (authLoading) return // Don't do anything while auth is loading
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push('/create')
  }

  // Only render content when mounted to prevent hydration issues
  if (!mounted) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  // Remove the unused item variable
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background">
      <Ripple/>
      
      <div className="absolute top-5 right-5">
        <Navbar showTitle={false} showBackground={false} />
      </div>

      <motion.div
        className="max-w-3xl mx-auto text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Interactive <span className="text-primary">Quizzes</span> Made Simple
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create engaging quizzes, polls, and interactive presentations for your audience. Get real-time feedback and
          insights.
        </p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="gap-2 transition-all duration-300 hover:scale-105"
            onClick={handleCreateClick}
          >
            Create Quiz <ArrowRight className="h-4 w-4 animate-pulse" />
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 transition-all duration-300 hover:scale-105">
            <Link href="/join">
              Join Quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h8" />
              <path d="M8 17h8" />
              <path d="M8 9h2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Create</h3>
          <p className="text-muted-foreground">
            Design interactive quizzes with multiple question types and customizable themes.
          </p>
        </motion.div>

        <motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Engage</h3>
          <p className="text-muted-foreground">
            Engage your audience with real-time interactions and dynamic visualizations.
          </p>
        </motion.div>

        <motion.div
  variants={container}
  initial="hidden"
  animate="show"
>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 20v-6" />
              <path d="M12 14l-4-4" />
              <path d="M12 14l4-4" />
              <path d="M12 4v6" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Analyze</h3>
          <p className="text-muted-foreground">Get valuable insights with detailed analytics and exportable results.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

