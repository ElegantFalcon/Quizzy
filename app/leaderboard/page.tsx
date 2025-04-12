"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Leaderboard, type Participant } from "@/components/leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shuffle } from "lucide-react"

// Generate random participants
const generateParticipants = (count: number): Participant[] => {
  const codeNames = [
    "NeonNinja",
    "PixelPirate",
    "CyberSage",
    "QuantumQuasar",
    "ByteBaron",
    "DataDragon",
    "EchoElite",
    "FrostFalcon",
    "GlitchGuru",
    "HyperHawk",
    "IonImp",
    "JadeJester",
    "KryptoKnight",
    "LaserLynx",
    "MistMage",
    "NebulaNoble",
    "OmegaOracle",
    "PlasmaPhoenix",
    "QuasarQueen",
    "RiftRanger",
    "SolarSentinel",
    "TechTitan",
    "UltraUnicorn",
    "VortexViking",
    "WarpWizard",
    "XenonXenith",
    "YottaYeti",
    "ZenithZephyr",
    "AtomAce",
    "BinaryBard",
  ]

  return Array.from({ length: count }, (_, i) => {
    const name = codeNames[Math.floor(Math.random() * codeNames.length)]
    const points = Math.floor(Math.random() * 1000)
    const position = i + 1
    const correctAnswers = Math.floor(Math.random() * 10)
    const totalAnswers = correctAnswers + Math.floor(Math.random() * 5)
    const streak = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0

    return {
      id: `user-${i}`,
      name,
      points,
      position,
      previousPosition: position,
      isCurrentUser: i === 3, // Make the 4th user the current user
      correctAnswers,
      totalAnswers,
      streak,
    }
  })
}

export default function LeaderboardDemo() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(true)
  const [questionNumber, setQuestionNumber] = useState(1)

  // Initialize participants
  useEffect(() => {
    setParticipants(generateParticipants(15))
  }, [])

  // Shuffle scores and update positions
  const shuffleScores = () => {
    setParticipants((prev) => {
      // Store previous positions
      const prevPositions = prev.reduce(
        (acc, p) => {
          acc[p.id] = p.position
          return acc
        },
        {} as Record<string, number>,
      )

      // Create new array with updated points
      const updated = prev.map((p) => {
        const pointsChange = Math.floor(Math.random() * 100) - 20 // Random change between -20 and +80
        return {
          ...p,
          points: Math.max(0, p.points + pointsChange),
          streak: Math.random() > 0.7 ? p.streak! + 1 : 0,
          correctAnswers: Math.random() > 0.3 ? p.correctAnswers! + 1 : p.correctAnswers,
          totalAnswers: p.totalAnswers! + 1,
        }
      })

      // Sort by points
      const sorted = [...updated].sort((a, b) => b.points - a.points)

      // Update positions
      return sorted.map((p, i) => ({
        ...p,
        position: i + 1,
        previousPosition: prevPositions[p.id],
      }))
    })

    setQuestionNumber((prev) => prev + 1)
    setShowLeaderboard(true)
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard Demo</h1>
          <p className="text-muted-foreground">Interactive leaderboard with animations for quiz participants</p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Question {questionNumber} Results</h2>
            <Button onClick={shuffleScores} className="gap-2">
              <Shuffle className="h-4 w-4" />
              Next Question
            </Button>
          </div>

          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="variants">Top 3</TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard" className="mt-4">
              {showLeaderboard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Leaderboard
                    participants={participants}
                    title={`Leaderboard - Question ${questionNumber}`}
                    description="Top participants by points"
                    onClose={() => setShowLeaderboard(false)}
                  />
                </motion.div>
              )}

              {!showLeaderboard && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground mb-4">Leaderboard is hidden</p>
                  <Button onClick={() => setShowLeaderboard(true)}>Show Leaderboard</Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="variants" className="mt-4 space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Compact Leaderboard (Top 3)</h3>
                <Leaderboard
                  participants={participants}
                  title="Top Players"
                  description="Leading participants"
                  limit={3}
                  showExpandButton={false}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Full Leaderboard</h3>
                <Leaderboard
                  participants={participants}
                  title="Complete Rankings"
                  description="All participants ranked by score"
                  limit={participants.length}
                  showExpandButton={false}
                />
              </div>
            </TabsContent>
          </Tabs>

         
        </div>
      </motion.div>
    </div>
  )
}
