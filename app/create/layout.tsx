import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

function CreateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <DashboardSidebar />
                <main className="flex-1">{children}</main>
            </div>
        </SidebarProvider>
    )
}

export default CreateLayout;