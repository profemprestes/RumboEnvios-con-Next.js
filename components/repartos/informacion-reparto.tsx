"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, MapPin, Truck } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Database } from "@/types/database"

type Empresa = Database["public"]["Tables"]["empresas"]["Row"]
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"] & {
  empresas?: Empresa
}
type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  repartidores?: Repartidor
}

interface InformacionRepartoProps {
  reparto: Reparto
}

export function InformacionReparto({ reparto }: InformacionRepartoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Reparto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado y fecha */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Fecha</p>
              <p className="text-sm text-gray-600">
                {format(new Date(reparto.fecha), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
            </div>
          </div>

          {/* Horarios */}
          {reparto.hora_inicio && (
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Hora de Inicio</p>
                <p className="text-sm text-gray-600">{reparto.hora_inicio}</p>
              </div>
            </div>
          )}

          {reparto.hora_fin && (
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Hora de Finalización</p>
                <p className="text-sm text-gray-600">{reparto.hora_fin}</p>
              </div>
            </div>
          )}
        </div>

        {/* Información del repartidor */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Repartidor Asignado</h4>
          <div className="flex items-center space-x-3">
            <Truck className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium">
                {reparto.repartidores?.nombre} {reparto.repartidores?.apellido}
              </p>
              {reparto.repartidores?.telefono && (
                <p className="text-sm text-gray-600">{reparto.repartidores.telefono}</p>
              )}
              {reparto.repartidores?.vehiculo && (
                <p className="text-xs text-gray-500">Vehículo: {reparto.repartidores.vehiculo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información de la empresa */}
        {reparto.repartidores?.empresas && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Empresa</h4>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{reparto.repartidores.empresas.nombre}</p>
                {reparto.repartidores.empresas.direccion && (
                  <p className="text-sm text-gray-600">{reparto.repartidores.empresas.direccion}</p>
                )}
                {reparto.repartidores.empresas.telefono && (
                  <p className="text-sm text-gray-600">{reparto.repartidores.empresas.telefono}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas del reparto */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Estadísticas</h4>
          <div className="grid grid-cols-2 gap-4">
            {reparto.kilometros_recorridos && (
              <div>
                <p className="text-xs text-gray-500">Kilómetros</p>
                <p className="text-sm font-medium">{reparto.kilometros_recorridos} km</p>
              </div>
            )}
            {reparto.costo_total && (
              <div>
                <p className="text-xs text-gray-500">Costo Total</p>
                <p className="text-sm font-medium">${reparto.costo_total}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {reparto.notas && (
          <div className="border-t pt-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Notas</p>
                <p className="text-sm text-gray-600 italic">"{reparto.notas}"</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
