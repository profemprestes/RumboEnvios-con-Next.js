"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Phone, Mail } from "lucide-react"
import type { Database } from "@/types/database"

type Cliente = Database["public"]["Tables"]["clientes"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

interface SeleccionClientesProps {
  clientes: Cliente[]
  loadingClientes: boolean
  clientesSeleccionados: number[]
  setClientesSeleccionados: (clientes: number[]) => void
  empresaSeleccionada: number | null
}

export function SeleccionClientes({
  clientes,
  loadingClientes,
  clientesSeleccionados,
  setClientesSeleccionados,
  empresaSeleccionada,
}: SeleccionClientesProps) {
  const toggleCliente = (clienteId: number) => {
    if (clientesSeleccionados.includes(clienteId)) {
      setClientesSeleccionados(clientesSeleccionados.filter((id) => id !== clienteId))
    } else {
      setClientesSeleccionados([...clientesSeleccionados, clienteId])
    }
  }

  const seleccionarTodos = () => {
    if (clientesSeleccionados.length === clientes.length) {
      setClientesSeleccionados([])
    } else {
      setClientesSeleccionados(clientes.map((c) => c.id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Seleccionar Clientes</span>
          </CardTitle>
          {clientes.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {clientesSeleccionados.length} de {clientes.length}
              </Badge>
              <Checkbox checked={clientesSeleccionados.length === clientes.length} onCheckedChange={seleccionarTodos} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!empresaSeleccionada ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Selecciona una empresa para ver sus clientes</p>
          </div>
        ) : loadingClientes ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay clientes disponibles para esta empresa</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  clientesSeleccionados.includes(cliente.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => toggleCliente(cliente.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={clientesSeleccionados.includes(cliente.id)}
                    onChange={() => toggleCliente(cliente.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {cliente.nombre} {cliente.apellido}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{cliente.direccion}</span>
                      </div>
                      {cliente.telefono && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{cliente.telefono}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{cliente.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
