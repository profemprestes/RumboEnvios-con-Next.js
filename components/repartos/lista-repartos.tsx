"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building, MapPin, Package, Play, CheckCircle } from "lucide-react"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

interface ListaRepartosProps {
  repartos: Reparto[]
  loading: boolean
  onUpdateEstado: (id: number, estado: "planificado" | "en_progreso" | "completado" | "cancelado") => Promise<any>
}

const estadoColors = {
  planificado: "bg-gray-100 text-gray-800",
  en_progreso: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
}

const estadoLabels = {
  planificado: "Planificado",
  en_progreso: "En Progreso",
  completado: "Completado",
  cancelado: "Cancelado",
}

export function ListaRepartos({ repartos, loading, onUpdateEstado }: ListaRepartosProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (repartos.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay repartos</h3>
          <p className="text-gray-500 mb-4">No se encontraron repartos con los filtros aplicados</p>
          <Link href="/repartos/nuevo">
            <Button>Generar Nuevo Reparto</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {repartos.map((reparto) => (
        <Card key={reparto.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <Badge className={estadoColors[reparto.estado]}>{estadoLabels[reparto.estado]}</Badge>
                  <span className="text-sm font-medium text-gray-900">Reparto #{reparto.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reparto.fecha_reparto).toLocaleDateString()}</span>
                  </div>
                  {reparto.empresas && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{reparto.empresas.nombre}</span>
                    </div>
                  )}
                </div>

                {reparto.notas && <p className="text-sm text-gray-500 mt-2 italic">"{reparto.notas}"</p>}
              </div>

              <div className="flex items-center space-x-2">
                {reparto.estado === "planificado" && (
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
                <Link href={`/repartos/${reparto.id}`}>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    Ver Detalle
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
