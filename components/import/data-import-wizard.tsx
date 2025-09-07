"use client"

import { useState } from "react"
import { useTickets } from "@/contexts/ticket-context"
import { useAlerts } from "@/contexts/alert-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateMockTickets, generateRealisticScenarios } from "@/utils/mock-data-generator"
import { Upload, Download, Database, FileText, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

type ImportStep = "select" | "preview" | "importing" | "complete"

export function DataImportWizard() {
  const { tickets, importMockData } = useTickets()
  const { addAlert } = useAlerts()
  const [currentStep, setCurrentStep] = useState<ImportStep>("select")
  const [importProgress, setImportProgress] = useState(0)
  const [selectedOption, setSelectedOption] = useState<"mock" | "scenarios" | "file">("mock")
  const [previewData, setPreviewData] = useState<any[]>([])
  const [importCount, setImportCount] = useState(25)

  const handlePreview = () => {
    let data: any[] = []

    if (selectedOption === "mock") {
      data = generateMockTickets(importCount)
    } else if (selectedOption === "scenarios") {
      data = generateRealisticScenarios()
    }

    setPreviewData(data)
    setCurrentStep("preview")
  }

  const handleImport = async () => {
    setCurrentStep("importing")
    setImportProgress(0)

    // Simulate import progress
    const progressInterval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 20
      })
    }, 200)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (selectedOption === "mock" || selectedOption === "scenarios") {
      importMockData()
    }

    clearInterval(progressInterval)
    setImportProgress(100)

    setTimeout(() => {
      setCurrentStep("complete")
      addAlert({
        type: "success",
        title: "Data Import Complete",
        message: `Successfully imported ${previewData.length} tickets into the system.`,
      })
    }, 500)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(tickets, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `811-tickets-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    addAlert({
      type: "success",
      title: "Export Complete",
      message: `Exported ${tickets.length} tickets to JSON file.`,
    })
  }

  const resetWizard = () => {
    setCurrentStep("select")
    setImportProgress(0)
    setPreviewData([])
  }

  return (
    <div className="space-y-6">
      <Tabs value={currentStep === "complete" ? "import" : "import"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {currentStep === "select" && (
            <Card>
              <CardHeader>
                <CardTitle>Select Import Option</CardTitle>
                <CardDescription>Choose how you want to import ticket data into the system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === "mock" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedOption("mock")}
                  >
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold">Generate Mock Data</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create realistic sample tickets for testing and demonstration
                        </p>
                        {selectedOption === "mock" && (
                          <div className="mt-3 space-y-2">
                            <Label htmlFor="count">Number of tickets to generate</Label>
                            <Input
                              id="count"
                              type="number"
                              min="1"
                              max="100"
                              value={importCount}
                              onChange={(e) => setImportCount(Number.parseInt(e.target.value) || 25)}
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === "scenarios" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedOption("scenarios")}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold">Realistic Scenarios</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Import pre-defined realistic scenarios including emergency and routine tickets
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors opacity-50 ${
                      selectedOption === "file" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold">Upload JSON File</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Import tickets from a previously exported JSON file
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Importing data will replace all existing tickets. Make sure to export your
                    current data first if you want to keep it.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button onClick={handlePreview} disabled={selectedOption === "file"}>
                    Preview Data
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Current Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "preview" && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Import Data</CardTitle>
                <CardDescription>
                  Review the data that will be imported. This will replace all existing tickets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ready to import {previewData.length} tickets</p>
                    <p className="text-sm text-muted-foreground">
                      Current system has {tickets.length} tickets that will be replaced
                    </p>
                  </div>
                  <Badge variant="outline">{previewData.length} tickets</Badge>
                </div>

                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {previewData.slice(0, 5).map((ticket, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="text-sm font-medium">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground">#{ticket.ticketNumber}</p>
                        </div>
                        <Badge variant="outline">{ticket.status}</Badge>
                      </div>
                    ))}
                    {previewData.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        ... and {previewData.length - 5} more tickets
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleImport}>Confirm Import</Button>
                  <Button variant="outline" onClick={() => setCurrentStep("select")}>
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "importing" && (
            <Card>
              <CardHeader>
                <CardTitle>Importing Data</CardTitle>
                <CardDescription>Please wait while we import your ticket data...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Importing {previewData.length} tickets...</span>
                </div>
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">{Math.round(importProgress)}% complete</p>
              </CardContent>
            </Card>
          )}

          {currentStep === "complete" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Import Complete
                </CardTitle>
                <CardDescription>Your ticket data has been successfully imported.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-sm">
                    Successfully imported <strong>{previewData.length} tickets</strong> into the system. You can now
                    view and manage these tickets from the dashboard.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={resetWizard}>Import More Data</Button>
                  <Button variant="outline" asChild>
                    <a href="/dashboard/tickets">View Tickets</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Current Data</CardTitle>
              <CardDescription>
                Download your current ticket data as a JSON file for backup or migration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Current System Data</p>
                  <p className="text-sm text-muted-foreground">{tickets.length} tickets ready for export</p>
                </div>
                <Badge variant="outline">{tickets.length} tickets</Badge>
              </div>

              <Button onClick={handleExport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export to JSON File
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
