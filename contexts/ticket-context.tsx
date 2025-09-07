"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Ticket, TicketFilters } from "@/types/ticket"
import { generateMockTickets, generateRealisticScenarios } from "@/utils/mock-data-generator"

interface TicketContextType {
  tickets: Ticket[]
  filteredTickets: Ticket[]
  filters: TicketFilters
  isLoading: boolean
  createTicket: (ticket: Omit<Ticket, "id" | "ticketNumber" | "createdAt" | "updatedAt">) => Promise<boolean>
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<boolean>
  deleteTicket: (id: string) => Promise<boolean>
  getTicket: (id: string) => Ticket | undefined
  setFilters: (filters: TicketFilters) => void
  clearFilters: () => void
  importMockData: () => void
  importRealisticScenarios: () => void
  importCustomData: (data: Ticket[]) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filters, setFiltersState] = useState<TicketFilters>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load tickets from localStorage on mount
  useEffect(() => {
    const storedTickets = localStorage.getItem("811-tickets")
    if (storedTickets) {
      try {
        setTickets(JSON.parse(storedTickets))
      } catch (error) {
        console.error("Error loading tickets:", error)
        setTickets(generateMockTickets(10))
      }
    } else {
      setTickets(generateMockTickets(10))
    }
  }, [])

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem("811-tickets", JSON.stringify(tickets))
    }
  }, [tickets])

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(ticket.status)) {
      return false
    }
    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(ticket.priority)) {
      return false
    }
    if (filters.assignedTo && ticket.assignedTo !== filters.assignedTo) {
      return false
    }
    if (filters.createdBy && ticket.createdBy !== filters.createdBy) {
      return false
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const searchableText =
        `${ticket.title} ${ticket.description} ${ticket.ticketNumber} ${ticket.location.address}`.toLowerCase()
      if (!searchableText.includes(query)) {
        return false
      }
    }
    if (filters.dateRange) {
      const ticketDate = new Date(ticket.createdAt)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      if (ticketDate < startDate || ticketDate > endDate) {
        return false
      }
    }
    return true
  })

  const createTicket = async (
    ticketData: Omit<Ticket, "id" | "ticketNumber" | "createdAt" | "updatedAt">,
  ): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      ticketNumber: `811-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTickets((prev) => [newTicket, ...prev])
    setIsLoading(false)
    return true
  }

  const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
      ),
    )

    setIsLoading(false)
    return true
  }

  const deleteTicket = async (id: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
    setIsLoading(false)
    return true
  }

  const getTicket = (id: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.id === id)
  }

  const setFilters = (newFilters: TicketFilters) => {
    setFiltersState(newFilters)
  }

  const clearFilters = () => {
    setFiltersState({})
  }

  const importMockData = () => {
    const mockTickets = generateMockTickets(25)
    setTickets(mockTickets)
  }

  const importRealisticScenarios = () => {
    const scenarios = generateRealisticScenarios()
    setTickets(scenarios)
  }

  const importCustomData = (data: Ticket[]) => {
    setTickets(data)
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        filteredTickets,
        filters,
        isLoading,
        createTicket,
        updateTicket,
        deleteTicket,
        getTicket,
        setFilters,
        clearFilters,
        importMockData,
        importRealisticScenarios,
        importCustomData,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}
