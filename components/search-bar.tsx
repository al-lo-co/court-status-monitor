"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBarProps {
  searchTerm: string
  searchType: string
  onSearchTermChange: (term: string) => void
  onSearchTypeChange: (type: string) => void
}

export function SearchBar({ searchTerm, searchType, onSearchTermChange, onSearchTypeChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Select value={searchType} onValueChange={onSearchTypeChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Tipo de búsqueda" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="description">Buscar por descripción</SelectItem>
          <SelectItem value="expedient">Buscar por expediente</SelectItem>
        </SelectContent>
      </Select>

      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchType === "expedient" ? "Buscar por expediente..." : "Buscar por descripción..."}
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
    </div>
  )
}

