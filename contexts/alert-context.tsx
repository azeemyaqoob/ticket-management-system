"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTickets } from "./ticket-context"
import { useAuth } from "./auth-context"

export type AlertType = "info" | "warning" | "error" | "success"

export interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  ticketId?: string
  createdAt: string
  read: boolean
  persistent?: boolean
}

interface AlertContextType {
  alerts: Alert[]
  unreadCount: number
  addAlert: (alert: Omit<Alert, "id" | "createdAt" | "read">) => void
  markAsRead: (alertId: string) => void
  markAllAsRead: () => void
  dismissAlert: (alertId: string) => void
  clearAllAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function useAlerts() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider")
  }
  return context
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { tickets } = useTickets()
  const { user } = useAuth()

  // Check for expired tickets and create alerts
  useEffect(() => {
    if (!user || tickets.length === 0) return

    const now = new Date()
    const userTickets =
      user.role === "admin"
        ? tickets
        : tickets.filter((ticket) => ticket.assignedTo === user.email || ticket.createdBy === user.email)

    // Find newly expired tickets
    const expiredTickets = userTickets.filter((ticket) => {
      const expirationDate = new Date(ticket.expirationDate)
      return expirationDate < now && ticket.status !== "completed" && ticket.status !== "expired"
    })

    // Find tickets expiring soon (within 24 hours)
    const soonToExpireTickets = userTickets.filter((ticket) => {
      const expirationDate = new Date(ticket.expirationDate)
      const hoursUntilExpiration = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      return hoursUntilExpiration > 0 && hoursUntilExpiration <= 24 && ticket.status !== "completed"
    })

    // Create alerts for expired tickets
    expiredTickets.forEach((ticket) => {
      const existingAlert = alerts.find((alert) => alert.ticketId === ticket.id && alert.type === "error")

      if (!existingAlert) {
        addAlert({
          type: "error",
          title: "Ticket Expired",
          message: `Ticket #${ticket.ticketNumber} has expired and requires immediate attention.`,
          ticketId: ticket.id,
          persistent: true,
        })
      }
    })

    // Create alerts for tickets expiring soon
    soonToExpireTickets.forEach((ticket) => {
      const expirationDate = new Date(ticket.expirationDate)
      const hoursUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60))

      const existingAlert = alerts.find((alert) => alert.ticketId === ticket.id && alert.type === "warning")

      if (!existingAlert) {
        addAlert({
          type: "warning",
          title: "Ticket Expiring Soon",
          message: `Ticket #${ticket.ticketNumber} expires in ${hoursUntilExpiration} hours.`,
          ticketId: ticket.id,
        })
      }
    })
  }, [tickets, user, alerts])

  // Load alerts from localStorage
  useEffect(() => {
    const storedAlerts = localStorage.getItem("811-alerts")
    if (storedAlerts) {
      try {
        setAlerts(JSON.parse(storedAlerts))
      } catch (error) {
        console.error("Error loading alerts:", error)
      }
    }
  }, [])

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem("811-alerts", JSON.stringify(alerts))
  }, [alerts])

  const addAlert = (alertData: Omit<Alert, "id" | "createdAt" | "read">) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    }

    setAlerts((prev) => [newAlert, ...prev])
  }

  const markAsRead = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  const unreadCount = alerts.filter((alert) => !alert.read).length

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        addAlert,
        markAsRead,
        markAllAsRead,
        dismissAlert,
        clearAllAlerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}
