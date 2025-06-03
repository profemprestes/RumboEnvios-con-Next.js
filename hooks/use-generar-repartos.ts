"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "./use-auth"

interface ConfiguracionReparto {
  empresaId: number
  fechaReparto: string
  clientesSeleccionados: number[]
  notas?: string
}

export function useGenerarRepartos() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { repartidor } = useAuth()
  const supabase = createClient()

  const generarReparto = async (configuracion: ConfiguracionReparto) => {
    if (!repartidor) {
      return { success: false, error: "No hay repartidor autenticado" }
    }

    try {
      setLoading(true)
      setError(null)

      // Crear el reparto
      const { data: reparto, error: repartoError } = await supabase
        .from("repartos")
        .insert({
          fecha: configuracion.fechaReparto,
          repartidor_id: repartidor.id,
          estado: "pendiente",
          notas: configuracion.notas || null,
        })
        .select()
        .single()

      if (repartoError) throw repartoError

      // Crear envíos para cada cliente seleccionado
      const enviosPromises = configuracion.clientesSeleccionados.map(async (clienteId, index) => {
        // Obtener datos del cliente
        const { data: cliente, error: clienteError } = await supabase
          .from("clientes")
          .select("*, empresas(*)")
          .eq("id", clienteId)
          .single()

        if (clienteError) throw clienteError

        // Crear envío
        const { data: envio, error: envioError } = await supabase
          .from("envios")
          .insert({
            cliente_id: clienteId,
            direccion_origen: cliente.empresas?.direccion || "Origen no especificado",
            latitud_origen: cliente.empresas?.latitud_empresa || -34.6037,
            longitud_origen: cliente.empresas?.longitud_empresa || -58.3816,
            direccion_destino: cliente.direccion || "Destino no especificado",
            latitud_destino: cliente.latitud || -34.6037,
            longitud_destino: cliente.longitud || -58.3816,
            estado: "asignado",
            fecha_estimada: configuracion.fechaReparto,
            repartidor_id: repartidor.id,
            reparto_id: reparto.id,
            descripcion: `Entrega a ${cliente.nombre} ${cliente.apellido || ""}`,
            tipo_envio: "entrega",
            orden_parada: index + 1,
          })
          .select()
          .single()

        if (envioError) throw envioError

        // Crear parada de reparto
        const { error: paradaError } = await supabase.from("paradas_reparto").insert({
          reparto_id: reparto.id,
          envio_id: envio.id,
          orden: index + 1,
          estado: "asignado",
          notas: `Entrega a ${cliente.nombre} ${cliente.apellido || ""} - ${cliente.direccion}`,
        })

        if (paradaError) throw paradaError

        return envio
      })

      await Promise.all(enviosPromises)

      return { success: true, reparto }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    generarReparto,
    loading,
    error,
  }
}
