"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Cliente = Database["public"]["Tables"]["clientes"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Usar el cliente singleton
  const supabase = createClient()

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("clientes")
        .select(`
        *,
        empresas (
          id,
          nombre,
          direccion
        )
      `)
        .order("nombre", { ascending: true })

      if (error) throw error

      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const getClientesPorEmpresa = useCallback(
    (empresaId: string) => {
      return clientes.filter((cliente) => cliente.empresa_id === empresaId)
    },
    [clientes],
  )

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    getClientesPorEmpresa,
  }
}
