"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTickets } from "@/contexts/ticket-context"
import { useAuth } from "@/contexts/auth-context"
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export function TicketStatusAlerts() {
  const { tickets } = useTickets()
  const { user } = useAuth()

  if (!user) return null

  // Filter tickets based on user role
  const userTickets =
    user.role === "admin"
      ? tickets
      : tickets.filter((ticket) => ticket.assignedTo === user.email || ticket.createdBy === user.email)

  const now = new Date()

  // Categorize tickets by urgency
  const expiredTickets = userTickets.filter(
    (ticket) => new Date(ticket.expirationDate) < now && ticket.status !== "completed",
  )

  const criticalTickets = userTickets.filter((ticket) => {
    const hoursUntilExpiration = (new Date(ticket.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilExpiration > 0 && hoursUntilExpiration <= 4 && ticket.status !== "completed"
  })

  const warningTickets = userTickets.filter((ticket) => {
    const hoursUntilExpiration = (new Date(ticket.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilExpiration > 4 && hoursUntilExpiration <= 24 && ticket.status !== "completed"
  })

  const hasAlerts = expiredTickets.length > 0 || criticalTickets.length > 0 || warningTickets.length > 0

  if (!hasAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            All Clear
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No urgent tickets requiring immediate attention.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {expiredTickets.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Expired Tickets ({expiredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiredTickets.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">#{ticket.ticketNumber}</p>
                </div>
                <Badge variant="destructive">EXPIRED</Badge>
              </div>
            ))}
            {expiredTickets.length > 3 && (
              <p className="text-xs text-muted-foreground">+{expiredTickets.length - 3} more expired tickets</p>
            )}
            <Link href="/dashboard/tickets">
              <Button variant="destructive" size="sm" className="w-full">
                View All Expired Tickets
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {criticalTickets.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Critical - Expiring Soon ({criticalTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalTickets.slice(0, 3).map((ticket) => {
              const hoursLeft = Math.floor(
                (new Date(ticket.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60),
              )
              return (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">#{ticket.ticketNumber}</p>
                  </div>
                  <Badge variant="destructive">{hoursLeft}h left</Badge>
                </div>
              )
            })}
            {criticalTickets.length > 3 && (
              <p className="text-xs text-muted-foreground">+{criticalTickets.length - 3} more critical tickets</p>
            )}
            <Link href="/dashboard/tickets">
              <Button variant="outline" size="sm" className="w-full border-orange-200 bg-transparent">
                View Critical Tickets
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {warningTickets.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              Expiring Today ({warningTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warningTickets.slice(0, 2).map((ticket) => {
              const hoursLeft = Math.floor(
                (new Date(ticket.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60),
              )
              return (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground">#{ticket.ticketNumber}</p>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                    {hoursLeft}h left
                  </Badge>
                </div>
              )
            })}
            {warningTickets.length > 2 && (
              <p className="text-xs text-muted-foreground">+{warningTickets.length - 2} more tickets expiring today</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
