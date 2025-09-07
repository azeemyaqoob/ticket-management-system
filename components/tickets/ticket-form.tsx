"use client"

import type React from "react"

import { useState } from "react"
import { useTickets } from "@/contexts/ticket-context"
import { useAuth } from "@/contexts/auth-context"
import type { Ticket, TicketStatus, TicketPriority } from "@/types/ticket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface TicketFormProps {
  ticket?: Ticket
  onSuccess: () => void
}

export function TicketForm({ ticket, onSuccess }: TicketFormProps) {
  const { createTicket, updateTicket, isLoading } = useTickets()
  const { user } = useAuth()
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: ticket?.title || "",
    description: ticket?.description || "",
    status: ticket?.status || ("pending" as TicketStatus),
    priority: ticket?.priority || ("medium" as TicketPriority),
    assignedTo: ticket?.assignedTo || "",
    workType: ticket?.workType || "",
    estimatedDuration: ticket?.estimatedDuration || 1,
    expirationDate: ticket?.expirationDate ? new Date(ticket.expirationDate).toISOString().split("T")[0] : "",
    address: ticket?.location.address || "",
    city: ticket?.location.city || "",
    state: ticket?.location.state || "",
    zipCode: ticket?.location.zipCode || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.description || !formData.address || !formData.expirationDate) {
      setError("Please fill in all required fields")
      return
    }

    const ticketData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo || undefined,
      createdBy: user?.email || "",
      workType: formData.workType,
      estimatedDuration: formData.estimatedDuration,
      expirationDate: new Date(formData.expirationDate).toISOString(),
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      notes: ticket?.notes || [],
      attachments: ticket?.attachments || [],
    }

    let success = false
    if (ticket) {
      success = await updateTicket(ticket.id, ticketData)
    } else {
      success = await createTicket(ticketData)
    }

    if (success) {
      onSuccess()
    } else {
      setError("Failed to save ticket. Please try again.")
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter ticket title"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workType">Work Type</Label>
              <Input
                id="workType"
                value={formData.workType}
                onChange={(e) => setFormData((prev) => ({ ...prev, workType: e.target.value }))}
                placeholder="e.g., Excavation, Utility Verification"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the work to be performed"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TicketStatus) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TicketPriority) => setFormData((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Duration (hours)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, estimatedDuration: Number.parseFloat(e.target.value) || 1 }))
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Enter email address"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date *</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, expirationDate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  placeholder="State"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="ZIP Code"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {ticket ? "Updating..." : "Creating..."}
                </>
              ) : ticket ? (
                "Update Ticket"
              ) : (
                "Create Ticket"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
