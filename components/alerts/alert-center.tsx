"use client"

import { useAlerts } from "@/contexts/alert-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const alertColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
}

export function AlertCenter() {
  const { alerts, unreadCount, markAsRead, markAllAsRead, dismissAlert, clearAllAlerts } = useAlerts()
  const [isOpen, setIsOpen] = useState(false)

  const sortedAlerts = alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                {alerts.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllAlerts}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1 p-4 pt-0">
                  {sortedAlerts.map((alert) => {
                    const Icon = alertIcons[alert.type]
                    const iconColor = alertColors[alert.type]

                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          alert.read ? "bg-muted/30 border-muted" : "bg-background border-border hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${alert.read ? "text-muted-foreground" : ""}`}>
                                  {alert.title}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${alert.read ? "text-muted-foreground" : "text-muted-foreground"}`}
                                >
                                  {alert.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(alert.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                onClick={() => dismissAlert(alert.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {!alert.read && (
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => markAsRead(alert.id)}
                            >
                              Mark as read
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
