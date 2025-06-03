"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

interface ConfiguracionRepartoLote {
  empresaId: string
  repartidorId: string
  fechaReparto: string
  clientesSeleccionados: string[]
  notas?: string
}

export function useGenerarRepartosLote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const generarRepartoLote = async (configuracion: ConfiguracionRepartoLote) => {
    try {
      setLoading(true)
      setError(null)

      // Validaciones
      if (!configuracion.empresaId || !configuracion.repartidorId || !configuracion.fechaReparto) {
        throw new Error("Faltan datos obligatorios: empresa, repartidor o fecha")
      }

      if (configuracion.clientesSeleccionados.length === 0) {
        throw new Error("Debe seleccionar al menos un cliente")
      }

      // Obtener datos de la empresa
      const { data: empresa, error: empresaError } = await supabase
        .from("empresas")
        .select("*")
        .eq("id", configuracion.empresaId)
        .single()

      if (empresaError) throw empresaError

      // 1. Crear el reparto
      const { data: reparto, error: repartoError } = await supabase
        .from("repartos")
        .insert({
          repartidor_id: configuracion.repartidorId,
          fecha: configuracion.fechaReparto,
          estado: "pendiente",
          notas: configuracion.notas || null,
        })
        .select()
        .single()

      if (repartoError) throw repartoError

      // 2. Crear parada 0 (empresa - punto de partida)
      const { data: envioOrigen, error: envioOrigenError } = await supabase
        .from("envios")
        .insert({
          cliente_id: configuracion.clientesSeleccionados[0], // Temporal, se actualizará
          direccion_origen: empresa.direccion || "Punto de partida",
          latitud_origen: empresa.latitud_empresa || -34.6037,
          longitud_origen: empresa.longitud_empresa || -58.3816,
          direccion_destino: empresa.direccion || "Punto de partida",
          latitud_destino: empresa.latitud_empresa || -34.6037,
          longitud_destino: empresa.longitud_empresa || -58.3816,
          estado: "asignado",
          descripcion: `Punto de partida - ${empresa.nombre}`,
          fecha_estimada: configuracion.fechaReparto,
          repartidor_id: configuracion.repartidorId,
          reparto_id: reparto.id,
          tipo_envio: "recogida",
          es_parada_origen: true,
          orden_parada: 0,
        })
        .select()
        .single()

      if (envioOrigenError) throw envioOrigenError

      // 3. Crear parada 0 en paradas_reparto
      const { error: paradaOrigenError } = await supabase.from("paradas_reparto").insert({
        reparto_id: reparto.id,
        envio_id: envioOrigen.id,
        orden: 0,
        estado: "asignado",
        notas: `Punto de partida - ${empresa.nombre}`,
        completada: false,
      })

      if (paradaOrigenError) throw paradaOrigenError

      // 4. Crear paradas para cada cliente (1 a N)
      const enviosPromises = configuracion.clientesSeleccionados.map(async (clienteId, index) => {
        // Obtener datos del cliente
        const { data: cliente, error: clienteError } = await supabase
          .from("clientes")
          .select("*")
          .eq("id", clienteId)
          .single()

        if (clienteError) throw clienteError

        // Determinar origen (empresa para primera parada, cliente anterior para las siguientes)
        let direccionOrigen = empresa.direccion || "Origen no especificado"
        let latitudOrigen = empresa.latitud_empresa || -34.6037
        let longitudOrigen = empresa.longitud_empresa || -58.3816

        if (index > 0) {
          // Para paradas posteriores a la primera, el origen es el cliente anterior
          const clienteAnteriorId = configuracion.clientesSeleccionados[index - 1]
          const { data: clienteAnterior } = await supabase
            .from("clientes")
            .select("*")
            .eq("id", clienteAnteriorId)
            .single()

          if (clienteAnterior) {
            direccionOrigen = clienteAnterior.direccion || "Origen no especificado"
            latitudOrigen = Number(clienteAnterior.latitud) || -34.6037
            longitudOrigen = Number(clienteAnterior.longitud) || -58.3816
          }
        }

        // Crear envío
        const { data: envio, error: envioError } = await supabase
          .from("envios")
          .insert({
            cliente_id: clienteId,
            direccion_origen: direccionOrigen,
            latitud_origen: latitudOrigen,
            longitud_origen: longitudOrigen,
            direccion_destino: cliente.direccion || "Destino no especificado",
            latitud_destino: Number(cliente.latitud) || -34.6037,
            longitud_destino: Number(cliente.longitud) || -58.3816,
            estado: "asignado",
            descripcion: `Entrega a ${cliente.nombre} ${cliente.apellido || ""}`,
            fecha_estimada: configuracion.fechaReparto,
            repartidor_id: configuracion.repartidorId,
            reparto_id: reparto.id,
            tipo_envio: "entrega",
            es_parada_origen: false,
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
          completada: false,
        })

        if (paradaError) throw paradaError

        return envio
      })

      await Promise.all(enviosPromises)

      return {
        success: true,
        reparto,
        totalParadas: configuracion.clientesSeleccionados.length + 1, // +1 por la parada de origen
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    generarRepartoLote,
    loading,
    error,
  }
}
