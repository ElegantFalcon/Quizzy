"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import { BarChart3, Clock, Cog, Layers, Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { Toaster, toast } from "sonner"

function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function CreateQuiz() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multiple-choice",
      text: "What is your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"],
    },
  ])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState("30")
  const [showResults, setShowResults] = useState(true)
  const [leaderboard, setLeaderboard] = useState(true)
  const [roomCode, setRoomCode] = useState("")
  const [status, setStatus] = useState<"draft" | "waiting" | "running" | "finished">("draft")
  const [category, setCategory] = useState("general")
  const [customCategory, setCustomCategory] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  if (!mounted || authLoading) return null

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
    setQuestions([
      ...questions,
      {
        id: newId,
        type: "multiple-choice",
        text: "",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      },
    ])
  }

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const saveQuiz = async () => {
    if (!title.trim()) return toast.error("Title is required.")
    if (!user) return toast.error("User not logged in.")
    if (!roomCode) return toast.error("Room code is required.")

    try {
      const quizCategory = category === "custom" && customCategory.trim() ? customCategory.trim() : category
      // Always store timeLimit as seconds (already in seconds from dropdown)
      const timeLimitSeconds = parseInt(timeLimit, 10)

      // Save complete quiz data to created-quiz collection
      const docRef = await addDoc(collection(db, "created-quiz"), {
        title,
        description,
        roomCode,
        createdAt: serverTimestamp(),
        userId: user.uid,
        questionCount: questions.length,
        participants: 0,
        status,
        category: quizCategory,
        settings: {
          timeLimit: timeLimitSeconds,
          showResults,
          leaderboard,
        },
        questions: questions.map((q) => ({
          id: q.id,
          type: q.type,
          text: q.text,
          options: q.options,
        })),
      })

      // Save metadata to quizzes collection
      await addDoc(collection(db, "quizzes"), {
        id: docRef.id,
        title,
        description,
        roomCode,
        createdAt: serverTimestamp(),
        userId: user.uid,
        questionCount: questions.length,
        participants: 0,
        status,
        category: quizCategory
      })

      //Update the Room_Code collections with the roomcode generated
      await addDoc(collection(db, "Room_Code"), {
        roomCode: roomCode,
        createdAt: serverTimestamp(),
      })

      toast.success("Quiz saved successfully!")
      router.push("/my-quizzes")
    } 
    catch (error) {
      console.error("Error saving quiz:", error)
      toast.error("Error saving quiz.")
    }
  }

  const handleStartQuiz = () => {
    setStatus("running")
    toast.success("Quiz started!")
  }

  return (
    <div className="container py-6 ml-[300px]">
      <Toaster richColors />

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
                  <div className="space-y-4">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter quiz title" />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter quiz description" />
                  </div>
                  {/* Category Dropdown */}
                  <div className="space-y-4">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        setCategory(val)
                        if (val !== "custom") setCustomCategory("")
                      }}
                    >
                      <SelectTrigger className="w-full" id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="personality">Personality</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="custom">Other (Enter category)</SelectItem>
                      </SelectContent>
                    </Select>
                    {category === "custom" && (
                      <Input
                        className="mt-2"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-code">Room Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="room-code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                        placeholder="Generate or enter room code"
                        maxLength={8}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRoomCode(generateRoomCode(6))}
                      >
                        Generate
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Room code can contain numbers and capital letters.</div>
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
                            value={question.text}
                            onChange={(e) => {
                              const newQuestions = [...questions]
                              newQuestions[index].text = e.target.value
                              setQuestions(newQuestions)
                            }}
                            className="text-lg font-medium"
                          />

                        </div>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center font-medium text-sm">
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newQuestions = [...questions]
                                  newQuestions[index].options[optIndex] = e.target.value
                                  setQuestions(newQuestions)
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />

                            </div>
                          ))}

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
                        <Select value={timeLimit} onValueChange={(v) => setTimeLimit(v)}>
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5s</SelectItem>
                            <SelectItem value="10">10s</SelectItem>
                            <SelectItem value="120">2m</SelectItem>
                            <SelectItem value="300">5m</SelectItem>
                            <SelectItem value="0">No limit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-results">Show Results</Label>
                        <div className="text-sm text-muted-foreground">Display results after each question</div>
                      </div>
                      <Switch id="show-results" checked={showResults} onCheckedChange={setShowResults} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="leaderboard">Leaderboard</Label>
                        <div className="text-sm text-muted-foreground">Show participant rankings</div>
                      </div>
                      <Switch id="leaderboard" checked={leaderboard} onCheckedChange={setLeaderboard} />
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
                      <span className="font-medium">{roomCode}</span>
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
                <CardContent >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button onClick={saveQuiz} className="w-full py-4 mt-4">Save Quiz</Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      onClick={handleStartQuiz}
                      className="w-full py-4 mt-2"
                      disabled={status === "running" || status === "finished"}
                      variant={status === "running" ? "secondary" : "default"}
                    >
                      {status === "running" ? "Quiz Running" : "Start Quiz"}
                    </Button>
                  </motion.div>

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