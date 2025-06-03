"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, CheckCircle, Calendar, Building } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
}

interface DetalleRepartoHeaderProps {
  reparto: Reparto
  onUpdateEstado: (id: number, estado: "planificado" | "en_progreso" | "completado" | "cancelado") => Promise<any>
}

const estadoColors = {
  planificado: "bg-gray-100 text-gray-800",
  en_progreso: "bg-yellow-100 text-yellow-800",
  completado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
}

const estadoLabels = {
  planificado: "Planificado",
  en_progreso: "En Progreso",
  completado: "Completado",
  cancelado: "Cancelado",
}

export function DetalleRepartoHeader({ reparto, onUpdateEstado }: DetalleRepartoHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/repartos">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl">Reparto #{reparto.id}</CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(reparto.fecha_reparto).toLocaleDateString()}</span>
                </div>
                {reparto.empresas && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{reparto.empresas.nombre}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={estadoColors[reparto.estado]}>{estadoLabels[reparto.estado]}</Badge>
            {reparto.estado === "planificado" && (
              <Button
                onClick={() => onUpdateEstado(reparto.id, "en_progreso")}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Iniciar Reparto
              </Button>
            )}
            {reparto.estado === "en_progreso" && (
              <Button
                onClick={() => onUpdateEstado(reparto.id, "completado")}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completar Reparto
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
