"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type ParadaReparto = Database["public"]["Tables"]["paradas_reparto"]["Row"] & {
  envios?: Database["public"]["Tables"]["envios"]["Row"]
}

export function useParadasReparto(repartoId: number) {
  const [paradas, setParadas] = useState<ParadaReparto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchParadas = async () => {
    if (!repartoId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("paradas_reparto")
        .select(`
        *,
        envios (
          id,
          direccion_origen,
          direccion_destino,
          latitud_destino,
          longitud_destino,
          valor_declarado,
          peso,
          numero_seguimiento
        )
      `)
        .eq("reparto_id", repartoId)
        .order("orden", { ascending: true })

      if (error) throw error

      setParadas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const updateEstadoParada = async (
    paradaId: string,
    nuevoEstado: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido",
  ) => {
    try {
      const updateData: any = {
        estado: nuevoEstado,
        updated_at: new Date().toISOString(),
      }

      if (nuevoEstado === "en_progreso") {
        updateData.hora_llegada = new Date().toISOString()
      }

      if (nuevoEstado === "completado") {
        updateData.completada = true
        updateData.hora_salida = new Date().toISOString()
      }

      const { error } = await supabase.from("paradas_reparto").update(updateData).eq("id", paradaId)

      if (error) throw error

      setParadas((prev) =>
        prev.map((parada) =>
          parada.id === paradaId
            ? {
                ...parada,
                estado: nuevoEstado,
                hora_llegada: updateData.hora_llegada || parada.hora_llegada,
                hora_salida: updateData.hora_salida || parada.hora_salida,
                completada: updateData.completada || parada.completada,
              }
            : parada,
        ),
      )

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  const iniciarNavegacion = (parada: ParadaReparto) => {
    if (parada.envios?.latitud_destino && parada.envios?.longitud_destino) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${parada.envios.latitud_destino},${parada.envios.longitud_destino}`
      window.open(url, "_blank")
    }
  }

  useEffect(() => {
    fetchParadas()
  }, [repartoId])

  return {
    paradas,
    loading,
    error,
    fetchParadas,
    updateEstadoParada,
    iniciarNavegacion,
  }
}
