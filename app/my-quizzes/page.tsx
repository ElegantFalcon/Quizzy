"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Calendar, Copy, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock data for quizzes
const quizzes = [
    {
        id: 1,
        title: "Product Knowledge Quiz",
        description: "Test your knowledge about our products",
        createdAt: new Date(2023, 3, 15),
        participants: 124,
        status: "active",
        questions: 10,
        category: "business",
    },
    {
        id: 2,
        title: "Team Building Survey",
        description: "Help us improve our team building activities",
        createdAt: new Date(2023, 4, 2),
        participants: 45,
        status: "active",
        questions: 8,
        category: "education",
    },
    {
        id: 3,
        title: "Customer Satisfaction",
        description: "Rate your experience with our customer service",
        createdAt: new Date(2023, 5, 10),
        participants: 89,
        status: "completed",
        questions: 5,
        category: "feedback",
    },
    {
        id: 4,
        title: "Marketing Concepts",
        description: "Test your marketing knowledge",
        createdAt: new Date(2023, 2, 28),
        participants: 67,
        status: "draft",
        questions: 15,
        category: "business",
    },
    {
        id: 5,
        title: "Programming Basics",
        description: "Test your programming fundamentals",
        createdAt: new Date(2023, 1, 15),
        participants: 210,
        status: "active",
        questions: 20,
        category: "education",
    },
    {
        id: 6,
        title: "Annual Employee Survey",
        description: "Share your thoughts about working here",
        createdAt: new Date(2023, 0, 5),
        participants: 156,
        status: "completed",
        questions: 12,
        category: "feedback",
    },
]

function MyQuizzes() {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Filter quizzes based on search term and active tab
    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesSearch =
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase())

        if (activeTab === "all") return matchesSearch
        if (activeTab === "active") return matchesSearch && quiz.status === "active"
        if (activeTab === "completed") return matchesSearch && quiz.status === "completed"
        if (activeTab === "drafts") return matchesSearch && quiz.status === "draft"

        return matchesSearch
    })

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
                    <p className="text-muted-foreground">Manage and analyze your quizzes</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Create Quiz
                        </Button>
                    </motion.div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search quizzes..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <Filter className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9 gap-1">
                                    Sort by <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Newest first</DropdownMenuItem>
                                <DropdownMenuItem>Oldest first</DropdownMenuItem>
                                <DropdownMenuItem>Most participants</DropdownMenuItem>
                                <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Quizzes</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-6">
                        {filteredQuizzes.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">No quizzes found</h3>
                                <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {filteredQuizzes.map((quiz) => (
                                    <motion.div key={quiz.id} variants={item}>
                                        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <CardTitle className="flex items-center gap-2">
                                                            {quiz.title}
                                                            {quiz.status === "active" && (
                                                                <Badge variant="default" className="ml-2">
                                                                    Active
                                                                </Badge>
                                                            )}
                                                            {quiz.status === "completed" && <Badge variant="secondary">Completed</Badge>}
                                                            {quiz.status === "draft" && <Badge variant="outline">Draft</Badge>}
                                                        </CardTitle>
                                                        <CardDescription>{quiz.description}</CardDescription>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" /> Preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-3 flex-grow">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{format(quiz.createdAt, "MMM d, yyyy")}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>{quiz.participants} participants</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-3 border-t flex justify-between">
                                                <div className="text-xs text-muted-foreground">{quiz.questions} questions</div>
                                                <div className="text-xs font-medium">{quiz.category}</div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}



export default MyQuizzes;