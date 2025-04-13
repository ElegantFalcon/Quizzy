"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import { useRouter } from "next/navigation"

export function UserProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
  }

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => router.push("/auth/login")}>
        Login
      </Button>
    )
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm hidden md:inline-block">
        {user.displayName || user.email}
      </span>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
        <AvatarFallback>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Logout
      </Button>
    </div>
  )
}