"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmpresas } from "@/hooks/use-empresas"
import { useClientes } from "@/hooks/use-clientes"
import { useGenerarRepartos } from "@/hooks/use-generar-repartos"
import { ConfiguracionReparto } from "@/components/generar-repartos/configuracion-reparto"
import { SeleccionClientes } from "@/components/generar-repartos/seleccion-clientes"
import { BotonGeneracion } from "@/components/generar-repartos/boton-generacion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NuevoRepartoPage() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(null)
  const [fechaReparto, setFechaReparto] = useState("")
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([])
  const [notas, setNotas] = useState("")

  const { empresas, loading: loadingEmpresas } = useEmpresas()
  const { clientes, loading: loadingClientes } = useClientes()
  const { generarReparto, loading: generando } = useGenerarRepartos()
  const router = useRouter()

  const clientesFiltrados = empresaSeleccionada
    ? clientes.filter((cliente) => cliente.empresa_id === empresaSeleccionada)
    : []

  const handleGenerarReparto = async () => {
    if (!empresaSeleccionada || !fechaReparto || clientesSeleccionados.length === 0) {
      return
    }

    const resultado = await generarReparto({
      empresaId: empresaSeleccionada,
      fechaReparto,
      clientesSeleccionados,
      notas: notas || undefined,
    })

    if (resultado.success) {
      router.push(`/repartos/${resultado.reparto?.id}`)
    }
  }

  const puedeGenerar = empresaSeleccionada && fechaReparto && clientesSeleccionados.length > 0

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
          <h1 className="text-3xl font-bold text-gray-900">Generar Nuevo Reparto</h1>
          <p className="text-gray-600">Configura y crea un nuevo reparto para tus entregas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ConfiguracionReparto
            empresas={empresas}
            loadingEmpresas={loadingEmpresas}
            empresaSeleccionada={empresaSeleccionada}
            setEmpresaSeleccionada={setEmpresaSeleccionada}
            fechaReparto={fechaReparto}
            setFechaReparto={setFechaReparto}
            notas={notas}
            setNotas={setNotas}
          />

          <BotonGeneracion
            puedeGenerar={puedeGenerar}
            generando={generando}
            onGenerar={handleGenerarReparto}
            clientesSeleccionados={clientesSeleccionados.length}
          />
        </div>

        <div>
          <SeleccionClientes
            clientes={clientesFiltrados}
            loadingClientes={loadingClientes}
            clientesSeleccionados={clientesSeleccionados}
            setClientesSeleccionados={setClientesSeleccionados}
            empresaSeleccionada={empresaSeleccionada}
          />
        </div>
      </div>
    </div>
  )
}
