import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Package, Layers } from "lucide-react"

export function AccesosRapidos() {
  const accesos = [
    {
      title: "Nuevo Reparto",
      description: "Generar un reparto individual",
      href: "/repartos/nuevo",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Reparto por Lote",
      description: "Generar repartos masivos",
      href: "/repartos/lote",
      icon: Layers,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Ver Mapa",
      description: "Visualizar rutas en mapa",
      href: "/mapa-rutas",
      icon: MapPin,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Mis Repartos",
      description: "Ver todos mis repartos",
      href: "/repartos",
      icon: Package,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accesos Rápidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {accesos.map((acceso) => (
          <Link key={acceso.title} href={acceso.href}>
            <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-50">
              <div className={`p-2 rounded-lg ${acceso.color} mr-3`}>
                <acceso.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium">{acceso.title}</div>
                <div className="text-sm text-gray-500">{acceso.description}</div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
