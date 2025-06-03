"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"

export function EnvironmentChecker() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
  })

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  const allConfigured = envStatus.supabaseUrl && envStatus.supabaseKey

  if (process.env.NODE_ENV === "production" && allConfigured) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert variant={allConfigured ? "default" : "destructive"}>
        {allConfigured ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        <AlertDescription>
          <div className="text-sm">
            <p className="font-medium mb-2">{allConfigured ? "✅ Configuración OK" : "⚠️ Variables de entorno"}</p>
            <ul className="space-y-1 text-xs">
              <li className={envStatus.supabaseUrl ? "text-green-600" : "text-red-600"}>
                SUPABASE_URL: {envStatus.supabaseUrl ? "✅" : "❌"}
              </li>
              <li className={envStatus.supabaseKey ? "text-green-600" : "text-red-600"}>
                SUPABASE_ANON_KEY: {envStatus.supabaseKey ? "✅" : "❌"}
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
