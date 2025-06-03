"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]

export function useEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Usar el cliente singleton
  const supabase = createClient()

  const fetchEmpresas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("empresas").select("*").order("nombre", { ascending: true })

      if (error) throw error

      setEmpresas(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchEmpresas()
  }, [fetchEmpresas])

  return {
    empresas,
    loading,
    error,
    fetchEmpresas,
  }
}
