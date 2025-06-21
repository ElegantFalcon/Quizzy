"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { collection, query, where, getDocs, onSnapshot, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { toast } from "sonner";
import { getDatabase, ref, set } from "firebase/database"; // RTDB imports
import { ShowWinnerComponent } from "@/components/show-winner"

interface QuizData {
    status: string;
    roomCode: string;
    currentQuestion: number;
    questions: {
        text: string;
        options: string[];
        correctOption: number;
    }[];
}

function JoinQuiz() {
    const [code, setCode] = useState("")
    const [joined, setJoined] = useState(false)
    const [name, setName] = useState("")
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(30)
    const [waitingRoomActive, setWaitingRoomActive] = useState(false)
    const [waitingForHost, setWaitingForHost] = useState(false)
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [questionTimer, setQuestionTimer] = useState(4);

    // Listen for waiting room status after joining
    useEffect(() => {
        let unsub: (() => void) | undefined
        if (joined && code) {
            // Listen to the created-quiz collection for this room code
            const q = query(collection(db, "created-quiz"), where("roomCode", "==", code))
            unsub = onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const quiz = snapshot.docs[0].data()
                    setQuizData(quiz as QuizData);
                    if (quiz.status === "waiting") {
                        setWaitingRoomActive(true)
                    } else if (quiz.status === "running") {
                        setWaitingRoomActive(false)
                        setWaitingForHost(false) 
                        setCurrentStep(2); // Show quiz
                    } else if (quiz.status === "finished") {
                        setCurrentStep(3); // Show results
                    } else {
                        setWaitingRoomActive(false)
                        setJoined(false)
                        setCurrentStep(0)
                        toast.error("Waiting room has been terminated.")
                    }
                } else {
                    setWaitingRoomActive(false)
                    setJoined(false)
                    setCurrentStep(0)
                    toast.error("Room not found.")
                }
            })
        }
        return () => unsub && unsub()
    }, [joined, code])

    const handleJoin = async () => {
        if (!joined) {
            // Check if room code exists
            const roomCodeRef = collection(db, "Room_Code");
            const q = query(roomCodeRef, where("roomCode", "==", code));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Room code exists, now check if waiting room is active
                const quizQ = query(collection(db, "created-quiz"), where("roomCode", "==", code));
                const quizSnap = await getDocs(quizQ);
                if (!quizSnap.empty) {
                    const quiz = quizSnap.docs[0].data();
                    if (quiz.status === "waiting") {
                        setJoined(true);
                        setWaitingRoomActive(true);
                        setWaitingForHost(false); // Not waiting for host yet, just joined
                    } else {
                        setWaitingRoomActive(false);
                        toast.error("Waiting room has not started or has been terminated.");
                    }
                } else {
                    toast.error("Quiz not found for this code.");
                }
            } else {
                toast.error("Invalid room code. Please try again.");
            }
        } else {
            // Only proceed if waiting room is active
            if (waitingRoomActive) {
                if (currentStep === 0 && name) {
                    try {
                        // Get the quiz document reference
                        const quizQ = query(collection(db, "created-quiz"), where("roomCode", "==", code));
                        const quizSnap = await getDocs(quizQ);
                        if (!quizSnap.empty) {
                            const quizDocId = quizSnap.docs[0].id;
                            // Firestore: Add participant
                            const quizParticipantsRef = collection(db, "participants", quizDocId, "participants");
                            const participantDoc = await addDoc(quizParticipantsRef, {
                                name,
                                points: 0,
                                joinedAt: new Date(),
                            });

                            // RTDB: Add participant for real-time leaderboard
                            const rtdb = getDatabase(); 
                            await set(
                                ref(rtdb, `leaderboards/${quizDocId}/participants/${participantDoc.id}`),
                                {
                                    name,
                                    points: 0,
                                    joinedAt: Date.now(),
                                }
                            );
                        }
                    } catch {
                        toast.error("Failed to join. Please try again.");
                        return;
                    }
                    setCurrentStep(1);
                    setWaitingForHost(true);
                }
            } else {
                toast.error("Waiting room is not active.");
            }
        }
    };

    useEffect(() => {
        if (currentStep === 1 && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [currentStep, timeLeft])

    // Timer for each question
    useEffect(() => {
        if (currentStep === 2 && quizData && quizData.status === "running") {
            setQuestionTimer(4);
            const timer = setInterval(() => {
                setQuestionTimer((t) => (t > 0 ? t - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizData, quizData?.currentQuestion, currentStep, quizData?.status]);

    // Add this function inside your JoinQuiz component
    const handleOptionSelect = async (index: number) => {
        setSelectedOption(index);

        // Only allow answer if timer is running and quizData is available
        if (
            quizData &&
            quizData.questions &&
            typeof quizData.currentQuestion === "number" &&
            questionTimer > 0
        ) {
            const correctOption = quizData.questions[quizData.currentQuestion].correctOption;
            if (index === correctOption) {
                // Find participant doc
                const quizQ = query(collection(db, "created-quiz"), where("roomCode", "==", code));
                const quizSnap = await getDocs(quizQ);
                if (!quizSnap.empty) {
                    const quizDocId = quizSnap.docs[0].id;
                    // Find participant by name (or use a better unique identifier if available)
                    const participantsRef = collection(db, "participants", quizDocId, "participants");
                    const participantQ = query(participantsRef, where("name", "==", name));
                    const participantSnap = await getDocs(participantQ);
                    if (!participantSnap.empty) {
                        const participantDoc = participantSnap.docs[0];
                        // Update points in Firestore
                        await updateDoc(doc(db, "participants", quizDocId, "participants", participantDoc.id), {
                            points: (participantDoc.data().points || 0) + 1,
                        });
                        // Update points in RTDB
                        const rtdb = getDatabase();
                        await set(
                            ref(rtdb, `leaderboards/${quizDocId}/participants/${participantDoc.id}/points`),
                            (participantDoc.data().points || 0) + 1
                        );
                    }
                }
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="font-bold text-xl flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            Q
                        </div>
                        Quizzy
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
                ) : waitingForHost ? (
                    <motion.div
                        key="waiting-for-host"
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
                                <h1 className="text-3xl font-bold tracking-tight">Waiting for host to start quiz...</h1>
                                <p className="mt-4 text-muted-foreground">Please wait. The quiz will begin soon.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : currentStep === 2 && quizData && quizData.status === "running" ? (
                    <motion.div key="quiz" className="flex flex-col items-center justify-center flex-1 p-4 bg-gradient-to-b from-background to-muted/30">
                        <div className="max-w-2xl w-full space-y-8 text-center">
                            <div className="flex justify-between items-center w-full">
                                <div className="text-left">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        Question {quizData.currentQuestion + 1} of {quizData.questions.length}
                                    </div>
                                    <div className="text-xl font-bold">Multiple Choice</div>
                                </div>
                                <motion.div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                    {questionTimer}s
                                </motion.div>
                            </div>
                            <motion.div className="py-8">
                                <h2 className="text-3xl font-bold mb-8">
                                    {quizData.questions[quizData.currentQuestion]?.text}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                                    {quizData.questions[quizData.currentQuestion]?.options.map((option: string, index: number) => (
                                        <Button
                                          key={index}
                                          variant={selectedOption === index ? "default" : "outline"}
                                          className={`h-24 text-lg transition-all duration-300 border-2 w-full ${selectedOption === index ? "bg-primary text-primary-foreground" : ""}`}
                                          onClick={() => handleOptionSelect(index)}
                                          disabled={questionTimer === 0}
                                        >
                                          <span className="mr-2 opacity-70">{String.fromCharCode(65 + index)}</span> {option}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div className="text-sm text-muted-foreground">
                                Waiting for next question...
                            </motion.div>
                        </div>
                    </motion.div>
                ) : currentStep === 3 ? (
                    <motion.div key="quiz-ended" className="flex flex-col items-center justify-center flex-1 p-4">
                        <div className="max-w-md w-full space-y-8 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">Quiz Ended!</h1>
                            {/* Fetch and show winner from leaderboard */}
                            <ShowWinnerComponent code={code} />
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}

export default JoinQuiz;