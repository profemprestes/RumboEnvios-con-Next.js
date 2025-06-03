"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export function useDebugData() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchDebugData = async () => {
    try {
      setLoading(true)

      // Verificar conexión básica
      const { data: empresasData, error: empresasError } = await supabase.from("empresas").select("*").limit(5)

      const { data: clientesData, error: clientesError } = await supabase.from("clientes").select("*").limit(5)

      const { data: repartidoresData, error: repartidoresError } = await supabase
        .from("repartidores")
        .select("*")
        .limit(5)

      // Verificar usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      setDebugInfo({
        empresas: {
          data: empresasData,
          error: empresasError,
          count: empresasData?.length || 0,
        },
        clientes: {
          data: clientesData,
          error: clientesError,
          count: clientesData?.length || 0,
        },
        repartidores: {
          data: repartidoresData,
          error: repartidoresError,
          count: repartidoresData?.length || 0,
        },
        user: {
          data: user,
          error: userError,
        },
      })
    } catch (err) {
      console.error("Error en debug:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return {
    debugInfo,
    loading,
    refetch: fetchDebugData,
  }
}
