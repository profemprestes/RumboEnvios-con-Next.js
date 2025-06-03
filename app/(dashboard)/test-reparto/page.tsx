"use client"

import { useState } from "react"
import { useEmpresas } from "@/hooks/use-empresas"
import { useRepartidores } from "@/hooks/use-repartidores"
import { useClientes } from "@/hooks/use-clientes"
import { useGenerarRepartosLote } from "@/hooks/use-generar-repartos-lote"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Loader2, TestTube } from "lucide-react"

export default function TestRepartoPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const { empresas, loading: loadingEmpresas } = useEmpresas()
  const { repartidores, loading: loadingRepartidores } = useRepartidores()
  const { clientes, loading: loadingClientes } = useClientes()
  const { generarRepartoLote, loading: generando, error } = useGenerarRepartosLote()

  const runTest = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      // Verificar que tenemos datos necesarios
      if (empresas.length === 0) {
        throw new Error("No hay empresas disponibles")
      }

      if (repartidores.length === 0) {
        throw new Error("No hay repartidores disponibles")
      }

      if (clientes.length === 0) {
        throw new Error("No hay clientes disponibles")
      }

      // Seleccionar datos para la prueba
      const empresaTest = empresas[0]
      const repartidorTest = repartidores[0]
      const clientesTest = clientes.filter((c) => c.empresa_id === empresaTest.id).slice(0, 2)

      if (clientesTest.length === 0) {
        throw new Error(`No hay clientes para la empresa ${empresaTest.nombre}`)
      }

      console.log("Datos de prueba:", {
        empresa: empresaTest,
        repartidor: repartidorTest,
        clientes: clientesTest,
      })

      // Configurar fecha de mañana
      const mañana = new Date()
      mañana.setDate(mañana.getDate() + 1)
      const fechaTest = mañana.toISOString().split("T")[0]

      // Ejecutar la generación
      const resultado = await generarRepartoLote({
        empresaId: empresaTest.id,
        repartidorId: repartidorTest.id,
        fechaReparto: fechaTest,
        clientesSeleccionados: clientesTest.map((c) => c.id),
        notas: "Reparto de prueba generado automáticamente",
      })

      setTestResult({
        success: resultado.success,
        data: resultado,
        testData: {
          empresa: empresaTest,
          repartidor: repartidorTest,
          clientes: clientesTest,
          fecha: fechaTest,
        },
      })
    } catch (err) {
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
        testData: null,
      })
    } finally {
      setTesting(false)
    }
  }

  const isLoading = loadingEmpresas || loadingRepartidores || loadingClientes

  return (
    <div className="space-y-6 pt-16">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prueba de Generación de Repartos</h1>
        <p className="text-gray-600">Verifica que el sistema de generación de repartos funcione correctamente</p>
      </div>

      {/* Estado de carga de datos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEmpresas ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant={empresas.length > 0 ? "default" : "destructive"}>{empresas.length} disponibles</Badge>
                {empresas.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Repartidores</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRepartidores ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant={repartidores.length > 0 ? "default" : "destructive"}>
                  {repartidores.length} disponibles
                </Badge>
                {repartidores.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingClientes ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant={clientes.length > 0 ? "default" : "destructive"}>{clientes.length} disponibles</Badge>
                {clientes.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Botón de prueba */}
      <Card>
        <CardHeader>
          <CardTitle>Ejecutar Prueba</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Esta prueba creará un reparto de ejemplo usando los primeros datos disponibles.
            </p>

            <Button onClick={runTest} disabled={isLoading || testing || generando} className="w-full">
              {testing || generando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ejecutando prueba...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Ejecutar Prueba de Generación
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error del hook:</strong> {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados de la prueba */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <span>Resultado de la Prueba</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResult.success ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>✅ Prueba exitosa!</strong>
                      </p>
                      <p>
                        Reparto ID: <code>{testResult.data.reparto?.id}</code>
                      </p>
                      <p>Total de paradas: {testResult.data.totalParadas}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>
                        <strong>❌ Prueba fallida</strong>
                      </p>
                      <p>Error: {testResult.error}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Datos de prueba utilizados */}
              {testResult.testData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Datos utilizados en la prueba:</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Empresa:</strong> {testResult.testData.empresa?.nombre}
                    </p>
                    <p>
                      <strong>Repartidor:</strong> {testResult.testData.repartidor?.nombre}{" "}
                      {testResult.testData.repartidor?.apellido}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {testResult.testData.fecha}
                    </p>
                    <p>
                      <strong>Clientes:</strong> {testResult.testData.clientes?.length} seleccionados
                    </p>
                  </div>
                </div>
              )}

              {/* Resultado completo */}
              <details className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium">Ver resultado completo (JSON)</summary>
                <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Datos disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Empresas Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEmpresas ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : empresas.length === 0 ? (
              <p className="text-sm text-red-500">No hay empresas disponibles</p>
            ) : (
              <div className="space-y-2">
                {empresas.slice(0, 3).map((empresa) => (
                  <div key={empresa.id} className="text-sm">
                    <p className="font-medium">{empresa.nombre}</p>
                    <p className="text-gray-500">{empresa.direccion}</p>
                  </div>
                ))}
                {empresas.length > 3 && <p className="text-xs text-gray-500">... y {empresas.length - 3} más</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Repartidores Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRepartidores ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : repartidores.length === 0 ? (
              <p className="text-sm text-red-500">No hay repartidores disponibles</p>
            ) : (
              <div className="space-y-2">
                {repartidores.slice(0, 3).map((repartidor) => (
                  <div key={repartidor.id} className="text-sm">
                    <p className="font-medium">
                      {repartidor.nombre} {repartidor.apellido}
                    </p>
                    <p className="text-gray-500">{repartidor.vehiculo || "Sin vehículo"}</p>
                  </div>
                ))}
                {repartidores.length > 3 && (
                  <p className="text-xs text-gray-500">... y {repartidores.length - 3} más</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingClientes ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : clientes.length === 0 ? (
              <p className="text-sm text-red-500">No hay clientes disponibles</p>
            ) : (
              <div className="space-y-2">
                {clientes.slice(0, 3).map((cliente) => (
                  <div key={cliente.id} className="text-sm">
                    <p className="font-medium">
                      {cliente.nombre} {cliente.apellido}
                    </p>
                    <p className="text-gray-500">{cliente.direccion}</p>
                  </div>
                ))}
                {clientes.length > 3 && <p className="text-xs text-gray-500">... y {clientes.length - 3} más</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
