import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building, Navigation } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

interface MapaRutasInteractivoProps {
  repartos: Reparto[]
  loading: boolean
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

export function MapaRutasInteractivo({ repartos, loading }: MapaRutasInteractivoProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Rutas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-gray-500">Cargando mapa...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mapa placeholder - En una implementación real aquí iría Google Maps o Mapbox */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Mapa Interactivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mapa de Rutas</h3>
                <p className="text-gray-600 mb-4">Aquí se mostraría el mapa interactivo con las rutas y paradas</p>
                <p className="text-sm text-gray-500">Integración con Google Maps o Mapbox pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de repartos */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Repartos en Mapa</CardTitle>
          </CardHeader>
          <CardContent>
            {repartos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay repartos para mostrar</p>
                <p className="text-sm">Ajusta los filtros o crea un nuevo reparto</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {repartos.map((reparto) => (
                  <div key={reparto.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={estadoColors[reparto.estado]}>{estadoLabels[reparto.estado]}</Badge>
                      <span className="text-xs text-gray-500">#{reparto.id}</span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(reparto.fecha_reparto).toLocaleDateString()}</span>
                      </div>
                      {reparto.empresas && (
                        <div className="flex items-center space-x-1">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{reparto.empresas.nombre}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/repartos/${reparto.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
