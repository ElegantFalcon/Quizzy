"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { db, auth } from "@/lib/firebase"
// Update these imports for Firestore
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { toast } from "sonner"
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog"


// Define quiz type
interface Quiz {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    participants: number;
    status: "active" | "completed" | "draft";
    questions: number;
    category: string;
    userId: string;
}

function MyQuizzes() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<string>("newest")

    // Fetch quizzes from Firestore
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    router.push("/auth/login");
                    return;
                }

                const userId = currentUser.uid;
                const quizzesRef = collection(db, "quizzes");
                const q = query(quizzesRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                
                const fetchedQuizzes: Quiz[] = [];
                // Fix for line 133 - Improved date handling from Firestore
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    try {
                        fetchedQuizzes.push({
                            id: doc.id,
                            title: data.title,
                            description: data.description,
                            // More robust date handling
                            createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' 
                                ? data.createdAt.toDate() 
                                : new Date(data.createdAt || Date.now()),
                            participants: data.participants || 0,
                            status: data.status || "draft",
                            questions: data.questionCount || 0,
                            category: data.category || "general",
                            userId: data.userId
                        });
                    } catch (err) {
                        console.error("Error processing quiz document:", err, data);
                    }
                });
                
                setQuizzes(fetchedQuizzes);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                toast.error("Failed to load quizzes. Please try again.");
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [router]);

    // Filter quizzes based on search term and active tab
    // Fix for line 199 - Add null/undefined checks for createdAt in sorting
    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesSearch =
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
        if (activeTab === "all") return matchesSearch;
        if (activeTab === "active") return matchesSearch && quiz.status === "active";
        if (activeTab === "completed") return matchesSearch && quiz.status === "completed";
        if (activeTab === "drafts") return matchesSearch && quiz.status === "draft";
    
        return matchesSearch;
    }).sort((a, b) => {
        // Add safety checks for date objects
        switch (sortOrder) {
            case "newest":
                return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
            case "oldest":
                return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
            case "participants":
                return (b.participants || 0) - (a.participants || 0);
            case "alphabetical":
                return (a.title || "").localeCompare(b.title || "");
            default:
                return 0;
        }
    });

    const handleDeleteQuiz = async () => {
        if (!deleteQuizId) return;
        
        try {
            await deleteDoc(doc(db, "quizzes", deleteQuizId));
            setQuizzes(quizzes.filter(quiz => quiz.id !== deleteQuizId));
            toast.success("The quiz has been successfully deleted.");
        } catch (error) {
            console.error("Error deleting quiz:", error);
            toast.error("Failed to delete quiz. Please try again.");
        } finally {
            setDeleteQuizId(null);
        }
    };

    const handleCreateQuiz = () => {
        router.push("/create");
    };

    const handleEditQuiz = (quizId: string) => {
        router.push(`/edit/${quizId}`);
    };

    const handleViewAnalytics = (quizId: string) => {
        router.push(`/analytics/${quizId}`);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    if (loading) return null; // Let the loading component handle this

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
                        <Button className="gap-2" onClick={handleCreateQuiz}>
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
                                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                                    Newest first
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                                    Oldest first
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder("participants")}>
                                    Most participants
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortOrder("alphabetical")}>
                                    Alphabetical
                                </DropdownMenuItem>
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
                                <p className="text-muted-foreground mt-1">
                                    {searchTerm ? "Try adjusting your search or filters" : "Create your first quiz to get started"}
                                </p>
                                {!searchTerm && quizzes.length === 0 && (
                                    <Button 
                                        className="mt-4 gap-2" 
                                        onClick={handleCreateQuiz}
                                    >
                                        <Plus className="h-4 w-4" /> Create Quiz
                                    </Button>
                                )}
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
                                                            <DropdownMenuItem onClick={() => handleEditQuiz(quiz.id)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" /> Preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleViewAnalytics(quiz.id)}>
                                                                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                className="text-destructive"
                                                                onClick={() => setDeleteQuizId(quiz.id)}
                                                            >
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteQuizId} onOpenChange={(open) => !open && setDeleteQuizId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the quiz and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteQuiz} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}



export default MyQuizzes;