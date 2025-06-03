"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Truck, Calendar, MapPin, Play, CheckCircle } from "lucide-react"
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

interface ListaRepartosProps {
  repartos: Reparto[]
  loading: boolean
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

export function ListaRepartos({ repartos, loading, onUpdateEstado }: ListaRepartosProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Repartos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (repartos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mis Repartos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No tienes repartos asignados</p>
            <Link href="/repartos/nuevo">
              <Button className="mt-4">
                <Play className="h-4 w-4 mr-2" />
                Crear Nuevo Reparto
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Repartos ({repartos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repartos.map((reparto) => (
            <div key={reparto.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      #{reparto.id.slice(0, 8)}
                    </span>
                    <Badge className={estadoColors[reparto.estado]}>{estadoLabels[reparto.estado]}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {format(new Date(reparto.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {reparto.repartidores?.nombre} {reparto.repartidores?.apellido}
                      </span>
                    </div>

                    {reparto.repartidores?.empresas && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{reparto.repartidores.empresas.nombre}</span>
                      </div>
                    )}

                    {reparto.notas && <p className="text-sm text-gray-500 italic">"{reparto.notas}"</p>}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Link href={`/repartos/${reparto.id}`}>
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      Ver Detalle
                    </Button>
                  </Link>

                  {reparto.estado === "pendiente" && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateEstado(reparto.id, "en_progreso")}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                  )}

                  {reparto.estado === "en_progreso" && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateEstado(reparto.id, "completado")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
