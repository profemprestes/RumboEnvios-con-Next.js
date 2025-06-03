"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Building, User, FileText } from "lucide-react"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"]

interface ConfiguracionRepartoLoteProps {
  empresas: Empresa[]
  repartidores: Repartidor[]
  loadingEmpresas: boolean
  loadingRepartidores: boolean
  empresaSeleccionada: string
  setEmpresaSeleccionada: (id: string) => void
  repartidorSeleccionado: string
  setRepartidorSeleccionado: (id: string) => void
  fechaReparto: string
  setFechaReparto: (fecha: string) => void
  notas: string
  setNotas: (notas: string) => void
}

export function ConfiguracionRepartoLote({
  empresas,
  repartidores,
  loadingEmpresas,
  loadingRepartidores,
  empresaSeleccionada,
  setEmpresaSeleccionada,
  repartidorSeleccionado,
  setRepartidorSeleccionado,
  fechaReparto,
  setFechaReparto,
  notas,
  setNotas,
}: ConfiguracionRepartoLoteProps) {
  const hoy = new Date().toISOString().split("T")[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Configuración del Reparto por Lote</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Empresa */}
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa de Origen *</Label>
            <Select value={empresaSeleccionada} onValueChange={setEmpresaSeleccionada} disabled={loadingEmpresas}>
              <SelectTrigger>
                <SelectValue placeholder={loadingEmpresas ? "Cargando empresas..." : "Selecciona una empresa"} />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repartidor */}
          <div className="space-y-2">
            <Label htmlFor="repartidor">Repartidor Asignado *</Label>
            <Select
              value={repartidorSeleccionado}
              onValueChange={setRepartidorSeleccionado}
              disabled={loadingRepartidores}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loadingRepartidores ? "Cargando repartidores..." : "Selecciona un repartidor"}
                />
              </SelectTrigger>
              <SelectContent>
                {repartidores.map((repartidor) => (
                  <SelectItem key={repartidor.id} value={repartidor.id}>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>
                        {repartidor.nombre} {repartidor.apellido}
                      </span>
                      {repartidor.vehiculo && <span className="text-xs text-gray-500">({repartidor.vehiculo})</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha" className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Fecha del Reparto *</span>
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
            <span>Notas del Reparto (Opcional)</span>
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
