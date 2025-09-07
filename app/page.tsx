"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        redirect("/dashboard")
      } else {
        redirect("/auth")
      }
    }
  }, [user, isLoading])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
