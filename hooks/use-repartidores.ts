"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"]

export function useRepartidores() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchRepartidores = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("repartidores")
        .select("*")
        .eq("activo", true)
        .order("nombre", { ascending: true })

      if (error) throw error

      setRepartidores(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepartidores()
  }, [])

  return {
    repartidores,
    loading,
    error,
    fetchRepartidores,
  }
}
