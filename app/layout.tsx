import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { EnvironmentChecker } from "@/components/environment-checker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rumbo Envíos - Sistema de Gestión de Repartos",
  description: "Sistema integral de gestión de repartos y entregas para optimizar la logística de última milla",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <EnvironmentChecker />
        </AuthProvider>
      </body>
    </html>
  )
}
