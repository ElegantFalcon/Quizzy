"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, ChevronDown, Download, LineChart, PieChart, RefreshCw, Users } from "lucide-react"
import { format, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for analytics
const quizzes = [
    { id: 1, title: "Product Knowledge Quiz", participants: 124, completionRate: 87, avgScore: 76 },
    { id: 2, title: "Team Building Survey", participants: 45, completionRate: 92, avgScore: 84 },
    { id: 3, title: "Customer Satisfaction", participants: 89, completionRate: 78, avgScore: 68 },
    { id: 4, title: "Marketing Concepts", participants: 67, completionRate: 81, avgScore: 72 },
    { id: 5, title: "Programming Basics", participants: 210, completionRate: 65, avgScore: 58 },
]

const participationData = [
    { date: subDays(new Date(), 30), count: 12 },
    { date: subDays(new Date(), 27), count: 18 },
    { date: subDays(new Date(), 24), count: 24 },
    { date: subDays(new Date(), 21), count: 35 },
    { date: subDays(new Date(), 18), count: 42 },
    { date: subDays(new Date(), 15), count: 38 },
    { date: subDays(new Date(), 12), count: 45 },
    { date: subDays(new Date(), 9), count: 52 },
    { date: subDays(new Date(), 6), count: 64 },
    { date: subDays(new Date(), 3), count: 58 },
    { date: new Date(), count: 72 },
]


const questionPerformance = [
    { question: "Question 1", correctAnswers: 78, incorrectAnswers: 22 },
    { question: "Question 2", correctAnswers: 65, incorrectAnswers: 35 },
    { question: "Question 3", correctAnswers: 82, incorrectAnswers: 18 },
    { question: "Question 4", correctAnswers: 45, incorrectAnswers: 55 },
    { question: "Question 5", correctAnswers: 92, incorrectAnswers: 8 },
]

function Analytics() {
    const [selectedQuiz, setSelectedQuiz] = useState("all")
    const [timeRange, setTimeRange] = useState("30days")

    // Calculate total participants
    const totalParticipants = quizzes.reduce((sum, quiz) => sum + quiz.participants, 0)

    // Calculate average completion rate
    const avgCompletionRate = Math.round(quizzes.reduce((sum, quiz) => sum + quiz.completionRate, 0) / quizzes.length)

    // Calculate average score
    const avgScore = Math.round(quizzes.reduce((sum, quiz) => sum + quiz.avgScore, 0) / quizzes.length)

    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Insights and statistics for your quizzes</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </motion.div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-2">
                        <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Quiz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Quizzes</SelectItem>
                                {quizzes.map((quiz) => (
                                    <SelectItem key={quiz.id} value={quiz.id.toString()}>
                                        {quiz.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-1">
                                    {timeRange === "7days" && "Last 7 days"}
                                    {timeRange === "30days" && "Last 30 days"}
                                    {timeRange === "90days" && "Last 90 days"}
                                    {timeRange === "year" && "Last year"}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTimeRange("7days")}>Last 7 days</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeRange("30days")}>Last 30 days</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeRange("90days")}>Last 90 days</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTimeRange("year")}>Last year</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" title="Refresh data">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 text-primary mr-2" />
                                    <div className="text-2xl font-bold">{totalParticipants}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Completion Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <PieChart className="h-5 w-5 text-primary mr-2" />
                                    <div className="text-2xl font-bold">{avgCompletionRate}%</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <BarChart className="h-5 w-5 text-primary mr-2" />
                                    <div className="text-2xl font-bold">{avgScore}%</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Participation Trend</CardTitle>
                                <CardDescription>Number of participants over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    {/* This would be a real chart in a production app */}
                                    <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center relative overflow-hidden">
                                        <LineChart className="h-12 w-12 text-muted-foreground/50" />
                                        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-primary/10 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20"></div>

                                        {/* Simplified chart visualization */}
                                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end px-4">
                                            {participationData.map((data, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex-1 mx-0.5 bg-primary"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${(data.count / 80) * 100}%` }}
                                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                                ></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>{format(participationData[0].date, "MMM d")}</span>
                                    <span>{format(participationData[participationData.length - 1].date, "MMM d")}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className=" gap-6">
                        
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quiz Performance</CardTitle>
                                    <CardDescription>Completion rates by quiz</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {quizzes.slice(0, 5).map((quiz, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium truncate max-w-[180px]">{quiz.title}</span>
                                                    <span>{quiz.completionRate}%</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-primary"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${quiz.completionRate}%` }}
                                                        transition={{ delay: index * 0.1, duration: 0.7 }}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Question Performance</CardTitle>
                                <CardDescription>Analysis of correct vs incorrect answers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {questionPerformance.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">{item.question}</span>
                                                <span className="text-sm text-muted-foreground">{item.correctAnswers}% correct</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                                                <motion.div
                                                    className="h-full bg-green-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.correctAnswers}%` }}
                                                    transition={{ delay: index * 0.1, duration: 0.7 }}
                                                ></motion.div>
                                                <motion.div
                                                    className="h-full bg-red-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.incorrectAnswers}%` }}
                                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.7 }}
                                                ></motion.div>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Correct: {item.correctAnswers}%</span>
                                                <span>Incorrect: {item.incorrectAnswers}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="text-lg font-medium mb-4">Average Time per Question</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[28, 45, 32, 56, 22].map((seconds, index) => (
                                            <Card key={index} className="text-center p-4">
                                                <div className="text-xs text-muted-foreground mb-1">Question {index + 1}</div>
                                                <div className="text-xl font-bold">{seconds}s</div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}


export default Analytics;