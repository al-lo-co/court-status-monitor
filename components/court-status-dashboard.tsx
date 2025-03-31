"use client"

import { useState, useEffect } from "react"
import { format, subBusinessDays } from "date-fns"
import { es } from "date-fns/locale"
import { Download, RefreshCw, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusTable } from "@/components/status-table"
import { fetchCourtStatuses } from "@/lib/court-api"
import { generatePDF, generateSingleCasePDF } from "@/lib/pdf-generator"
import type { CourtStatus } from "@/types/court-types"
import { SearchBar } from "@/components/search-bar"

export function CourtStatusDashboard() {
  const [statuses, setStatuses] = useState<CourtStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [daysFilter, setDaysFilter] = useState<string>("3")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchType, setSearchType] = useState<string>("description")

  const today = new Date()
  const dateRanges = {
    "1": format(subBusinessDays(today, 1), "yyyy-MM-dd"),
    "2": format(subBusinessDays(today, 2), "yyyy-MM-dd"),
    "3": format(subBusinessDays(today, 3), "yyyy-MM-dd"),
  }

  useEffect(() => {
    loadData()
  }, [daysFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchCourtStatuses(Number.parseInt(daysFilter))
      setStatuses(data)
    } catch (error) {
      console.error("Error fetching court statuses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    const filteredData =
      selectedCourt === "all"
        ? statuses
        : statuses.filter((status) => status.courtId === Number.parseInt(selectedCourt))

    await generatePDF(filteredData, Number.parseInt(daysFilter))
  }

  const filteredStatuses = statuses
    .filter((status) => selectedCourt === "all" || status.courtId === Number.parseInt(selectedCourt))
    .filter((status) => {
      if (!searchTerm) return true

      if (searchType === "expedient") {
        return status.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
      } else {
        return status.description.toLowerCase().includes(searchTerm.toLowerCase())
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar Juzgado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Juzgados</SelectItem>
              <SelectItem value="1">Juzgado 1° Civil Municipal</SelectItem>
              <SelectItem value="2">Juzgado 2° Civil Municipal</SelectItem>
              <SelectItem value="3">Juzgado 3° Civil Municipal</SelectItem>
              <SelectItem value="4">Juzgado 4° Civil Municipal</SelectItem>
              <SelectItem value="5">Juzgado 5° Civil Municipal</SelectItem>
              <SelectItem value="6">Juzgado 6° Civil Municipal</SelectItem>
              <SelectItem value="7">Juzgado 7° Civil Municipal</SelectItem>
              <SelectItem value="8">Juzgado 8° Civil Municipal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por días" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Último día hábil</SelectItem>
              <SelectItem value="2">Últimos 2 días hábiles</SelectItem>
              <SelectItem value="3">Últimos 3 días hábiles</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          searchType={searchType}
          onSearchTermChange={setSearchTerm}
          onSearchTypeChange={setSearchType}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={handleDownloadPDF} disabled={loading || filteredStatuses.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              Estados Pendientes
              {selectedCourt !== "all" && ` - Juzgado ${selectedCourt}° Civil Municipal`}
            </span>
            <div className="text-sm font-normal flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Desde: {format(new Date(dateRanges[daysFilter as keyof typeof dateRanges]), "PPP", { locale: es })}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Vista de Tabla</TabsTrigger>
                <TabsTrigger value="cards">Vista de Tarjetas</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <StatusTable statuses={filteredStatuses} />
              </TabsContent>

              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStatuses.length > 0 ? (
                    filteredStatuses.map((status) => (
                      <Card key={`${status.courtId}-${status.caseNumber}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Juzgado {status.courtId}° Civil Municipal</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Expediente:</span>
                              <span>{status.caseNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Fecha:</span>
                              <span>{format(new Date(status.date), "PPP", { locale: es })}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Tipo:</span>
                              <span>{status.caseType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Estado:</span>
                              <span className="font-semibold text-primary">{status.statusType}</span>
                            </div>
                            <div className="pt-2">
                              <span className="font-medium">Descripción:</span>
                              <p className="mt-1 text-muted-foreground">{status.description}</p>
                            </div>
                            <div className="pt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateSingleCasePDF(status)}
                                title="Descargar PDF de este expediente"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No se encontraron estados pendientes con los filtros seleccionados.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

