"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter } from "lucide-react"

interface FiltrosMapaRutasProps {
  filtroFecha: string
  setFiltroFecha: (fecha: string) => void
  filtroEstado: string
  setFiltroEstado: (estado: string) => void
  totalRepartos: number
}

export function FiltrosMapaRutas({
  filtroFecha,
  setFiltroFecha,
  filtroEstado,
  setFiltroEstado,
  totalRepartos,
}: FiltrosMapaRutasProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="fecha" className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Fecha</span>
            </Label>
            <Input id="fecha" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          </div>

          <div className="flex-1 space-y-2">
            <Label className="flex items-center space-x-1">
              <Filter className="h-4 w-4" />
              <span>Estado</span>
            </Label>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
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

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {totalRepartos} reparto{totalRepartos !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
