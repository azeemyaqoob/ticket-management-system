export type TicketStatus = "pending" | "in-progress" | "completed" | "expired" | "cancelled"
export type TicketPriority = "low" | "medium" | "high" | "critical"

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  expirationDate: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  workType: string
  estimatedDuration: number // in hours
  notes: string[]
  attachments: string[]
}

export interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  assignedTo?: string
  createdBy?: string
  dateRange?: {
    start: string
    end: string
  }
  searchQuery?: string
}
