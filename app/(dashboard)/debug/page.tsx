"use client"

import { useDebugData } from "@/hooks/use-debug-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function DebugPage() {
  const { debugInfo, loading, refetch } = useDebugData()

  if (loading) {
    return (
      <div className="space-y-6 pt-16">
        <h1 className="text-3xl font-bold">Debug - Cargando...</h1>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Debug de Datos</h1>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Usuario Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Empresas */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas ({debugInfo.empresas?.count || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify(debugInfo.empresas, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes ({debugInfo.clientes?.count || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify(debugInfo.clientes, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Repartidores */}
        <Card>
          <CardHeader>
            <CardTitle>Repartidores ({debugInfo.repartidores?.count || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
              {JSON.stringify(debugInfo.repartidores, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
