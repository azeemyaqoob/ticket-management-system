"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, User } from "lucide-react"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@811system.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "John Contractor",
    email: "contractor@811system.com",
    role: "contractor",
    status: "active",
    lastLogin: "2024-01-15T09:15:00Z",
  },
]

export default function UsersPage() {
  return (
    <DashboardLayout>
      <AuthGuard requiredRole="admin">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage system users and their permissions.</p>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="grid gap-4">
            {mockUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {user.role === "admin" ? <Shield className="h-6 w-6" /> : <User className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AuthGuard>
    </DashboardLayout>
  )
}
