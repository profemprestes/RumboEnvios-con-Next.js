"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Building, FileText } from "lucide-react"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]

interface ConfiguracionRepartoProps {
  empresas: Empresa[]
  loadingEmpresas: boolean
  empresaSeleccionada: number | null
  setEmpresaSeleccionada: (id: number | null) => void
  fechaReparto: string
  setFechaReparto: (fecha: string) => void
  notas: string
  setNotas: (notas: string) => void
}

export function ConfiguracionReparto({
  empresas,
  loadingEmpresas,
  empresaSeleccionada,
  setEmpresaSeleccionada,
  fechaReparto,
  setFechaReparto,
  notas,
  setNotas,
}: ConfiguracionRepartoProps) {
  const hoy = new Date().toISOString().split("T")[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Configuración del Reparto</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Select
            value={empresaSeleccionada?.toString() || ""}
            onValueChange={(value) => setEmpresaSeleccionada(value ? Number.parseInt(value) : null)}
            disabled={loadingEmpresas}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id.toString()}>
                  {empresa.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha" className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Fecha del Reparto</span>
          </Label>
          <Input
            id="fecha"
            type="date"
            value={fechaReparto}
            onChange={(e) => setFechaReparto(e.target.value)}
            min={hoy}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notas" className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>Notas (Opcional)</span>
          </Label>
          <Textarea
            id="notas"
            placeholder="Agrega notas o instrucciones especiales para este reparto..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
