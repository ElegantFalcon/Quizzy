"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { BarChart3, Clock, Cloud, Cog, Layers, ListOrdered, MessageSquare, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"

function CreateQuiz() {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            type: "multiple-choice",
            text: "What is your favorite color?",
            options: ["Red", "Blue", "Green", "Yellow"],
        },
    ])

    const addQuestion = () => {
        const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
        setQuestions([...questions, { id: newId, type: "multiple-choice", text: "", options: ["Option 1", "Option 2"] }])
    }

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id))
    }

    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
                    <p className="text-muted-foreground">Design your interactive quiz experience</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <UserProfile />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Quiz Title</Label>
                                        <Input id="title" placeholder="Enter quiz title" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" placeholder="Enter quiz description" className="mt-1" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {questions.map((question, index) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                    transition={{ duration: 0.3 }}
                                    layout
                                >
                                    <Card className="relative group">
                                        <CardContent className="pt-6">
                                            <div className="absolute left-4 top-6 cursor-move opacity-40 group-hover:opacity-100">
                                                <DragHandleDots2Icon className="h-5 w-5" />
                                            </div>
                                            <div className="ml-8 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <Select defaultValue={question.type}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Question Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="multiple-choice">
                                                                    <div className="flex items-center gap-2">
                                                                        <BarChart3 className="h-4 w-4" />
                                                                        <span>Multiple Choice</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="word-cloud">
                                                                    <div className="flex items-center gap-2">
                                                                        <Cloud className="h-4 w-4" />
                                                                        <span>Word Cloud</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="ranking">
                                                                    <div className="flex items-center gap-2">
                                                                        <ListOrdered className="h-4 w-4" />
                                                                        <span>Ranking</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="qa">
                                                                    <div className="flex items-center gap-2">
                                                                        <MessageSquare className="h-4 w-4" />
                                                                        <span>Q&A</span>
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeQuestion(question.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                                <div>
                                                    <Input
                                                        placeholder="Enter your question"
                                                        defaultValue={question.text}
                                                        className="text-lg font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    {question.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex items-center gap-2">
                                                            <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm">
                                                                {String.fromCharCode(65 + optIndex)}
                                                            </div>
                                                            <Input defaultValue={option} placeholder={`Option ${optIndex + 1}`} />
                                                        </div>
                                                    ))}
                                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                        <Button variant="outline" size="sm" className="mt-2">
                                                            <Plus className="h-4 w-4 mr-2" /> Add Option
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Button onClick={addQuestion} variant="outline" className="w-full py-8 border-dashed">
                                <Plus className="h-5 w-5 mr-2" /> Add Question
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <div>
                    <div className="sticky top-6 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                        <Cog className="h-5 w-5" /> Quiz Settings
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Time Limit</Label>
                                                <div className="text-sm text-muted-foreground">Set time per question</div>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <Select defaultValue="30">
                                                    <SelectTrigger className="w-[80px]">
                                                        <SelectValue placeholder="Time" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="15">15s</SelectItem>
                                                        <SelectItem value="30">30s</SelectItem>
                                                        <SelectItem value="60">60s</SelectItem>
                                                        <SelectItem value="120">2m</SelectItem>
                                                        <SelectItem value="0">No limit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Theme</Label>
                                                <div className="text-sm text-muted-foreground">Choose quiz appearance</div>
                                            </div>
                                            <Select defaultValue="default">
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Theme" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Default</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="colorful">Colorful</SelectItem>
                                                    <SelectItem value="minimal">Minimal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Access</Label>
                                                <div className="text-sm text-muted-foreground">Control who can join</div>
                                            </div>
                                            <Select defaultValue="public">
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Access" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">Public</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                    <SelectItem value="password">Password</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="show-results">Show Results</Label>
                                                <div className="text-sm text-muted-foreground">Display results after each question</div>
                                            </div>
                                            <Switch id="show-results" defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="leaderboard">Leaderboard</Label>
                                                <div className="text-sm text-muted-foreground">Show participant rankings</div>
                                            </div>
                                            <Switch id="leaderboard" defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                                        <Layers className="h-5 w-5" /> Quiz Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Questions:</span>
                                            <span className="font-medium">{questions.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Estimated Time:</span>
                                            <span className="font-medium">{questions.length * 30} seconds</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Access Code:</span>
                                            <span className="font-medium">123-456</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateQuiz;