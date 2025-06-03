"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, MapPin, Plus, Layers, TestTube, ShieldAlert } from "lucide-react"

const navigation = [
  {
    name: "Panel Principal",
    href: "/panel",
    icon: LayoutDashboard,
  },
  {
    name: "Mis Repartos",
    href: "/repartos",
    icon: Package,
  },
  {
    name: "Generar Reparto",
    href: "/repartos/nuevo",
    icon: Plus,
  },
  {
    name: "Reparto por Lote",
    href: "/repartos/lote",
    icon: Layers,
  },
  {
    name: "Mapa de Rutas",
    href: "/mapa-rutas",
    icon: MapPin,
  },
  {
    name: "Test Reparto",
    href: "/test-reparto",
    icon: TestTube,
  },
  {
    name: "Diagnóstico RLS",
    href: "/diagnostico-rls",
    icon: ShieldAlert,
  },
  {
    name: "Debug",
    href: "/debug",
    icon: LayoutDashboard,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 hidden lg:block">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
