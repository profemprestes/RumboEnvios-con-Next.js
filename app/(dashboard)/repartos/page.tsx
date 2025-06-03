"use client"

import { useState } from "react"
import { useRepartos } from "@/hooks/use-repartos"
import { ListaRepartos } from "@/components/repartos/lista-repartos"
import { FiltrosRepartos } from "@/components/repartos/filtros-repartos"

export default function RepartosPage() {
  const { repartos, loading, updateRepartoEstado } = useRepartos()
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")

  const repartosFiltrados = repartos.filter((reparto) => {
    const cumpleFiltroEstado = filtroEstado === "todos" || reparto.estado === filtroEstado
    const cumpleBusqueda =
      busqueda === "" ||
      reparto.id.toString().includes(busqueda) ||
      reparto.empresas?.nombre.toLowerCase().includes(busqueda.toLowerCase())

    return cumpleFiltroEstado && cumpleBusqueda
  })

  return (
    <div className="space-y-6 pt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Repartos</h1>
        <p className="text-gray-600">Gestiona todos tus repartos asignados</p>
      </div>

      <FiltrosRepartos
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      <ListaRepartos repartos={repartosFiltrados} loading={loading} onUpdateEstado={updateRepartoEstado} />
    </div>
  )
}
