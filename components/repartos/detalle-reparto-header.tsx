"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Truck, Building, Play, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"] & {
  empresas?: Empresa
}
type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  repartidores?: Repartidor
}

interface DetalleRepartoHeaderProps {
  reparto: Reparto
  onUpdateEstado: (id: string, estado: Database["public"]["Enums"]["estado_reparto"]) => Promise<any>
}

const estadoColors = {
  pendiente: "bg-gray-100 text-gray-800",
  en_progreso: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
}

const estadoLabels = {
  pendiente: "Pendiente",
  en_progreso: "En Progreso",
  completado: "Completado",
  cancelado: "Cancelado",
}

export function DetalleRepartoHeader({ reparto, onUpdateEstado }: DetalleRepartoHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/repartos">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl">Detalle del Reparto</CardTitle>
              <p className="text-gray-600">#{reparto.id.slice(0, 8)}</p>
            </div>
          </div>
          <Badge className={estadoColors[reparto.estado]} variant="outline">
            {estadoLabels[reparto.estado]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información de fecha */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Fecha del Reparto</p>
              <p className="text-sm text-gray-600">
                {format(new Date(reparto.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
          </div>

          {/* Información del repartidor */}
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Repartidor</p>
              <p className="text-sm text-gray-600">
                {reparto.repartidores?.nombre} {reparto.repartidores?.apellido}
              </p>
              {reparto.repartidores?.vehiculo && (
                <p className="text-xs text-gray-500">{reparto.repartidores.vehiculo}</p>
              )}
            </div>
          </div>

          {/* Información de la empresa */}
          {reparto.repartidores?.empresas && (
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Empresa</p>
                <p className="text-sm text-gray-600">{reparto.repartidores.empresas.nombre}</p>
                {reparto.repartidores.empresas.direccion && (
                  <p className="text-xs text-gray-500">{reparto.repartidores.empresas.direccion}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notas del reparto */}
        {reparto.notas && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">Notas del Reparto</p>
            <p className="text-sm text-gray-600 italic">"{reparto.notas}"</p>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-6 flex space-x-3">
          {reparto.estado === "pendiente" && (
            <Button
              onClick={() => onUpdateEstado(reparto.id, "en_progreso")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Reparto
            </Button>
          )}

          {reparto.estado === "en_progreso" && (
            <Button
              onClick={() => onUpdateEstado(reparto.id, "completado")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completar Reparto
            </Button>
          )}

          {reparto.estado === "completado" && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              Reparto Completado
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
