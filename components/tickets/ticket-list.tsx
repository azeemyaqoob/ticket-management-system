"use client"

import { useTickets } from "@/contexts/ticket-context"
import { TicketCard } from "./ticket-card"
import { TicketFilters } from "./ticket-filters"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { TicketForm } from "./ticket-form"

export function TicketList() {
  const { filteredTickets, isLoading } = useTickets()
  const [showCreateForm, setShowCreateForm] = useState(false)

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Ticket</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>
        <TicketForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">811 Tickets</h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <TicketFilters />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No tickets found matching your criteria.</div>
          ) : (
            filteredTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      )}
    </div>
  )
}
