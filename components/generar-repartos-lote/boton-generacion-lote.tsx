"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Loader2, CheckCircle, AlertTriangle } from "lucide-react"

interface BotonGeneracionLoteProps {
  puedeGenerar: boolean
  generando: boolean
  onGenerar: () => void
  clientesSeleccionados: number
  error: string | null
}

export function BotonGeneracionLote({
  puedeGenerar,
  generando,
  onGenerar,
  clientesSeleccionados,
  error,
}: BotonGeneracionLoteProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto">
            <Package className="h-8 w-8 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Generar Reparto por Lote</h3>
            <p className="text-sm text-gray-600">
              {clientesSeleccionados > 0
                ? `Se creará un reparto con ${clientesSeleccionados + 1} paradas (origen + ${clientesSeleccionados} entregas)`
                : "Configura todos los campos para continuar"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!puedeGenerar && !error && (
            <Alert>
              <AlertDescription>
                Completa todos los campos obligatorios:
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>Selecciona una empresa de origen</li>
                  <li>Asigna un repartidor</li>
                  <li>Elige una fecha del reparto</li>
                  <li>Selecciona al menos un cliente</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={onGenerar} disabled={!puedeGenerar || generando} className="w-full" size="lg">
            {generando ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generando Reparto por Lote...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Generar Reparto por Lote
              </>
            )}
          </Button>

          {puedeGenerar && !generando && (
            <p className="text-xs text-gray-500">
              Se crearán automáticamente todos los registros necesarios en la base de datos
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
