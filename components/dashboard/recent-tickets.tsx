"use client"

import { useTickets } from "@/contexts/ticket-context"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function RecentTickets() {
  const { tickets } = useTickets()
  const { user } = useAuth()

  // Filter and sort tickets based on user role
  const userTickets =
    user?.role === "admin"
      ? tickets
      : tickets.filter((ticket) => ticket.assignedTo === user?.email || ticket.createdBy === user?.email)

  const recentTickets = userTickets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Tickets</CardTitle>
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentTickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tickets found. Create your first ticket to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {recentTickets.map((ticket) => {
              const isExpired = new Date(ticket.expirationDate) < new Date() && ticket.status !== "completed"

              return (
                <div
                  key={ticket.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{ticket.title}</h4>
                      {isExpired && (
                        <Badge variant="destructive" className="text-xs">
                          EXPIRED
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">#{ticket.ticketNumber}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {ticket.location.city}, {ticket.location.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Expires: {new Date(ticket.expirationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Badge className={statusColors[ticket.status]}>{ticket.status.replace("-", " ")}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
