"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

function JoinQuiz() {
    const [code, setCode] = useState("")
    const [joined, setJoined] = useState(false)
    const [name, setName] = useState("")
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(30)

    const handleJoin = () => {
        if (!joined) {
            setJoined(true)
        } else {
            setCurrentStep(1)
        }
    }

    useEffect(() => {
        if (currentStep === 1 && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [currentStep, timeLeft])

    return (
        <div className="flex min-h-screen flex-col">
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

            <AnimatePresence mode="wait">
                {!joined ? (
                    <motion.div
                        key="join"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center flex-1 p-4"
                    >
                        <div className="max-w-md w-full space-y-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                            >
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Join a Quiz</h1>
                                <p className="mt-4 text-muted-foreground">
                                    Enter the quiz code provided by your host to join the session
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <InputOTP value={code} onChange={setCode} maxLength={6}>
                                        <InputOTPGroup className="gap-2">
                                            {[...Array(6)].map((_, i) => (
                                            <InputOTPSlot key={i} index={i} />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </motion.div>
                            <motion.div
                                className="mt-8 space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button onClick={handleJoin} size="lg" className="w-full py-6 text-lg" disabled={!code}>
                                        Join Quiz <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : currentStep === 0 ? (
                    <motion.div
                        key="name"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center flex-1 p-4"
                    >
                        <div className="max-w-md w-full space-y-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
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
                                <h1 className="text-3xl font-bold tracking-tight">What&apos;s your name?</h1>
                                <p className="mt-4 text-muted-foreground">This will be displayed on the leaderboard</p>
                            </motion.div>
                            <motion.div
                                className="mt-8 space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="text-center text-xl py-6"
                                />
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button onClick={handleJoin} size="lg" className="w-full py-6 text-lg" disabled={!name}>
                                        Continue <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center flex-1 p-4 bg-gradient-to-b from-background to-muted/30"
                    >
                        <div className="max-w-2xl w-full space-y-8 text-center">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-left">
                                    <div className="text-sm font-medium text-muted-foreground">Question 1 of 5</div>
                                    <div className="text-xl font-bold">Multiple Choice</div>
                                </div>
                                <motion.div
                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                    animate={{
                                        scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
                                        color:
                                            timeLeft <= 5
                                                ? ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--primary))"]
                                                : "hsl(var(--primary))",
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: timeLeft <= 5 ? Number.POSITIVE_INFINITY : 0,
                                        repeatType: "loop",
                                    }}
                                >
                                    {timeLeft}s
                                </motion.div>
                            </div>

                            <motion.div
                                className="py-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h2 className="text-3xl font-bold mb-8">What is your favorite color?</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                                    {["Red", "Blue", "Green", "Yellow"].map((option, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <Button
                                                variant={selectedOption === index ? "default" : "outline"}
                                                className={`h-24 text-lg transition-all duration-300 border-2 w-full ${selectedOption === index ? "bg-primary text-primary-foreground" : ""
                                                    }`}
                                                onClick={() => setSelectedOption(index)}
                                            >
                                                <span className="mr-2 opacity-70">{String.fromCharCode(65 + index)}</span> {option}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                className="text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                Waiting for host to continue...
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default JoinQuiz;