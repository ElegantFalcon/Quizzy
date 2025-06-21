"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Library, Plus, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              Q
            </div>
            Quizzy
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <SidebarTrigger className="md:hidden" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>

        <div className="px-4 py-2">

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full justify-start gap-2" size="sm">
              <Plus className="h-4 w-4" /> New Quiz
            </Button>
          </motion.div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/my-quizzes"}>
              <Link href="/my-quizzes">
                <Library className="h-4 w-4" />
                <span>My Quizzes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
              <Link href="/analytics">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>
              {user?.displayName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            {user ? (
              <>
                <p className="text-sm font-medium">
                  {user.displayName || "Unnamed User"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Not logged in</p>
                <p className="text-xs text-muted-foreground">Guest</p>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
