"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmpresas } from "@/hooks/use-empresas"
import { useRepartidores } from "@/hooks/use-repartidores"
import { useClientes } from "@/hooks/use-clientes"
import { useGenerarRepartosLote } from "@/hooks/use-generar-repartos-lote"
import { ConfiguracionRepartoLote } from "@/components/generar-repartos-lote/configuracion-reparto-lote"
import { SeleccionClientesLote } from "@/components/generar-repartos-lote/seleccion-clientes-lote"
import { BotonGeneracionLote } from "@/components/generar-repartos-lote/boton-generacion-lote"
import { ResumenGeneracion } from "@/components/generar-repartos-lote/resumen-generacion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GenerarRepartoLotePage() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>("")
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState<string>("")
  const [fechaReparto, setFechaReparto] = useState("")
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([])
  const [notas, setNotas] = useState("")

  const { empresas, loading: loadingEmpresas } = useEmpresas()
  const { repartidores, loading: loadingRepartidores } = useRepartidores()
  const { clientes, loading: loadingClientes } = useClientes()
  const { generarRepartoLote, loading: generando, error } = useGenerarRepartosLote()
  const router = useRouter()

  const clientesFiltrados = empresaSeleccionada
    ? clientes.filter((cliente) => cliente.empresa_id === empresaSeleccionada)
    : []

  const handleGenerarReparto = async () => {
    if (!empresaSeleccionada || !repartidorSeleccionado || !fechaReparto || clientesSeleccionados.length === 0) {
      return
    }

    const resultado = await generarRepartoLote({
      empresaId: empresaSeleccionada,
      repartidorId: repartidorSeleccionado,
      fechaReparto,
      clientesSeleccionados,
      notas: notas || undefined,
    })

    if (resultado.success) {
      router.push(`/repartos/${resultado.reparto?.id}`)
    }
  }

  const puedeGenerar = empresaSeleccionada && repartidorSeleccionado && fechaReparto && clientesSeleccionados.length > 0

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center space-x-4">
        <Link href="/repartos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generador de Repartos por Lote</h1>
          <p className="text-gray-600">Crea repartos masivos seleccionando empresa, repartidor y clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración */}
        <div className="lg:col-span-2 space-y-6">
          <ConfiguracionRepartoLote
            empresas={empresas}
            repartidores={repartidores}
            loadingEmpresas={loadingEmpresas}
            loadingRepartidores={loadingRepartidores}
            empresaSeleccionada={empresaSeleccionada}
            setEmpresaSeleccionada={setEmpresaSeleccionada}
            repartidorSeleccionado={repartidorSeleccionado}
            setRepartidorSeleccionado={setRepartidorSeleccionado}
            fechaReparto={fechaReparto}
            setFechaReparto={setFechaReparto}
            notas={notas}
            setNotas={setNotas}
          />

          <SeleccionClientesLote
            clientes={clientesFiltrados}
            loadingClientes={loadingClientes}
            clientesSeleccionados={clientesSeleccionados}
            setClientesSeleccionados={setClientesSeleccionados}
            empresaSeleccionada={empresaSeleccionada}
          />
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <ResumenGeneracion
            empresaSeleccionada={empresaSeleccionada}
            repartidorSeleccionado={repartidorSeleccionado}
            fechaReparto={fechaReparto}
            clientesSeleccionados={clientesSeleccionados}
            empresas={empresas}
            repartidores={repartidores}
          />

          <BotonGeneracionLote
            puedeGenerar={puedeGenerar}
            generando={generando}
            onGenerar={handleGenerarReparto}
            clientesSeleccionados={clientesSeleccionados.length}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
