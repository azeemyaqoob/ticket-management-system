"use client"

import { useAuth } from "@/contexts/auth-context"
import { useTickets } from "@/contexts/ticket-context"
import { AlertCenter } from "@/components/alerts/alert-center"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Ticket, Users, Settings, LogOut, AlertTriangle, Database } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "contractor"],
  },
  {
    name: "Tickets",
    href: "/dashboard/tickets",
    icon: Ticket,
    roles: ["admin", "contractor"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Import Data",
    href: "/dashboard/import",
    icon: Database,
    roles: ["admin"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "contractor"],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { tickets } = useTickets()
  const pathname = usePathname()

  if (!user) return null

  // Calculate expired tickets count
  const expiredTickets = tickets.filter(
    (ticket) => new Date(ticket.expirationDate) < new Date() && ticket.status !== "completed",
  ).length

  const filteredNavigation = navigation.filter((item) => item.roles.includes(user.role))

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">811</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">811 System</h2>
              <p className="text-xs text-muted-foreground">Ticket Management</p>
            </div>
          </div>
          <AlertCenter />
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-3">
                <Icon className="h-4 w-4" />
                {item.name}
                {item.name === "Tickets" && expiredTickets > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {expiredTickets}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
