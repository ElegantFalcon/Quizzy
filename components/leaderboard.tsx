"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, ChevronDown, ChevronUp, Medal, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types for the leaderboard
export type Participant = {
  id: string
  name: string
  avatar?: string
  points: number
  position: number
  previousPosition: number
  isCurrentUser?: boolean
  streak?: number
  correctAnswers?: number
  totalAnswers?: number
}

type LeaderboardProps = {
  participants: Participant[]
  title?: string
  description?: string
  limit?: number
  showExpandButton?: boolean
  className?: string
  onClose?: () => void
}

export function Leaderboard({
  participants,
  title = "Leaderboard",
  description = "Top participants by points",
  limit = 5,
  showExpandButton = true,
  className,
  onClose,
}: LeaderboardProps) {
 // const [expanded, setExpanded] = useState(false)
  const [sortedParticipants, setSortedParticipants] = useState<Participant[]>([])
  const [showAll, setShowAll] = useState(false)

  // Sort participants by points and update positions
  useEffect(() => {
    const sorted = [...participants].sort((a, b) => b.points - a.points)
    setSortedParticipants(sorted)
  }, [participants])

  // Get the participants to display based on limit and expanded state
  const displayParticipants = showAll ? sortedParticipants : sortedParticipants.slice(0, limit)

  // Find the current user if they're outside the displayed list
  const currentUser = !showAll ? sortedParticipants.find((p) => p.isCurrentUser && p.position > limit) : undefined

  // Get position change icon and color
  const getPositionChange = (participant: Participant) => {
    const change = participant.previousPosition - participant.position

    if (change > 0) {
      return { icon: <ChevronUp className="h-4 w-4 text-green-500" />, text: `+${change}` }
    } else if (change < 0) {
      return { icon: <ChevronDown className="h-4 w-4 text-red-500" />, text: `${change}` }
    } else {
      return { icon: <span className="h-4 w-4 inline-flex items-center justify-center">-</span>, text: "" }
    }
  }

  // Get medal for top 3 positions
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

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get random color for avatar fallback
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
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {displayParticipants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <div
                  className={cn(
                    "flex items-center p-3 rounded-lg",
                    participant.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 font-semibold text-muted-foreground">
                      {getMedal(participant.position) || participant.position}
                    </div>

                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback className={getAvatarColor(participant.id)}>
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>

                      {participant.streak && participant.streak >= 3 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                          title={`${participant.streak} correct answers in a row`}
                        >
                          🔥
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-medium truncate">
                          {participant.name}
                          {participant.isCurrentUser && " (You)"}
                        </p>
                        {participant.isCurrentUser && (
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      {participant.correctAnswers !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {participant.correctAnswers} / {participant.totalAnswers} correct
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getPositionChange(participant).icon}
                      <span>{getPositionChange(participant).text}</span>
                    </div>

                    <motion.div
                      className="font-bold text-lg tabular-nums w-16 text-right"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1], color: ["#000", "#7c3aed", "#000"] }}
                      transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                    >
                      {participant.points}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Show current user if they're outside the limit */}
            {currentUser && !showAll && (
              <>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">
                      {currentUser.position - limit} more participants
                    </span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: displayParticipants.length * 0.05 }}
                >
                  <div className="flex items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 font-semibold text-muted-foreground">
                        {currentUser.position}
                      </div>

                      <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                        <AvatarFallback className={getAvatarColor(currentUser.id)}>
                          {getInitials(currentUser.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="font-medium truncate">{currentUser.name} (You)</p>
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary text-xs">
                            You
                          </Badge>
                        </div>
                        {currentUser.correctAnswers !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {currentUser.correctAnswers} / {currentUser.totalAnswers} correct
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getPositionChange(currentUser).icon}
                        <span>{getPositionChange(currentUser).text}</span>
                      </div>

                      <div className="font-bold text-lg tabular-nums w-16 text-right">{currentUser.points}</div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {showExpandButton && sortedParticipants.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-muted-foreground"
            >
              {showAll ? (
                <>
                  Show less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Show all <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
