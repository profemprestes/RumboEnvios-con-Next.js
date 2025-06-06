"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { user, loading, signIn } = useAuth()
  const router = useRouter()
  const [loginAttempted, setLoginAttempted] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const attemptAutoLogin = useCallback(async () => {
    if (loginAttempted) return
    
    setLoginAttempted(true)
    setLoginError(null)
    
    try {
      const { error } = await signIn("p@p.com", "123456")
      
      if (error) {
        console.error("Error en auto-login:", error)
        setLoginError("Error de autenticación")
        
        // Esperar un momento y luego redirigir al login manual
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Error durante auto-login:", error)
      setLoginError("Error de conexión")
      
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }, [signIn, router, loginAttempted])

  useEffect(() => {
    if (loading) return

    if (user) {
      // Usuario autenticado, ir al panel
      router.push("/panel")
    } else if (!loginAttempted) {
      // Intentar login automático
      attemptAutoLogin()
    }
  }, [user, loading, loginAttempted, attemptAutoLogin, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loginError ? loginError : "Cargando Rumbo Envíos..."}
        </p>
        {loginError && (
          <p className="text-sm text-gray-500 mt-2">
            Redirigiendo al login...
          </p>
        )}
      </div>
    </div>
  )
}
