import type { CourtStatus } from "@/types/court-types"
import { subBusinessDays } from "date-fns"

// This function would be replaced with actual API calls to scrape the court websites
export async function fetchCourtStatuses(days = 3): Promise<CourtStatus[]> {
  // In a real implementation, this would make HTTP requests to the court websites
  // and parse the different formats (images, PDFs, text) using appropriate libraries

  // For demonstration purposes, we're returning mock data
  const today = new Date()
  const statuses: CourtStatus[] = []

  // Generate mock data for each court
  for (let courtId = 1; courtId <= 8; courtId++) {
    // Generate 3-7 random statuses per court
    const statusCount = Math.floor(Math.random() * 5) + 3

    for (let i = 0; i < statusCount; i++) {
      // Randomly assign a date within the last 'days' business days
      const daysAgo = Math.floor(Math.random() * days) + 1
      const statusDate = subBusinessDays(today, daysAgo)

      statuses.push({
        id: `${courtId}-${i}`,
        courtId: courtId,
        caseNumber: `${Math.floor(Math.random() * 1000) + 2000}-${Math.floor(Math.random() * 10000)}`,
        date: statusDate.toISOString(),
        caseType: getRandomCaseType(),
        statusType: getRandomStatusType(),
        description: getRandomDescription(),
        sourceFormat: getRandomSourceFormat(),
        sourceUrl: `https://example.com/court${courtId}/status/${i}`,
      })
    }
  }

  // Sort by date (newest first)
  return statuses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Helper functions to generate random data
function getRandomCaseType(): string {
  const types = [
    "Proceso Ejecutivo",
    "Proceso Verbal",
    "Proceso Monitorio",
    "Proceso Declarativo",
    "Proceso de Sucesión",
    "Proceso de Insolvencia",
    "Acción de Tutela",
  ]
  return types[Math.floor(Math.random() * types.length)]
}

function getRandomStatusType(): string {
  const types = ["Auto", "Sentencia", "Notificación", "Audiencia", "Traslado", "Requerimiento", "Admisión"]
  return types[Math.floor(Math.random() * types.length)]
}

function getRandomDescription(): string {
  const descriptions = [
    "Se admite demanda y se ordena notificar a la parte demandada.",
    "Se fija fecha para audiencia inicial el día 15 de mayo de 2025.",
    "Se requiere a la parte demandante para que aporte pruebas adicionales.",
    "Se decreta medida cautelar solicitada por la parte demandante.",
    "Se ordena el embargo y secuestro de bienes del demandado.",
    "Se declara la nulidad de lo actuado a partir del auto del 10 de febrero.",
    "Se concede recurso de apelación en efecto suspensivo.",
    "Se ordena vincular a tercero con interés en el proceso.",
    "Se decreta la práctica de pruebas solicitadas por las partes.",
    "Se profiere sentencia favorable a las pretensiones de la demanda.",
  ]
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

function getRandomSourceFormat(): string {
  const formats = ["PDF", "Image", "Text"]
  return formats[Math.floor(Math.random() * formats.length)]
}

