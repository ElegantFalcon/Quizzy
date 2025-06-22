"use client"

import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showBackground={true} />
      <main className="container max-w-3xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-center">Help &amp; FAQ</h1>
          <p className="text-muted-foreground text-center text-lg">
            Find answers to common questions and learn how to use Quizzy.
          </p>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Create a Quiz:</strong> Click <span className="font-semibold">Create Quiz</span> on the home page. Fill in the quiz details, add questions, and save.
              </li>
              <li>
                <strong>Join a Quiz:</strong> Click <span className="font-semibold">Join Quiz</span> and enter the code provided by the host.
              </li>
              <li>
                <strong>Waiting Room:</strong> After joining, wait for the host to start the quiz. You’ll see a countdown when the quiz begins.
              </li>
              <li>
                <strong>Answering Questions:</strong> Select your answer before the timer runs out. Points are awarded for correct answers.
              </li>
              <li>
                <strong>Leaderboard:</strong> Track your ranking in real time as you play.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Managing Quizzes</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>My Quizzes:</strong> View, edit, or delete your quizzes from the <span className="font-semibold">My Quizzes</span> page.
              </li>
              <li>
                <strong>Edit a Quiz:</strong> Click the <span className="font-semibold">Edit</span> button on any quiz card to update questions or settings.
              </li>
              <li>
                <strong>Start Waiting Room:</strong> Activate the waiting room to let participants join before starting the quiz.
              </li>
              <li>
                <strong>Start Quiz:</strong> Begin the quiz for all participants. Questions will advance automatically.
              </li>
              <li>
                <strong>View Analytics:</strong> See participation stats and performance insights for your quizzes.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <strong>How do I generate a room code?</strong>
                <p className="text-muted-foreground">Room codes are generated automatically when you create a quiz, or you can click the <span className="font-semibold">Generate</span> button in the quiz editor.</p>
              </div>
              <div>
                <strong>Can I edit a quiz after saving?</strong>
                <p className="text-muted-foreground">Yes, go to <span className="font-semibold">My Quizzes</span> and click <span className="font-semibold">Edit</span> on the quiz you want to update.</p>
              </div>
              <div>
                <strong>How do I see the leaderboard?</strong>
                <p className="text-muted-foreground">The leaderboard is shown at the end of each quiz and can be accessed from the results page.</p>
              </div>
              <div>
                <strong>How do I contact support?</strong>
                <p className="text-muted-foreground">For further help, email <a href="mailto:support@quizzy.com" className="underline">support@quizzy.com</a>.</p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}