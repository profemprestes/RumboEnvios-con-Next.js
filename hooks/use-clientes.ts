"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Cliente = Database["public"]["Tables"]["clientes"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchClientes = async () => {
    try {
      setLoading(true)
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
        .eq("estado", "activo")
        .order("nombre", { ascending: true })

      if (error) throw error

      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const getClientesPorEmpresa = (empresaId: number) => {
    return clientes.filter((cliente) => cliente.empresa_id === empresaId)
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    getClientesPorEmpresa,
  }
}
