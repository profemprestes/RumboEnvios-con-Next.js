"use client"

import { useParams } from "next/navigation"
import { useRepartos } from "@/hooks/use-repartos"
import { useParadasReparto } from "@/hooks/use-paradas-reparto"
import { DetalleRepartoHeader } from "@/components/repartos/detalle-reparto-header"
import { InformacionReparto } from "@/components/repartos/informacion-reparto"
import { ListaParadas } from "@/components/paradas/lista-paradas"

export default function DetalleRepartoPage() {
  const params = useParams()
  const repartoId = Number.parseInt(params.id as string)

  const { repartos, loading: loadingRepartos, updateRepartoEstado } = useRepartos()
  const { paradas, loading: loadingParadas, updateEstadoParada, iniciarNavegacion } = useParadasReparto(repartoId)

  const reparto = repartos.find((r) => r.id === repartoId)

  if (loadingRepartos) {
    return (
      <div className="space-y-6 pt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!reparto) {
    return (
      <div className="pt-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Reparto no encontrado</h1>
        <p className="text-gray-600">El reparto solicitado no existe o no tienes permisos para verlo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-16">
      <DetalleRepartoHeader reparto={reparto} onUpdateEstado={updateRepartoEstado} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <InformacionReparto reparto={reparto} />
        </div>
        <div className="lg:col-span-2">
          <ListaParadas
            paradas={paradas}
            loading={loadingParadas}
            onUpdateEstado={updateEstadoParada}
            onIniciarNavegacion={iniciarNavegacion}
          />
        </div>
      </div>
    </div>
  )
}
