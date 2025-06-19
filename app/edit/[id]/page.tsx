"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import CreateQuiz from "@/components/create-quiz"  // Updated import path
import { useRouter } from "next/navigation"

export default function EditQuiz() {
  const params = useParams()
  const router = useRouter()
  const [actualQuizId, setActualQuizId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchQuizId = async () => {
      try {
        // Get the quiz document from the quizzes collection
        const quizDocRef = doc(db, "quizzes", params.id as string)
        const quizDoc = await getDoc(quizDocRef)
        
        if (quizDoc.exists()) {
          // Get the actual quiz ID that references the document in created-quiz collection
          const data = quizDoc.data()
          setActualQuizId(data.id)
        } else {
          console.error("Quiz not found in quizzes collection")
          router.push("/my-quizzes")
        }
      } catch (error) {
        console.error("Error fetching quiz:", error)
        router.push("/my-quizzes")
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuizId()
  }, [params.id, router])
  
  if (loading) {
    return <div className="container py-6 ml-[300px]">Loading...</div>
  }
  
  if (!actualQuizId) {
    return null
  }
  
  return <CreateQuiz quizId={actualQuizId} isEditing={true} />
}