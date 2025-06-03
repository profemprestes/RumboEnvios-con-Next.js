"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Phone, Mail, CheckSquare, Square } from "lucide-react"
import type { Database } from "@/types/database"

type Cliente = Database["public"]["Tables"]["clientes"]["Row"]

interface SeleccionClientesLoteProps {
  clientes: Cliente[]
  loadingClientes: boolean
  clientesSeleccionados: string[]
  setClientesSeleccionados: (clientes: string[]) => void
  empresaSeleccionada: string
}

export function SeleccionClientesLote({
  clientes,
  loadingClientes,
  clientesSeleccionados,
  setClientesSeleccionados,
  empresaSeleccionada,
}: SeleccionClientesLoteProps) {
  const toggleCliente = (clienteId: string) => {
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

  const todosSeleccionados = clientes.length > 0 && clientesSeleccionados.length === clientes.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Seleccionar Clientes para el Reparto</span>
          </CardTitle>
          {clientes.length > 0 && (
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-sm">
                {clientesSeleccionados.length} de {clientes.length} seleccionados
              </Badge>
              <Button variant="outline" size="sm" onClick={seleccionarTodos} className="flex items-center space-x-1">
                {todosSeleccionados ? (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    <span>Deseleccionar todos</span>
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4" />
                    <span>Seleccionar todos</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!empresaSeleccionada ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Selecciona una empresa</h3>
            <p>Primero debes seleccionar una empresa para ver sus clientes disponibles</p>
          </div>
        ) : loadingClientes ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : clientes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No hay clientes disponibles</h3>
            <p>Esta empresa no tiene clientes activos registrados</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {clientes.map((cliente, index) => (
              <div
                key={cliente.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  clientesSeleccionados.includes(cliente.id)
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => toggleCliente(cliente.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex items-center pt-1">
                    <Checkbox
                      checked={clientesSeleccionados.includes(cliente.id)}
                      onChange={() => toggleCliente(cliente.id)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        Parada #{index + 1}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{cliente.direccion || "Sin dirección"}</span>
                      </div>
                      {cliente.telefono && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{cliente.telefono}</span>
                        </div>
                      )}
                      {cliente.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
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
