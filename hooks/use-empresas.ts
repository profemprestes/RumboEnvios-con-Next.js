"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("empresas")
        .select("*")
        .eq("estado", "activo")
        .order("nombre", { ascending: true })

      if (error) throw error

      setEmpresas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmpresas()
  }, [])

  return {
    empresas,
    loading,
    error,
    fetchEmpresas,
  }
}
