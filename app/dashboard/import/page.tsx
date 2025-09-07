"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DataImportWizard } from "@/components/import/data-import-wizard"

export default function ImportPage() {
  return (
    <DashboardLayout>
      <AuthGuard requiredRole="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Data Management</h1>
            <p className="text-muted-foreground">
              Import sample data, realistic scenarios, or export your current ticket data for backup and migration.
            </p>
          </div>

          <DataImportWizard />
        </div>
      </AuthGuard>
    </DashboardLayout>
  )
}
