"use client"

import { useState } from "react"
import { useRepartos } from "@/hooks/use-repartos"
import { MapaRutasInteractivo } from "@/components/mapas/mapa-rutas-interactivo"
import { FiltrosMapaRutas } from "@/components/mapas/filtros-mapa-rutas"

export default function MapaRutasPage() {
  const { repartos, loading } = useRepartos()
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  const repartosFiltrados = repartos.filter((reparto) => {
    const cumpleFiltroFecha = !filtroFecha || reparto.fecha_reparto === filtroFecha
    const cumpleFiltroEstado = filtroEstado === "todos" || reparto.estado === filtroEstado
    return cumpleFiltroFecha && cumpleFiltroEstado
  })

  return (
    <div className="space-y-6 pt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mapa de Rutas</h1>
        <p className="text-gray-600">Visualiza tus repartos y rutas en el mapa</p>
      </div>

      <FiltrosMapaRutas
        filtroFecha={filtroFecha}
        setFiltroFecha={setFiltroFecha}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        totalRepartos={repartosFiltrados.length}
      />

      <MapaRutasInteractivo repartos={repartosFiltrados} loading={loading} />
    </div>
  )
}
