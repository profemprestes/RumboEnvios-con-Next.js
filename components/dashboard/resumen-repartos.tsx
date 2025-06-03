import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Building, Package } from "lucide-react"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

interface ResumenRepartosProps {
  repartos: Reparto[]
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

export function ResumenRepartos({ repartos }: ResumenRepartosProps) {
  const repartosRecientes = repartos
    .sort((a, b) => new Date(b.fecha_reparto).getTime() - new Date(a.fecha_reparto).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Repartos Recientes</CardTitle>
        <Link href="/repartos">
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {repartosRecientes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tienes repartos asignados</p>
            <Link href="/repartos/nuevo">
              <Button className="mt-4">Generar Primer Reparto</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {repartosRecientes.map((reparto) => (
              <div
                key={reparto.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={estadoColors[reparto.estado]}>{estadoLabels[reparto.estado]}</Badge>
                    <span className="text-sm text-gray-500">#{reparto.id}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reparto.fecha_reparto).toLocaleDateString()}</span>
                    </div>
                    {reparto.empresas && (
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{reparto.empresas.nombre}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link href={`/repartos/${reparto.id}`}>
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
