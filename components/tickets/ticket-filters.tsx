"use client"

import { useTickets } from "@/contexts/ticket-context"
import type { TicketFilters as ITicketFilters, TicketStatus, TicketPriority } from "@/types/ticket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const statusOptions: TicketStatus[] = ["pending", "in-progress", "completed", "expired", "cancelled"]
const priorityOptions: TicketPriority[] = ["low", "medium", "high", "critical"]

export function TicketFilters() {
  const { filters, setFilters, clearFilters, filteredTickets, tickets } = useTickets()
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<ITicketFilters>(filters)

  const applyFilters = () => {
    setFilters(localFilters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    clearFilters()
  }

  const toggleStatus = (status: TicketStatus) => {
    const currentStatuses = localFilters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status]

    setLocalFilters((prev) => ({
      ...prev,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    }))
  }

  const togglePriority = (priority: TicketPriority) => {
    const currentPriorities = localFilters.priority || []
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority]

    setLocalFilters((prev) => ({
      ...prev,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    }))
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.keys(filters).length}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search tickets by title, description, or ticket number..."
                  value={localFilters.searchQuery || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      searchQuery: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Badge
                      key={status}
                      variant={localFilters.status?.includes(status) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(status)}
                    >
                      {status.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((priority) => (
                    <Badge
                      key={priority}
                      variant={localFilters.priority?.includes(priority) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePriority(priority)}
                    >
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outline" onClick={() => setLocalFilters({})}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
