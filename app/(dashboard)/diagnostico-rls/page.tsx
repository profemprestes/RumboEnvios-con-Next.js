"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react"

export default function DiagnosticoRLSPage() {
  const [diagnostico, setDiagnostico] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user, repartidor } = useAuth()
  const supabase = createClient()

  const ejecutarDiagnostico = async () => {
    setLoading(true)
    setDiagnostico(null)

    try {
      // 1. Verificar usuario autenticado
      const authCheck = {
        user: user ? { id: user.id, email: user.email } : null,
        repartidor: repartidor,
        tieneUsuario: !!user,
        tieneRepartidor: !!repartidor,
        coincideIds: user && repartidor ? repartidor.user_auth_id === user.id : false,
      }

      // 2. Verificar función get_current_repartidor_id
      const currentRepartidorId = null
      const { data: rpcData, error: rpcError } = await supabase.rpc("get_current_repartidor_id")

      // 3. Verificar repartos directamente
      const { data: repartos, error: repartosError } = await supabase.from("repartos").select("*").limit(5)

      // 4. Verificar repartos con repartidor_id específico
      const { data: repartosConId, error: repartosConIdError } = repartidor
        ? await supabase.from("repartos").select("*").eq("repartidor_id", repartidor.id).limit(5)
        : { data: null, error: new Error("No hay repartidor autenticado") }

      // 5. Verificar políticas RLS
      const { data: politicas, error: politicasError } = await supabase
        .from("rls_diagnostico")
        .select("*")
        .limit(1)
        .maybeSingle()

      // 6. Verificar permisos directos
      let permisosDirectos = null
      try {
        const { data } = await supabase.auth.getSession()
        permisosDirectos = {
          tieneSession: !!data.session,
          role: data.session?.user?.role,
        }
      } catch (err) {
        permisosDirectos = { error: err instanceof Error ? err.message : "Error desconocido" }
      }

      setDiagnostico({
        timestamp: new Date().toISOString(),
        authCheck,
        currentRepartidorId: {
          data: rpcData,
          error: rpcError ? rpcError.message : null,
          success: !rpcError && rpcData !== null,
        },
        repartos: {
          data: repartos,
          error: repartosError ? repartosError.message : null,
          count: repartos?.length || 0,
          success: !repartosError,
        },
        repartosConId: {
          data: repartosConId,
          error: repartosConIdError ? repartosConIdError.message : null,
          count: repartosConId?.length || 0,
          success: !repartosConIdError,
        },
        politicas: {
          data: politicas,
          error: politicasError ? politicasError.message : null,
          success: !politicasError,
        },
        permisosDirectos,
      })
    } catch (err) {
      console.error("Error en diagnóstico:", err)
      setDiagnostico({
        error: err instanceof Error ? err.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ejecutarDiagnostico()
  }, [])

  return (
    <div className="space-y-6 pt-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnóstico de Permisos RLS</h1>
          <p className="text-gray-600">Verifica los permisos y políticas de seguridad de la base de datos</p>
        </div>
        <Button onClick={ejecutarDiagnostico} disabled={loading} variant="outline">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {loading ? "Ejecutando..." : "Actualizar"}
        </Button>
      </div>

      {/* Resumen de diagnóstico */}
      {diagnostico && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Resumen de Diagnóstico</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Autenticación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Estado de Autenticación</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Usuario autenticado:</span>
                      <Badge variant={diagnostico.authCheck.tieneUsuario ? "default" : "destructive"}>
                        {diagnostico.authCheck.tieneUsuario ? "Sí" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repartidor asociado:</span>
                      <Badge variant={diagnostico.authCheck.tieneRepartidor ? "default" : "destructive"}>
                        {diagnostico.authCheck.tieneRepartidor ? "Sí" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IDs coinciden:</span>
                      <Badge variant={diagnostico.authCheck.coincideIds ? "default" : "destructive"}>
                        {diagnostico.authCheck.coincideIds ? "Sí" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Función get_current_repartidor_id</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Función ejecutada:</span>
                      <Badge variant={diagnostico.currentRepartidorId.success ? "default" : "destructive"}>
                        {diagnostico.currentRepartidorId.success ? "Éxito" : "Error"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ID devuelto:</span>
                      <code className="text-xs bg-gray-100 p-1 rounded">
                        {diagnostico.currentRepartidorId.data || "null"}
                      </code>
                    </div>
                    {diagnostico.currentRepartidorId.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{diagnostico.currentRepartidorId.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              {/* Repartos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Repartos (consulta general)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consulta ejecutada:</span>
                      <Badge variant={diagnostico.repartos.success ? "default" : "destructive"}>
                        {diagnostico.repartos.success ? "Éxito" : "Error"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repartos encontrados:</span>
                      <Badge>{diagnostico.repartos.count}</Badge>
                    </div>
                    {diagnostico.repartos.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{diagnostico.repartos.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Repartos (con ID específico)</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consulta ejecutada:</span>
                      <Badge variant={diagnostico.repartosConId.success ? "default" : "destructive"}>
                        {diagnostico.repartosConId.success ? "Éxito" : "Error"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Repartos encontrados:</span>
                      <Badge>{diagnostico.repartosConId.count}</Badge>
                    </div>
                    {diagnostico.repartosConId.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{diagnostico.repartosConId.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              {/* Diagnóstico general */}
              <Alert variant={diagnostico.repartosConId.count > 0 ? "default" : "destructive"}>
                {diagnostico.repartosConId.count > 0 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {diagnostico.repartosConId.count > 0 ? (
                    <span>
                      Los permisos RLS parecen estar configurados correctamente. Se encontraron{" "}
                      <strong>{diagnostico.repartosConId.count}</strong> repartos para el repartidor actual.
                    </span>
                  ) : (
                    <span>
                      <strong>Problema detectado:</strong> No se encontraron repartos para el repartidor actual. Esto
                      puede deberse a un problema con las políticas RLS o a que no hay repartos asignados.
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {/* Detalles completos */}
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">Ver diagnóstico completo</summary>
                <div className="mt-2 bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-xs">{JSON.stringify(diagnostico, null, 2)}</pre>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Soluciones recomendadas */}
      <Card>
        <CardHeader>
          <CardTitle>Soluciones Recomendadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">1. Verificar la función get_current_repartidor_id</h3>
            <p className="text-sm text-gray-600">
              Esta función es crucial para las políticas RLS. Debe devolver correctamente el ID del repartidor actual.
            </p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <pre>{`CREATE OR REPLACE FUNCTION get_current_repartidor_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id 
    FROM public.repartidores 
    WHERE user_auth_id = auth.uid()
    AND activo = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">2. Verificar las políticas RLS para repartos</h3>
            <p className="text-sm text-gray-600">
              Las políticas deben permitir que un repartidor vea sus propios repartos.
            </p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <pre>{`-- Eliminar políticas existentes
DROP POLICY IF EXISTS "repartos_select_own" ON public.repartos;

-- Crear nueva política
CREATE POLICY "repartos_select_own" ON public.repartos
  FOR SELECT USING (repartidor_id = get_current_repartidor_id());`}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">3. Crear tabla de diagnóstico RLS</h3>
            <p className="text-sm text-gray-600">Esta tabla ayudará a diagnosticar problemas de permisos.</p>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <pre>{`-- Crear tabla de diagnóstico
CREATE TABLE IF NOT EXISTS public.rls_diagnostico (
  id serial PRIMARY KEY,
  nombre text,
  descripcion text
);

-- Insertar datos de prueba
INSERT INTO public.rls_diagnostico (nombre, descripcion)
VALUES ('test', 'Registro de prueba para diagnóstico RLS');

-- Crear política permisiva
CREATE POLICY "rls_diagnostico_select_all" ON public.rls_diagnostico
  FOR SELECT USING (true);

-- Habilitar RLS
ALTER TABLE public.rls_diagnostico ENABLE ROW LEVEL SECURITY;`}</pre>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Ejecuta estos scripts en el SQL Editor de Supabase para corregir los problemas de permisos. Luego vuelve a
              ejecutar el diagnóstico para verificar que todo funcione correctamente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
