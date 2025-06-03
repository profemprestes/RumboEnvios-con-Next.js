"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "./use-auth"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"] & {
  empresas?: Empresa
}
type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  repartidores?: Repartidor
}

export function useRepartos() {
  const [repartos, setRepartos] = useState<Reparto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { repartidor } = useAuth()
  const supabase = createClient()

  const fetchRepartos = async () => {
    setLoading(true)
    setError(null)

    try {
      if (repartidor) {
        const { data, error } = await supabase
          .from("repartos")
          .select(`
            *,
            repartidores (
              id,
              nombre,
              apellido,
              empresas (
                id,
                nombre,
                direccion
              )
            )
          `)
          .eq("repartidor_id", repartidor.id)
          .order("fecha", { ascending: false })

        if (error) {
          setError(error)
        } else {
          setRepartos(data as Reparto[])
        }
      }
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateRepartoEstado = async (id: string, estado: Database["public"]["Enums"]["estado_reparto"]) => {
    try {
      const { error } = await supabase.from("repartos").update({ estado }).eq("id", id)

      if (error) throw error

      setRepartos((prev) => prev.map((reparto) => (reparto.id === id ? { ...reparto, estado } : reparto)))

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      }
    }
  }

  useEffect(() => {
    fetchRepartos()
  }, [repartidor])

  return {
    repartos,
    loading,
    error,
    updateRepartoEstado,
    fetchRepartos,
  }
}
