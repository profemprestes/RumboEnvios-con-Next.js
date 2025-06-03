import type React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Building } from "lucide-react"
import type { Database } from "@/lib/database.types"

// Define the type for Reparto with the updated empresas reference
type Reparto = Database["public"]["Tables"]["repartos"]["Row"] & {
  repartidores?: Database["public"]["Tables"]["repartidores"]["Row"] & {
    empresas?: Database["public"]["Tables"]["empresas"]["Row"]
  }
}

// Define the type for Repartidor
type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"]

// Define the type for Empresa
type Empresa = Database["public"]["Tables"]["empresas"]["Row"]

// Define the type for Cliente
type Cliente = Database["public"]["Tables"]["clientes"]["Row"]

// Fix the default marker's icon path
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

interface MapaRutasInteractivoProps {
  repartos: Reparto[]
  clientes: Cliente[]
}

const MapaRutasInteractivo: React.FC<MapaRutasInteractivoProps> = ({ repartos, clientes }) => {
  // Calculate the center of the map based on the first reparto's coordinates
  const initialPosition =
    repartos.length > 0 && clientes.length > 0 ? [clientes[0].latitud || 0, clientes[0].longitud || 0] : [0, 0] // Default to [0, 0] if there are no repartos or clientes

  return (
    <MapContainer center={initialPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {repartos.map((reparto) => {
        const cliente = clientes.find((c) => c.id === reparto.cliente_id)

        if (!cliente || !cliente.latitud || !cliente.longitud) {
          return null // Skip if cliente data is missing
        }

        const position: [number, number] = [cliente.latitud, cliente.longitud]

        return (
          <Marker key={reparto.id} position={position}>
            <Popup>
              <div>
                <h3 className="font-bold">{cliente.nombre}</h3>
                <p>{cliente.direccion}</p>
                <p>Reparto ID: {reparto.id}</p>
                {reparto.repartidores?.empresas && (
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span className="truncate">{reparto.repartidores.empresas.nombre}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* You can add Polyline components here to draw routes if you have route data */}
    </MapContainer>
  )
}

export default MapaRutasInteractivo
