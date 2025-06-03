import { Building, Truck } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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

interface ResumenRepartosProps {
  repartos: Reparto[]
}

export function ResumenRepartos({ repartos }: ResumenRepartosProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Resumen de Repartos</h2>
      <Separator />
      <div className="grid grid-cols-1 gap-4">
        {repartos.map((reparto) => (
          <div key={reparto.id} className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Reparto {reparto.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(reparto.fecha), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <Badge variant="secondary">{reparto.estado}</Badge>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>
                {reparto.repartidores?.nombre} {reparto.repartidores?.apellido}
              </span>
            </div>
            {reparto.repartidores?.empresas && (
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{reparto.repartidores.empresas.nombre}</span>
              </div>
            )}
            {reparto.notas && <p className="text-sm text-gray-500 mt-2">{reparto.notas}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
