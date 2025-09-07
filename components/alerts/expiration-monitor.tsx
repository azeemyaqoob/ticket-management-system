"use client"

import { useEffect } from "react"
import { useTickets } from "@/contexts/ticket-context"
import { useAlerts } from "@/contexts/alert-context"
import { useAuth } from "@/contexts/auth-context"

export function ExpirationMonitor() {
  const { tickets, updateTicket } = useTickets()
  const { addAlert } = useAlerts()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const checkExpirations = () => {
      const now = new Date()

      tickets.forEach(async (ticket) => {
        const expirationDate = new Date(ticket.expirationDate)

        // Auto-expire tickets that are past due and not completed
        if (expirationDate < now && ticket.status !== "completed" && ticket.status !== "expired") {
          await updateTicket(ticket.id, { status: "expired" })

          // Only create alert if user is involved with this ticket
          const isUserInvolved =
            user.role === "admin" || ticket.assignedTo === user.email || ticket.createdBy === user.email

          if (isUserInvolved) {
            addAlert({
              type: "error",
              title: "Ticket Auto-Expired",
              message: `Ticket #${ticket.ticketNumber} has been automatically marked as expired.`,
              ticketId: ticket.id,
              persistent: true,
            })
          }
        }

        // Alert for tickets expiring in the next 4 hours (critical warning)
        const hoursUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60)
        if (hoursUntilExpiration > 0 && hoursUntilExpiration <= 4 && ticket.status !== "completed") {
          const isUserInvolved =
            user.role === "admin" || ticket.assignedTo === user.email || ticket.createdBy === user.email

          if (isUserInvolved) {
            addAlert({
              type: "warning",
              title: "Critical: Ticket Expiring Soon",
              message: `Ticket #${ticket.ticketNumber} expires in ${Math.floor(hoursUntilExpiration)} hours!`,
              ticketId: ticket.id,
            })
          }
        }
      })
    }

    // Check immediately
    checkExpirations()

    // Set up interval to check every 30 minutes
    const interval = setInterval(checkExpirations, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [tickets, updateTicket, addAlert, user])

  return null // This is a monitoring component with no UI
}
