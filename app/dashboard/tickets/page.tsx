"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TicketList } from "@/components/tickets/ticket-list"

export default function TicketsPage() {
  return (
    <DashboardLayout>
      <TicketList />
    </DashboardLayout>
  )
}
