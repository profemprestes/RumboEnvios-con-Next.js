import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Building, FileText, Clock } from "lucide-react"
import type { Database } from "@/types/database"

type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  empresas?: Database["public"]["Tables"]["empresas"]["Row"]
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
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium">Fecha de Reparto</p>
            <p className="text-sm text-gray-600">{new Date(reparto.fecha_reparto).toLocaleDateString()}</p>
          </div>
        </div>

        {reparto.empresas && (
          <div className="flex items-start space-x-3">
            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Empresa Asociada</p>
              <p className="text-sm text-gray-600">{reparto.empresas.nombre}</p>
              <p className="text-xs text-gray-500">{reparto.empresas.direccion}</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Fechas</p>
            <p className="text-xs text-gray-500">Creado: {new Date(reparto.created_at).toLocaleString()}</p>
            <p className="text-xs text-gray-500">Actualizado: {new Date(reparto.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {reparto.notas && (
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Notas</p>
              <p className="text-sm text-gray-600 italic">"{reparto.notas}"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
