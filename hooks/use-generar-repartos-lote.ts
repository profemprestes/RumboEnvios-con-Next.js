"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { TIPOS_ENVIO, ESTADOS_ENVIO } from "@/lib/constants"

interface ConfiguracionRepartoLote {
  empresaId: string
  repartidorId: string
  fechaReparto: string
  clientesSeleccionados: string[]
  notas?: string
}

export function useGenerarRepartosLote() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const generarRepartoLote = async (configuracion: ConfiguracionRepartoLote) => {
    try {
      setLoading(true)
      setError(null)

      console.log("🚀 Iniciando generación de reparto por lote:", configuracion)

      // Validaciones iniciales
      if (!configuracion.empresaId || !configuracion.repartidorId || !configuracion.fechaReparto) {
        throw new Error("Faltan datos obligatorios: empresa, repartidor o fecha")
      }

      if (configuracion.clientesSeleccionados.length === 0) {
        throw new Error("Debe seleccionar al menos un cliente")
      }

      console.log("✅ Validaciones iniciales pasadas")

      // Verificar que el repartidor existe y está activo
      console.log("🔍 Verificando repartidor:", configuracion.repartidorId)
      const { data: repartidor, error: repartidorError } = await supabase
        .from("repartidores")
        .select("*")
        .eq("id", configuracion.repartidorId)
        .eq("activo", true)
        .single()

      if (repartidorError) {
        console.error("❌ Error verificando repartidor:", repartidorError)
        throw new Error(`Error al verificar repartidor: ${repartidorError.message}`)
      }

      if (!repartidor) {
        throw new Error("Repartidor no encontrado o inactivo")
      }

      console.log("✅ Repartidor verificado:", repartidor.nombre, repartidor.apellido)

      // Obtener datos de la empresa
      console.log("🔍 Obteniendo empresa:", configuracion.empresaId)
      const { data: empresa, error: empresaError } = await supabase
        .from("empresas")
        .select("*")
        .eq("id", configuracion.empresaId)
        .single()

      if (empresaError) {
        console.error("❌ Error obteniendo empresa:", empresaError)
        throw new Error(`Error al obtener empresa: ${empresaError.message}`)
      }

      if (!empresa) {
        throw new Error("Empresa no encontrada")
      }

      console.log("✅ Empresa encontrada:", empresa.nombre)

      // 1. Crear el reparto
      console.log("📝 Creando reparto...")
      const { data: reparto, error: repartoError } = await supabase
        .from("repartos")
        .insert({
          repartidor_id: configuracion.repartidorId,
          fecha: configuracion.fechaReparto,
          estado: "pendiente",
          notas: configuracion.notas || null,
        })
        .select()
        .single()

      if (repartoError) {
        console.error("❌ Error creando reparto:", repartoError)
        throw new Error(`Error al crear reparto: ${repartoError.message}`)
      }

      console.log("✅ Reparto creado:", reparto.id)

      // 2. Crear parada 0 (empresa - punto de partida)
      console.log("📍 Creando parada de origen...")
      const { data: envioOrigen, error: envioOrigenError } = await supabase
        .from("envios")
        .insert({
          cliente_id: configuracion.clientesSeleccionados[0], // Temporal, se actualizará
          direccion_origen: empresa.direccion || "Punto de partida",
          latitud_origen: empresa.latitud_empresa || -34.6037,
          longitud_origen: empresa.longitud_empresa || -58.3816,
          direccion_destino: empresa.direccion || "Punto de partida",
          latitud_destino: empresa.latitud_empresa || -34.6037,
          longitud_destino: empresa.longitud_empresa || -58.3816,
          estado: ESTADOS_ENVIO.ASIGNADO,
          descripcion: `Punto de partida - ${empresa.nombre}`,
          fecha_estimada: configuracion.fechaReparto,
          repartidor_id: configuracion.repartidorId,
          reparto_id: reparto.id,
          tipo_envio: TIPOS_ENVIO.ORIGEN,
          es_parada_origen: true,
          orden_parada: 0,
          numero_seguimiento: `ORIGEN-${reparto.id.slice(0, 8)}`,
        })
        .select()
        .single()

      if (envioOrigenError) {
        console.error("❌ Error creando envío origen:", envioOrigenError)
        throw new Error(`Error al crear envío origen: ${envioOrigenError.message}`)
      }

      console.log("✅ Envío origen creado:", envioOrigen.id)

      // 3. Crear parada 0 en paradas_reparto
      console.log("📍 Creando parada de reparto origen...")
      const { error: paradaOrigenError } = await supabase.from("paradas_reparto").insert({
        reparto_id: reparto.id,
        envio_id: envioOrigen.id,
        orden: 0,
        estado: "asignado",
        notas_parada: `Punto de partida - ${empresa.nombre}`,
        completada: false,
      })

      if (paradaOrigenError) {
        console.error("❌ Error creando parada origen:", paradaOrigenError)
        throw new Error(`Error al crear parada origen: ${paradaOrigenError.message}`)
      }

      console.log("✅ Parada origen creada")

      // 4. Crear paradas para cada cliente (1 a N)
      console.log(`📦 Creando ${configuracion.clientesSeleccionados.length} paradas de entrega...`)

      const enviosPromises = configuracion.clientesSeleccionados.map(async (clienteId, index) => {
        console.log(`🔄 Procesando cliente ${index + 1}/${configuracion.clientesSeleccionados.length}:`, clienteId)

        // Obtener datos del cliente
        const { data: cliente, error: clienteError } = await supabase
          .from("clientes")
          .select("*")
          .eq("id", clienteId)
          .single()

        if (clienteError) {
          console.error(`❌ Error obteniendo cliente ${clienteId}:`, clienteError)
          throw new Error(`Error al obtener cliente ${index + 1}: ${clienteError.message}`)
        }

        if (!cliente) {
          throw new Error(`Cliente ${index + 1} no encontrado`)
        }

        console.log(`✅ Cliente ${index + 1} encontrado:`, cliente.nombre, cliente.apellido)

        // Determinar origen (empresa para primera parada, cliente anterior para las siguientes)
        let direccionOrigen = empresa.direccion || "Origen no especificado"
        let latitudOrigen = empresa.latitud_empresa || -34.6037
        let longitudOrigen = empresa.longitud_empresa || -58.3816

        if (index > 0) {
          // Para paradas posteriores a la primera, el origen es el cliente anterior
          const clienteAnteriorId = configuracion.clientesSeleccionados[index - 1]
          const { data: clienteAnterior } = await supabase
            .from("clientes")
            .select("*")
            .eq("id", clienteAnteriorId)
            .single()

          if (clienteAnterior) {
            direccionOrigen = clienteAnterior.direccion || "Origen no especificado"
            latitudOrigen = Number(clienteAnterior.latitud) || -34.6037
            longitudOrigen = Number(clienteAnterior.longitud) || -58.3816
          }
        }

        // Crear envío
        const envioData = {
          cliente_id: clienteId,
          direccion_origen: direccionOrigen,
          latitud_origen: latitudOrigen,
          longitud_origen: longitudOrigen,
          direccion_destino: cliente.direccion || "Destino no especificado",
          latitud_destino: Number(cliente.latitud) || -34.6037,
          longitud_destino: Number(cliente.longitud) || -58.3816,
          estado: ESTADOS_ENVIO.ASIGNADO,
          descripcion: `Entrega a ${cliente.nombre} ${cliente.apellido || ""}`,
          fecha_estimada: configuracion.fechaReparto,
          repartidor_id: configuracion.repartidorId,
          reparto_id: reparto.id,
          tipo_envio: TIPOS_ENVIO.ENTREGA,
          es_parada_origen: false,
          orden_parada: index + 1,
          numero_seguimiento: `${reparto.id.slice(0, 8)}-${String(index + 1).padStart(3, "0")}`,
        }

        console.log(`📝 Datos del envío ${index + 1}:`, envioData)

        const { data: envio, error: envioError } = await supabase.from("envios").insert(envioData).select().single()

        if (envioError) {
          console.error(`❌ Error creando envío para cliente ${index + 1}:`, envioError)
          throw new Error(`Error al crear envío para cliente ${index + 1}: ${envioError.message}`)
        }

        console.log(`✅ Envío ${index + 1} creado:`, envio.id)

        // Crear parada de reparto
        const paradaData = {
          reparto_id: reparto.id,
          envio_id: envio.id,
          orden: index + 1,
          estado: "asignado",
          notas_parada: `Entrega a ${cliente.nombre} ${cliente.apellido || ""} - ${cliente.direccion}`,
          completada: false,
        }

        console.log(`📝 Datos de la parada ${index + 1}:`, paradaData)

        const { error: paradaError } = await supabase.from("paradas_reparto").insert(paradaData)

        if (paradaError) {
          console.error(`❌ Error creando parada ${index + 1}:`, paradaError)
          throw new Error(`Error al crear parada ${index + 1}: ${paradaError.message}`)
        }

        console.log(`✅ Parada ${index + 1} creada`)

        return envio
      })

      await Promise.all(enviosPromises)

      console.log("🎉 Reparto por lote generado exitosamente")

      return {
        success: true,
        reparto,
        totalParadas: configuracion.clientesSeleccionados.length + 1, // +1 por la parada de origen
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("💥 Error en generarRepartoLote:", err)
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    generarRepartoLote,
    loading,
    error,
  }
}
