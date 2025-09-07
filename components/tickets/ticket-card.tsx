"use client"

import type { Ticket } from "@/types/ticket"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, User, Edit, Trash2 } from "lucide-react"
import { useTickets } from "@/contexts/ticket-context"
import { useState } from "react"
import { TicketForm } from "./ticket-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TicketCardProps {
  ticket: Ticket
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function TicketCard({ ticket }: TicketCardProps) {
  const { deleteTicket } = useTickets()
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteTicket(ticket.id)
    setIsDeleting(false)
  }

  const isExpired = new Date(ticket.expirationDate) < new Date() && ticket.status !== "completed"

  if (showEditForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Ticket</h3>
            <Button variant="outline" onClick={() => setShowEditForm(false)}>
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TicketForm ticket={ticket} onSuccess={() => setShowEditForm(false)} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all hover:shadow-md ${isExpired ? "border-red-200 dark:border-red-800" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{ticket.title}</h3>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  EXPIRED
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">#{ticket.ticketNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[ticket.status]}>{ticket.status.replace("-", " ")}</Badge>
            <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{ticket.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {ticket.location.address}, {ticket.location.city}, {ticket.location.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Expires: {new Date(ticket.expirationDate).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{ticket.estimatedDuration}h estimated</span>
          </div>

          {ticket.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Assigned to: {ticket.assignedTo}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditForm(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDeleting}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete ticket #{ticket.ticketNumber}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
