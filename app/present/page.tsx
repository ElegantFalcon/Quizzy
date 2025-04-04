"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, BarChart3, ChevronDown, Copy, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

function PresentQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [timeLeft, setTimeLeft] = useState(30)
    const totalQuestions = 5

    const nextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setShowResults(false)
            setTimeLeft(30)
        }
    }

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
            setShowResults(false)
            setTimeLeft(30)
        }
    }

    const toggleResults = () => {
        setShowResults(!showResults)
    }

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setShowResults(true)
        }
    }, [timeLeft])

    // Fake data for the chart
    const results = [
        { option: "Red", count: 12 },
        { option: "Blue", count: 24 },
        { option: "Green", count: 8 },
        { option: "Yellow", count: 6 },
    ]

    // Calculate percentages and max value
    const total = results.reduce((sum, item) => sum + item.count, 0)
    const maxCount = Math.max(...results.map((item) => item.count))

    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="font-bold text-xl flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                Q
                            </div>
                            QuizApp
                        </div>
                        <motion.div
                            className="bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            Code: <span className="font-mono font-bold">123-456</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                            </Button>
                        </motion.div>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.div
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Users className="h-4 w-4" /> 50 participants
                        </motion.div>
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Options <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>End Quiz</DropdownMenuItem>
                                <DropdownMenuItem>Reset Responses</DropdownMenuItem>
                                <DropdownMenuItem>Export Results</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col">
                <div className="container py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="outline" size="icon" onClick={prevQuestion} disabled={currentQuestion === 0}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </motion.div>
                            <span className="text-sm font-medium">
                                Question {currentQuestion + 1} of {totalQuestions}
                            </span>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={nextQuestion}
                                    disabled={currentQuestion === totalQuestions - 1}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={
                                    showResults ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" } : {}
                                }
                            >
                                <Button
                                    variant={showResults ? "default" : "outline"}
                                    size="sm"
                                    onClick={toggleResults}
                                    className="transition-colors duration-300"
                                >
                                    {showResults ? "Hide Results" : "Show Results"}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-muted/30">
                    <div className="container py-8">
                        <Tabs defaultValue="question" className="w-full">
                            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                                <TabsTrigger value="question">Question</TabsTrigger>
                                <TabsTrigger value="responses">Responses</TabsTrigger>
                            </TabsList>
                            <AnimatePresence mode="wait">
                                <TabsContent value="question" className="mt-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="max-w-4xl mx-auto bg-card rounded-lg p-8 shadow-sm border">
                                            <h2 className="text-3xl font-bold mb-8 text-center">What is your favorite color?</h2>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                                                <motion.div
                                                    className="bg-background border-2 rounded-lg p-4 flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <div className="bg-red-500 w-8 h-8 rounded-md flex-shrink-0"></div>
                                                    <span className="text-lg font-medium">Red</span>
                                                </motion.div>
                                                <motion.div
                                                    className="bg-background border-2 rounded-lg p-4 flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <div className="bg-blue-500 w-8 h-8 rounded-md flex-shrink-0"></div>
                                                    <span className="text-lg font-medium">Blue</span>
                                                </motion.div>
                                                <motion.div
                                                    className="bg-background border-2 rounded-lg p-4 flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <div className="bg-green-500 w-8 h-8 rounded-md flex-shrink-0"></div>
                                                    <span className="text-lg font-medium">Green</span>
                                                </motion.div>
                                                <motion.div
                                                    className="bg-background border-2 rounded-lg p-4 flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                >
                                                    <div className="bg-yellow-500 w-8 h-8 rounded-md flex-shrink-0"></div>
                                                    <span className="text-lg font-medium">Yellow</span>
                                                </motion.div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                                <TabsContent value="responses" className="mt-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="max-w-4xl mx-auto p-8">
                                            <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
                                                <BarChart3 className="h-5 w-5" /> Response Distribution
                                            </h3>

                                            <div className="space-y-6">
                                                {results.map((item, index) => (
                                                    <div key={index} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={`w-4 h-4 rounded-sm bg-primary opacity-${Math.round((item.count / maxCount) * 100)}`}
                                                                ></div>
                                                                <span>{item.option}</span>
                                                            </div>
                                                            <div className="text-sm font-medium">
                                                                {item.count} ({Math.round((item.count / total) * 100)}%)
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                                            transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
                                                        >
                                                            <Progress value={(item.count / maxCount) * 100} className="h-8" />
                                                        </motion.div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 pt-4 border-t">
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>Total responses: {total}</span>
                                                    <span>Updated just now</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>
                    </div>
                </div>
            </div>

            <footer className="border-t bg-background">
                <div className="container flex h-16 items-center justify-between">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                    </motion.div>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalQuestions }).map((_, index) => (
                            <motion.div
                                key={index}
                                className={`h-2 w-2 rounded-full ${index === currentQuestion ? "bg-primary" : "bg-muted"}`}
                                animate={{
                                    scale: index === currentQuestion ? [1, 1.2, 1] : 1,
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: index === currentQuestion ? Number.POSITIVE_INFINITY : 0,
                                    repeatType: "reverse",
                                }}
                            ></motion.div>
                        ))}
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={nextQuestion} disabled={currentQuestion === totalQuestions - 1}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}



export default PresentQuiz;