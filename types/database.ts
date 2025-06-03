export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          activo: boolean | null
          apellido: string | null
          codigo_cliente: string | null
          created_at: string
          direccion: string | null
          email: string | null
          empresa_id: string | null
          id: string
          latitud: number | null
          longitud: number | null
          nombre: string
          notas: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean | null
          apellido?: string | null
          codigo_cliente?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          empresa_id?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean | null
          apellido?: string | null
          codigo_cliente?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          empresa_id?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          nombre?: string
          notas?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          activa: boolean | null
          codigo_empresa: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          latitud_empresa: number | null
          longitud_empresa: number | null
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activa?: boolean | null
          codigo_empresa?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          latitud_empresa?: number | null
          longitud_empresa?: number | null
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activa?: boolean | null
          codigo_empresa?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          latitud_empresa?: number | null
          longitud_empresa?: number | null
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      envios: {
        Row: {
          cliente_id: string
          created_at: string
          descripcion: string | null
          direccion_destino: string
          direccion_origen: string
          distancia_km: number | null
          es_parada_origen: boolean | null
          estado: Database["public"]["Enums"]["estado_envio"]
          fecha_entrega: string | null
          fecha_estimada: string | null
          id: string
          latitud_destino: number
          latitud_origen: number
          longitud_destino: number
          longitud_origen: number
          notas_entrega: string | null
          numero_seguimiento: string
          orden_parada: number | null
          peso: number | null
          peso_kg: number | null
          precio: number | null
          repartidor_id: string | null
          reparto_id: string | null
          tiempo_estimado_minutos: number | null
          tipo_envio: Database["public"]["Enums"]["tipo_envio"] | null
          updated_at: string
          valor_declarado: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          descripcion?: string | null
          direccion_destino: string
          direccion_origen?: string
          distancia_km?: number | null
          es_parada_origen?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio"]
          fecha_entrega?: string | null
          fecha_estimada?: string | null
          id?: string
          latitud_destino: number
          latitud_origen: number
          longitud_destino: number
          longitud_origen: number
          notas_entrega?: string | null
          numero_seguimiento: string
          orden_parada?: number | null
          peso?: number | null
          peso_kg?: number | null
          precio?: number | null
          repartidor_id?: string | null
          reparto_id?: string | null
          tiempo_estimado_minutos?: number | null
          tipo_envio?: Database["public"]["Enums"]["tipo_envio"] | null
          updated_at?: string
          valor_declarado?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          descripcion?: string | null
          direccion_destino?: string
          direccion_origen?: string
          distancia_km?: number | null
          es_parada_origen?: boolean | null
          estado?: Database["public"]["Enums"]["estado_envio"]
          fecha_entrega?: string | null
          fecha_estimada?: string | null
          id?: string
          latitud_destino?: number
          latitud_origen?: number
          longitud_destino?: number
          longitud_origen?: number
          notas_entrega?: string | null
          numero_seguimiento?: string
          orden_parada?: number | null
          peso?: number | null
          peso_kg?: number | null
          precio?: number | null
          repartidor_id?: string | null
          reparto_id?: string | null
          tiempo_estimado_minutos?: number | null
          tipo_envio?: Database["public"]["Enums"]["tipo_envio"] | null
          updated_at?: string
          valor_declarado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "envios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_repartidor_id_fkey"
            columns: ["repartidor_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "envios_reparto_id_fkey"
            columns: ["reparto_id"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
        ]
      }
      paradas_reparto: {
        Row: {
          completada: boolean
          created_at: string
          envio_id: string
          estado: string | null
          firma_cliente: string | null
          foto_entrega: string | null
          hora_estimada_llegada: string | null
          hora_llegada: string | null
          hora_real_llegada: string | null
          hora_real_salida: string | null
          hora_salida: string | null
          id: string
          notas_parada: string | null
          notas_parada_old: string | null
          orden: number
          reparto_id: string
          tiempo_permanencia_minutos: number | null
          updated_at: string
        }
        Insert: {
          completada?: boolean
          created_at?: string
          envio_id: string
          estado?: string | null
          firma_cliente?: string | null
          foto_entrega?: string | null
          hora_estimada_llegada?: string | null
          hora_llegada?: string | null
          hora_real_llegada?: string | null
          hora_real_salida?: string | null
          hora_salida?: string | null
          id?: string
          notas_parada?: string | null
          notas_parada_old?: string | null
          orden: number
          reparto_id: string
          tiempo_permanencia_minutos?: number | null
          updated_at?: string
        }
        Update: {
          completada?: boolean
          created_at?: string
          envio_id?: string
          estado?: string | null
          firma_cliente?: string | null
          foto_entrega?: string | null
          hora_estimada_llegada?: string | null
          hora_llegada?: string | null
          hora_real_llegada?: string | null
          hora_real_salida?: string | null
          hora_salida?: string | null
          id?: string
          notas_parada?: string | null
          notas_parada_old?: string | null
          orden?: number
          reparto_id?: string
          tiempo_permanencia_minutos?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paradas_reparto_envio_id_fkey"
            columns: ["envio_id"]
            isOneToOne: false
            referencedRelation: "envios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paradas_reparto_reparto_id_fkey"
            columns: ["reparto_id"]
            isOneToOne: false
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
        ]
      }
      repartidores: {
        Row: {
          activo: boolean
          apellido: string
          created_at: string
          email: string | null
          empresa_id: string | null
          fecha_ingreso: string | null
          id: string
          licencia_conducir: string | null
          matricula: string | null
          nombre: string
          salario_base: number | null
          telefono: string | null
          updated_at: string
          user_auth_id: string
          vehiculo: string | null
        }
        Insert: {
          activo?: boolean
          apellido: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          fecha_ingreso?: string | null
          id?: string
          licencia_conducir?: string | null
          matricula?: string | null
          nombre: string
          salario_base?: number | null
          telefono?: string | null
          updated_at?: string
          user_auth_id: string
          vehiculo?: string | null
        }
        Update: {
          activo?: boolean
          apellido?: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          fecha_ingreso?: string | null
          id?: string
          licencia_conducir?: string | null
          matricula?: string | null
          nombre?: string
          salario_base?: number | null
          telefono?: string | null
          updated_at?: string
          user_auth_id?: string
          vehiculo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartidores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      repartos: {
        Row: {
          combustible_usado: number | null
          costo_total: number | null
          created_at: string
          estado: Database["public"]["Enums"]["estado_reparto"]
          fecha: string
          hora_fin: string | null
          hora_inicio: string | null
          id: string
          kilometros_recorridos: number | null
          notas: string | null
          repartidor_id: string
          updated_at: string
        }
        Insert: {
          combustible_usado?: number | null
          costo_total?: number | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_reparto"]
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          kilometros_recorridos?: number | null
          notas?: string | null
          repartidor_id: string
          updated_at?: string
        }
        Update: {
          combustible_usado?: number | null
          costo_total?: number | null
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_reparto"]
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          kilometros_recorridos?: number | null
          notas?: string | null
          repartidor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repartos_repartidor_id_fkey"
            columns: ["repartidor_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_orden_paradas_reparto: {
        Args: { p_reparto_id: string; p_paradas_actualizadas: Json }
        Returns: undefined
      }
      calculate_distance_km: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      calculate_route_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      generar_reparto_lote: {
        Args: {
          p_repartidor_id: string
          p_fecha: string
          p_empresa_id: string
          p_clientes_ids: string[]
          p_notas?: string
        }
        Returns: Json
      }
      generate_tracking_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_repartidor_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_repartidor_stats: {
        Args: { repartidor_uuid: string }
        Returns: Json
      }
      get_reparto_completo: {
        Args: { p_reparto_id: string }
        Returns: Json
      }
      get_repartos_con_detalles: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_envios_distances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      estado_envio: "pendiente" | "asignado" | "en_transito" | "entregado" | "fallido"
      estado_reparto: "pendiente" | "en_progreso" | "completado" | "cancelado"
      tipo_envio: "origen" | "entrega" | "recogida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado_envio: ["pendiente", "asignado", "en_transito", "entregado", "fallido"],
      estado_reparto: ["pendiente", "en_progreso", "completado", "cancelado"],
      tipo_envio: ["origen", "entrega", "recogida"],
    },
  },
} as const
