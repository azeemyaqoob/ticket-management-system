"use client"

import { useAlerts } from "@/contexts/alert-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const alertVariants = {
  info: "default",
  warning: "default",
  error: "destructive",
  success: "default",
} as const

export function AlertBanner() {
  const { alerts, dismissAlert, markAsRead } = useAlerts()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  // Show only the most recent unread alert that hasn't been dismissed
  const activeAlert = alerts.find((alert) => !alert.read && !dismissed.has(alert.id))

  if (!activeAlert) return null

  const Icon = alertIcons[activeAlert.type]

  const handleDismiss = () => {
    setDismissed((prev) => new Set(prev).add(activeAlert.id))
    markAsRead(activeAlert.id)

    // If it's not persistent, remove it completely after a delay
    if (!activeAlert.persistent) {
      setTimeout(() => {
        dismissAlert(activeAlert.id)
      }, 300)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Alert
        variant={alertVariants[activeAlert.type]}
        className="shadow-lg border-2 animate-in slide-in-from-right-full duration-300"
      >
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          <div className="font-semibold">{activeAlert.title}</div>
          <AlertDescription className="mt-1">{activeAlert.message}</AlertDescription>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  )
}
