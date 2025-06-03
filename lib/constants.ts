// Constantes de la aplicación
export const APP_CONFIG = {
  name: "Rumbo Envíos",
  description: "Sistema de Gestión de Repartos",
  version: "1.0.0",
} as const

// Configuración de Supabase
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const

// Estados de la aplicación
export const ESTADOS_REPARTO = {
  PENDIENTE: "pendiente",
  EN_PROGRESO: "en_progreso",
  COMPLETADO: "completado",
  CANCELADO: "cancelado",
} as const

export const ESTADOS_ENVIO = {
  PENDIENTE: "pendiente",
  ASIGNADO: "asignado",
  EN_PROGRESO: "en_progreso",
  COMPLETADO: "completado",
  FALLIDO: "fallido",
  CANCELADO: "cancelado",
} as const

export const TIPOS_ENVIO = {
  ENTREGA: "entrega",
  RECOGIDA: "recogida",
} as const

// Validación de configuración
export function validateConfig() {
  if (!SUPABASE_CONFIG.url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
  }

  if (!SUPABASE_CONFIG.anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
  }

  return true
}
