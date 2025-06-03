"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Truck, LogOut, User, Menu } from "lucide-react"
import { useState } from "react"

export function DashboardNavbar() {
  const { repartidor, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Rumbo Envíos</h1>
            <p className="text-sm text-gray-500">Sistema de Gestión de Repartos</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{repartidor?.nombre?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block">{repartidor?.nombre || "Usuario"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
