import type { Ticket, TicketStatus, TicketPriority } from "@/types/ticket"

const workTypes = [
  "Excavation",
  "Utility Verification",
  "Emergency Repair",
  "Routine Maintenance",
  "New Installation",
  "Line Marking",
  "Inspection",
  "Damage Assessment",
]

const locations = [
  { address: "123 Main Street", city: "Springfield", state: "IL", zipCode: "62701" },
  { address: "456 Oak Avenue", city: "Springfield", state: "IL", zipCode: "62702" },
  { address: "789 Elm Street", city: "Springfield", state: "IL", zipCode: "62703" },
  { address: "321 Pine Road", city: "Riverside", state: "IL", zipCode: "60546" },
  { address: "654 Maple Drive", city: "Aurora", state: "IL", zipCode: "60505" },
  { address: "987 Cedar Lane", city: "Naperville", state: "IL", zipCode: "60540" },
  { address: "147 Birch Street", city: "Joliet", state: "IL", zipCode: "60431" },
  { address: "258 Walnut Avenue", city: "Rockford", state: "IL", zipCode: "61101" },
  { address: "369 Cherry Boulevard", city: "Peoria", state: "IL", zipCode: "61601" },
  { address: "741 Ash Court", city: "Champaign", state: "IL", zipCode: "61820" },
]

const ticketTitles = [
  "Underground Utility Marking",
  "Gas Line Verification",
  "Emergency Water Line Repair",
  "Electrical Cable Location",
  "Sewer Line Inspection",
  "Fiber Optic Cable Marking",
  "Storm Drain Assessment",
  "Telecommunications Line Repair",
  "Water Main Installation",
  "Gas Service Connection",
]

const descriptions = [
  "Mark underground utilities for construction project",
  "Verify utility locations before excavation work",
  "Emergency marking required for utility repair",
  "Locate and mark utilities for safety compliance",
  "Inspection and marking of existing utility lines",
  "Mark utilities for new construction project",
  "Verify utility clearances for landscaping work",
  "Emergency response for utility damage",
  "Pre-construction utility location services",
  "Routine maintenance utility marking",
]

const userEmails = [
  "admin@811system.com",
  "contractor@811system.com",
  "john.smith@contractor.com",
  "sarah.johnson@utility.com",
  "mike.wilson@construction.com",
]

const statuses: TicketStatus[] = ["pending", "in-progress", "completed", "expired", "cancelled"]
const priorities: TicketPriority[] = ["low", "medium", "high", "critical"]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(daysFromNow: number, variance = 0): Date {
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + daysFromNow)

  if (variance > 0) {
    const varianceMs = variance * 24 * 60 * 60 * 1000
    const randomVariance = (Math.random() - 0.5) * 2 * varianceMs
    baseDate.setTime(baseDate.getTime() + randomVariance)
  }

  return baseDate
}

export function generateMockTickets(count = 25): Ticket[] {
  const tickets: Ticket[] = []

  for (let i = 0; i < count; i++) {
    const createdDate = getRandomDate(-30, 25) // Created within last 30 days with variance
    const status = getRandomElement(statuses)

    // Set expiration date based on status and creation date
    let expirationDate: Date
    if (status === "completed") {
      expirationDate = getRandomDate(-5, 10) // Completed tickets had expiration in the past
    } else if (status === "expired") {
      expirationDate = getRandomDate(-2, 5) // Expired tickets are past due
    } else {
      expirationDate = getRandomDate(2, 7) // Active tickets expire in the future
    }

    const location = getRandomElement(locations)
    const workType = getRandomElement(workTypes)
    const priority = getRandomElement(priorities)

    // Generate realistic notes based on status
    const notes: string[] = []
    if (status === "in-progress") {
      notes.push("Work has begun on site")
      if (Math.random() > 0.5) notes.push("Utilities located and marked")
    } else if (status === "completed") {
      notes.push("All utilities successfully marked")
      notes.push("Work completed without issues")
    } else if (status === "expired") {
      notes.push("Ticket expired - requires renewal")
    } else if (status === "pending") {
      notes.push("Awaiting field assignment")
    }

    const ticket: Ticket = {
      id: (Date.now() + i).toString(),
      ticketNumber: `811-${new Date().getFullYear()}-${String(i + 1).padStart(3, "0")}`,
      title: `${getRandomElement(ticketTitles)} - ${location.address}`,
      description: `${getRandomElement(descriptions)} at ${location.address}, ${location.city}`,
      status,
      priority,
      assignedTo: Math.random() > 0.3 ? getRandomElement(userEmails) : undefined,
      createdBy: getRandomElement(userEmails),
      createdAt: createdDate.toISOString(),
      updatedAt: getRandomDate(-1, 5).toISOString(),
      expirationDate: expirationDate.toISOString(),
      location: {
        ...location,
        coordinates: {
          lat: 39.7817 + (Math.random() - 0.5) * 0.1,
          lng: -89.6501 + (Math.random() - 0.5) * 0.1,
        },
      },
      workType,
      estimatedDuration: Math.floor(Math.random() * 8) + 1,
      notes,
      attachments: [],
    }

    tickets.push(ticket)
  }

  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function generateRealisticScenarios(): Ticket[] {
  const scenarios: Partial<Ticket>[] = [
    {
      title: "URGENT: Gas Line Emergency - Downtown",
      description: "Emergency gas line repair required due to construction damage",
      status: "in-progress",
      priority: "critical",
      workType: "Emergency Repair",
      estimatedDuration: 2,
      notes: ["Emergency response activated", "Gas company on site", "Area evacuated for safety"],
    },
    {
      title: "Fiber Optic Installation - Business District",
      description: "New fiber optic cable installation for commercial development",
      status: "pending",
      priority: "high",
      workType: "New Installation",
      estimatedDuration: 6,
      notes: ["Permits approved", "Awaiting contractor assignment"],
    },
    {
      title: "Routine Water Main Inspection",
      description: "Scheduled inspection of water main infrastructure",
      status: "completed",
      priority: "low",
      workType: "Inspection",
      estimatedDuration: 3,
      notes: ["Inspection completed successfully", "No issues found", "Report filed"],
    },
    {
      title: "School Zone Utility Marking",
      description: "Mark utilities for playground renovation project",
      status: "pending",
      priority: "medium",
      workType: "Utility Verification",
      estimatedDuration: 4,
      notes: ["School coordination required", "Work scheduled during school hours"],
    },
  ]

  return scenarios.map((scenario, index) => {
    const baseTicket = generateMockTickets(1)[0]
    return {
      ...baseTicket,
      ...scenario,
      id: `scenario-${index}`,
      ticketNumber: `811-${new Date().getFullYear()}-S${String(index + 1).padStart(2, "0")}`,
    } as Ticket
  })
}
