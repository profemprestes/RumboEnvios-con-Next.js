import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Calendar } from "lucide-react"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"]

interface EstadisticasCardsProps {
  repartos: Reparto[]
}

export function EstadisticasCards({ repartos }: EstadisticasCardsProps) {
  const hoy = new Date().toISOString().split("T")[0]
  const repartosHoy = repartos.filter((r) => r.fecha_reparto === hoy)

  const estadisticas = [
    {
      title: "Repartos Hoy",
      value: repartosHoy.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "En Progreso",
      value: repartos.filter((r) => r.estado === "en_progreso").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Completados",
      value: repartos.filter((r) => r.estado === "completado").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Planificados",
      value: repartos.filter((r) => r.estado === "planificado").length,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {estadisticas.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
