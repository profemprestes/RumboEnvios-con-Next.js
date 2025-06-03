"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "./use-auth"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

export function useRepartos() {
  const [repartos, setRepartos] = useState<Reparto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { repartidor } = useAuth()
  const supabase = createClient()

  const fetchRepartos = useCallback(async () => {
    if (!repartidor) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("repartos")
        .select(`
          *,
          empresas (
            id,
            nombre,
            direccion
          )
        `)
        .eq("repartidor_id", repartidor.id)
        .order("fecha", { ascending: false })

      if (error) throw error

      setRepartos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [repartidor, supabase])

  const updateRepartoEstado = async (
    repartoId: string,
    nuevoEstado: "pendiente" | "en_progreso" | "completado" | "cancelado",
  ) => {
    try {
      const { error } = await supabase
        .from("repartos")
        .update({
          estado: nuevoEstado,
          updated_at: new Date().toISOString(),
        })
        .eq("id", repartoId)

      if (error) throw error

      setRepartos((prev) =>
        prev.map((reparto) => (reparto.id === repartoId ? { ...reparto, estado: nuevoEstado } : reparto)),
      )

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  const getRepartosPorEstado = useCallback(
    (estado: string) => {
      return repartos.filter((reparto) => reparto.estado === estado)
    },
    [repartos],
  )

  const getRepartosHoy = useCallback(() => {
    const hoy = new Date().toISOString().split("T")[0]
    return repartos.filter((reparto) => reparto.fecha === hoy)
  }, [repartos])

  useEffect(() => {
    fetchRepartos()
  }, [fetchRepartos])

  return {
    repartos,
    loading,
    error,
    fetchRepartos,
    updateRepartoEstado,
    getRepartosPorEstado,
    getRepartosHoy,
  }
}
