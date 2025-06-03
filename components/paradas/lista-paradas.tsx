"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Play, CheckCircle, Clock, Package } from "lucide-react"
import type { Database } from "@/types/database"

type ParadaReparto = Database["public"]["Tables"]["paradas_reparto"]["Row"] & {
  envios?: Database["public"]["Tables"]["envios"]["Row"]
}

interface ListaParadasProps {
  paradas: ParadaReparto[]
  loading: boolean
  onUpdateEstado: (
    id: number,
    estado: "pendiente_asignacion" | "asignado" | "en_progreso" | "completado" | "fallido" | "cancelado",
  ) => Promise<any>
  onIniciarNavegacion: (parada: ParadaReparto) => void
}

const estadoColors = {
  pendiente_asignacion: "bg-gray-100 text-gray-800",
  asignado: "bg-blue-100 text-blue-800",
  en_progreso: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  fallido: "bg-red-100 text-red-800",
  cancelado: "bg-red-100 text-red-800",
}

const estadoLabels = {
  pendiente_asignacion: "Pendiente",
  asignado: "Asignado",
  en_progreso: "En Progreso",
  completado: "Completado",
  fallido: "Fallido",
  cancelado: "Cancelado",
}

export function ListaParadas({ paradas, loading, onUpdateEstado, onIniciarNavegacion }: ListaParadasProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paradas del Reparto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paradas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paradas del Reparto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No hay paradas asignadas a este reparto</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paradas del Reparto ({paradas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paradas.map((parada) => (
            <div key={parada.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      #{parada.orden_visita}
                    </span>
                    <Badge className={estadoColors[parada.estado_parada]}>{estadoLabels[parada.estado_parada]}</Badge>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-1">{parada.descripcion_parada}</h4>

                  {parada.envios && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{parada.envios.direccion_destino}</span>
                      </div>
                      {parada.envios.precio && <p>Precio: ${parada.envios.precio}</p>}
                      {parada.envios.peso_kg && <p>Peso: {parada.envios.peso_kg} kg</p>}
                    </div>
                  )}

                  {parada.hora_estimada_llegada && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                      <Clock className="h-4 w-4" />
                      <span>Estimada: {parada.hora_estimada_llegada}</span>
                    </div>
                  )}

                  {parada.hora_real_llegada && (
                    <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>Llegada real: {parada.hora_real_llegada}</span>
                    </div>
                  )}

                  {parada.notas_parada && <p className="text-sm text-gray-500 mt-2 italic">"{parada.notas_parada}"</p>}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {parada.estado_parada === "asignado" && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateEstado(parada.id, "en_progreso")}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Iniciar
                    </Button>
                  )}

                  {parada.estado_parada === "en_progreso" && (
                    <Button
                      size="sm"
                      onClick={() => onUpdateEstado(parada.id, "completado")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completar
                    </Button>
                  )}

                  {parada.envios?.latitud_destino && parada.envios?.longitud_destino && (
                    <Button variant="outline" size="sm" onClick={() => onIniciarNavegacion(parada)}>
                      <Navigation className="h-4 w-4 mr-1" />
                      Navegar
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
