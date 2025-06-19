"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Participant = {
  id: string
  name: string
  avatar?: string
  points: number
  position: number
  previousPosition: number
  streak?: number
  correctAnswers?: number
  totalAnswers?: number
}

type LeaderboardProps = {
  participants: Participant[]
  className?: string
}

export function Leaderboard({ participants, className }: LeaderboardProps) {
  const [sortedParticipants, setSortedParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const sorted = [...participants].sort((a, b) => b.points - a.points)
    setSortedParticipants(sorted)
  }, [participants])

  const getMedal = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ]
    const index = id.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardContent>
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {sortedParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <div className="flex items-center p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 font-semibold text-muted-foreground">
                      {getMedal(index + 1) || index + 1}
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback className={getAvatarColor(participant.id)}>
                        {getInitials(participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{participant.name}</p>
                      {participant.correctAnswers !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {participant.correctAnswers} / {participant.totalAnswers} correct
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.div
                    className="font-bold text-lg tabular-nums w-16 text-right"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1], color: ["#000", "#7c3aed", "#FFFF"] }}
                    transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                  >
                    {participant.points}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
