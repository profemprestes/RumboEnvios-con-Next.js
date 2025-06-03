export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      empresas: {
        Row: {
          id: string
          nombre: string
          direccion: string | null
          telefono: string | null
          email: string | null
          latitud_empresa: number | null
          longitud_empresa: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          latitud_empresa?: number | null
          longitud_empresa?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string | null
          telefono?: string | null
          email?: string | null
          latitud_empresa?: number | null
          longitud_empresa?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          nombre: string
          apellido: string | null
          telefono: string | null
          email: string | null
          direccion: string | null
          latitud: number | null
          longitud: number | null
          empresa_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellido?: string | null
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          latitud?: number | null
          longitud?: number | null
          empresa_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellido?: string | null
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          latitud?: number | null
          longitud?: number | null
          empresa_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      repartidores: {
        Row: {
          id: string
          user_auth_id: string
          nombre: string
          apellido: string
          telefono: string | null
          vehiculo: string | null
          matricula: string | null
          activo: boolean
          empresa_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_auth_id: string
          nombre: string
          apellido: string
          telefono?: string | null
          vehiculo?: string | null
          matricula?: string | null
          activo?: boolean
          empresa_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_auth_id?: string
          nombre?: string
          apellido?: string
          telefono?: string | null
          vehiculo?: string | null
          matricula?: string | null
          activo?: boolean
          empresa_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      repartos: {
        Row: {
          id: string
          repartidor_id: string
          fecha: string
          estado: "pendiente" | "en_progreso" | "completado" | "cancelado"
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          repartidor_id: string
          fecha?: string
          estado?: "pendiente" | "en_progreso" | "completado" | "cancelado"
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          repartidor_id?: string
          fecha?: string
          estado?: "pendiente" | "en_progreso" | "completado" | "cancelado"
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      envios: {
        Row: {
          id: string
          numero_seguimiento: string
          cliente_id: string
          repartidor_id: string | null
          reparto_id: string | null
          direccion_origen: string
          latitud_origen: number
          longitud_origen: number
          direccion_destino: string
          latitud_destino: number
          longitud_destino: number
          estado: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido" | "cancelado"
          descripcion: string | null
          peso: number | null
          valor_declarado: number | null
          fecha_estimada: string | null
          fecha_entrega: string | null
          notas_entrega: string | null
          orden_parada: number | null
          tipo_envio: "entrega" | "recogida"
          es_parada_origen: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_seguimiento: string
          cliente_id: string
          repartidor_id?: string | null
          reparto_id?: string | null
          direccion_origen?: string
          latitud_origen: number
          longitud_origen: number
          direccion_destino: string
          latitud_destino: number
          longitud_destino: number
          estado?: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido" | "cancelado"
          descripcion?: string | null
          peso?: number | null
          valor_declarado?: number | null
          fecha_estimada?: string | null
          fecha_entrega?: string | null
          notas_entrega?: string | null
          orden_parada?: number | null
          tipo_envio?: "entrega" | "recogida"
          es_parada_origen?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_seguimiento?: string
          cliente_id?: string
          repartidor_id?: string | null
          reparto_id?: string | null
          direccion_origen?: string
          latitud_origen?: number
          longitud_origen?: number
          direccion_destino?: string
          latitud_destino?: number
          longitud_destino?: number
          estado?: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido" | "cancelado"
          descripcion?: string | null
          peso?: number | null
          valor_declarado?: number | null
          fecha_estimada?: string | null
          fecha_entrega?: string | null
          notas_entrega?: string | null
          orden_parada?: number | null
          tipo_envio?: "entrega" | "recogida"
          es_parada_origen?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      paradas_reparto: {
        Row: {
          id: string
          reparto_id: string
          envio_id: string
          orden: number
          completada: boolean
          hora_llegada: string | null
          hora_salida: string | null
          notas: string | null
          estado: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reparto_id: string
          envio_id: string
          orden: number
          completada?: boolean
          hora_llegada?: string | null
          hora_salida?: string | null
          notas?: string | null
          estado?: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reparto_id?: string
          envio_id?: string
          orden?: number
          completada?: boolean
          hora_llegada?: string | null
          hora_salida?: string | null
          notas?: string | null
          estado?: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido"
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_repartidor_id: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
    }
    Enums: {
      estado_envio: "pendiente" | "asignado" | "en_progreso" | "completado" | "fallido" | "cancelado"
      estado_reparto: "pendiente" | "en_progreso" | "completado" | "cancelado"
      tipo_envio: "entrega" | "recogida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
