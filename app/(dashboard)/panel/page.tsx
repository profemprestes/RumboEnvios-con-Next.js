"use client"

import { useRepartos } from "@/hooks/use-repartos"
import { EstadisticasCards } from "@/components/dashboard/estadisticas-cards"
import { AccesosRapidos } from "@/components/dashboard/accesos-rapidos"
import { ResumenRepartos } from "@/components/dashboard/resumen-repartos"

export default function PanelPage() {
  const { repartos, loading } = useRepartos()

  if (loading) {
    return (
      <div className="space-y-6 pt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
        <p className="text-gray-600">Resumen de tus repartos y actividades</p>
      </div>

      <EstadisticasCards repartos={repartos} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResumenRepartos repartos={repartos} />
        </div>
        <div>
          <AccesosRapidos />
        </div>
      </div>
    </div>
  )
}
