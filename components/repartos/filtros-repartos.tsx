"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FiltrosRepartosProps {
  filtroEstado: string
  setFiltroEstado: (estado: string) => void
  busqueda: string
  setBusqueda: (busqueda: string) => void
}

export function FiltrosRepartos({ filtroEstado, setFiltroEstado, busqueda, setBusqueda }: FiltrosRepartosProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por ID o empresa..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filtroEstado} onValueChange={setFiltroEstado}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="planificado">Planificado</SelectItem>
          <SelectItem value="en_progreso">En Progreso</SelectItem>
          <SelectItem value="completado">Completado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
