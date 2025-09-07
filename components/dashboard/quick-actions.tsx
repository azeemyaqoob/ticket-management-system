"use client"

import { useAuth } from "@/contexts/auth-context"
import { useTickets } from "@/contexts/ticket-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Users, Settings, Database } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const { user } = useAuth()
  const { tickets } = useTickets()

  const handleExportData = () => {
    const dataStr = JSON.stringify(tickets, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `811-tickets-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/dashboard/tickets">
          <Button className="w-full justify-start gap-3">
            <Plus className="h-4 w-4" />
            Create New Ticket
          </Button>
        </Link>

        {user?.role === "admin" && (
          <>
            <Link href="/dashboard/import">
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <Database className="h-4 w-4" />
                Data Management
              </Button>
            </Link>

            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Quick Export
            </Button>

            <Link href="/dashboard/users">
              <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
          </>
        )}

        <Link href="/dashboard/settings">
          <Button variant="outline" className="w-full justify-start gap-3 bg-transparent">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
