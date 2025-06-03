"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import type { Database } from "@/types/database"

type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"]

interface AuthContextType {
  user: User | null
  repartidor: Repartidor | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [repartidor, setRepartidor] = useState<Repartidor | null>(null)
  const [loading, setLoading] = useState(true)

  // Crear una sola instancia del cliente Supabase
  const supabase = createClient()

  const fetchRepartidor = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase.from("repartidores").select("*").eq("user_auth_id", userId).single()

        if (error) {
          console.error("Error fetching repartidor:", error)
          return
        }

        setRepartidor(data)
      } catch (error) {
        console.error("Error fetching repartidor:", error)
      }
    },
    [supabase],
  )

  useEffect(() => {
    let mounted = true

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (mounted) {
          setUser(session?.user ?? null)

          if (session?.user) {
            await fetchRepartidor(session.user.id)
          }

          setLoading(false)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchRepartidor(session.user.id)
        } else {
          setRepartidor(null)
        }

        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchRepartidor])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const value = {
    user,
    repartidor,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
