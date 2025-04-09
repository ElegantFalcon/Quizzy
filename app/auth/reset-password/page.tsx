"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const validateEmail = () => {
    if (!email) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setIsLoading(true)

    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful password reset request
      console.log("Password reset email sent to", email)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset request failed", error)
      setError("Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <p>
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                If you don&apos;t see the email, check your spam folder or try again with a different email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`pl-9 ${error ? "border-destructive" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <motion.div whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send reset link
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <Link
              href="/auth/login"
              className="text-primary underline-offset-4 transition-colors hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

