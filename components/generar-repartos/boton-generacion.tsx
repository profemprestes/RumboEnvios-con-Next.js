"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Loader2, CheckCircle } from "lucide-react"

interface BotonGeneracionProps {
  puedeGenerar: boolean
  generando: boolean
  onGenerar: () => void
  clientesSeleccionados: number
}

export function BotonGeneracion({ puedeGenerar, generando, onGenerar, clientesSeleccionados }: BotonGeneracionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
            <Package className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Generar Reparto</h3>
            <p className="text-sm text-gray-600">
              {clientesSeleccionados > 0
                ? `Se creará un reparto con ${clientesSeleccionados} parada${clientesSeleccionados > 1 ? "s" : ""}`
                : "Selecciona al menos un cliente para continuar"}
            </p>
          </div>

          {!puedeGenerar && (
            <Alert>
              <AlertDescription>
                Completa todos los campos requeridos:
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Selecciona una empresa</li>
                  <li>Elige una fecha</li>
                  <li>Selecciona al menos un cliente</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={onGenerar} disabled={!puedeGenerar || generando} className="w-full" size="lg">
            {generando ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generando Reparto...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Generar Reparto
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
