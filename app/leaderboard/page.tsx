"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Leaderboard, type Participant } from "@/components/leaderboard"

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
  // Initialize participants
  useEffect(() => {
    setParticipants(generateParticipants(15))
  }, [])


  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard</h1>
        </div>

        <div className="space-y-8">
              <div>
                <Leaderboard
                  participants={participants}
                />
              </div>
        </div>
      </motion.div>
    </div>
  )
}
