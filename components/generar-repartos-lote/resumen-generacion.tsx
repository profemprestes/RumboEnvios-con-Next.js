"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building, User, Calendar, MapPin, Route } from "lucide-react"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"]

interface ResumenGeneracionProps {
  empresaSeleccionada: string
  repartidorSeleccionado: string
  fechaReparto: string
  clientesSeleccionados: string[]
  empresas: Empresa[]
  repartidores: Repartidor[]
}

export function ResumenGeneracion({
  empresaSeleccionada,
  repartidorSeleccionado,
  fechaReparto,
  clientesSeleccionados,
  empresas,
  repartidores,
}: ResumenGeneracionProps) {
  const empresa = empresas.find((e) => e.id === empresaSeleccionada)
  const repartidor = repartidores.find((r) => r.id === repartidorSeleccionado)

  const totalParadas = clientesSeleccionados.length > 0 ? clientesSeleccionados.length + 1 : 0 // +1 por la empresa

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Route className="h-5 w-5" />
          <span>Resumen del Reparto</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Empresa */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Building className="h-4 w-4" />
            <span>Empresa de Origen</span>
          </div>
          {empresa ? (
            <div className="pl-6">
              <p className="font-medium">{empresa.nombre}</p>
              <p className="text-sm text-gray-600">{empresa.direccion}</p>
            </div>
          ) : (
            <p className="pl-6 text-sm text-gray-500">No seleccionada</p>
          )}
        </div>

        <Separator />

        {/* Repartidor */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="h-4 w-4" />
            <span>Repartidor Asignado</span>
          </div>
          {repartidor ? (
            <div className="pl-6">
              <p className="font-medium">
                {repartidor.nombre} {repartidor.apellido}
              </p>
              {repartidor.vehiculo && <p className="text-sm text-gray-600">Vehículo: {repartidor.vehiculo}</p>}
              {repartidor.telefono && <p className="text-sm text-gray-600">Tel: {repartidor.telefono}</p>}
            </div>
          ) : (
            <p className="pl-6 text-sm text-gray-500">No seleccionado</p>
          )}
        </div>

        <Separator />

        {/* Fecha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>Fecha del Reparto</span>
          </div>
          {fechaReparto ? (
            <p className="pl-6 font-medium">{new Date(fechaReparto).toLocaleDateString()}</p>
          ) : (
            <p className="pl-6 text-sm text-gray-500">No seleccionada</p>
          )}
        </div>

        <Separator />

        {/* Paradas */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>Paradas del Reparto</span>
          </div>
          <div className="pl-6 space-y-2">
            {totalParadas > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total de paradas:</span>
                  <Badge variant="outline">{totalParadas}</Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Parada 0: {empresa?.nombre || "Empresa"} (Punto de partida)</p>
                  <p>• Paradas 1-{clientesSeleccionados.length}: Clientes seleccionados</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">No hay clientes seleccionados</p>
            )}
          </div>
        </div>

        {clientesSeleccionados.length > 0 && (
          <>
            <Separator />
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">✓ Se generarán {totalParadas} paradas en total</p>
              <p className="text-xs text-blue-600 mt-1">
                Incluye punto de partida + {clientesSeleccionados.length} entregas
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
