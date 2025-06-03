export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export function validateEnvironment() {
  const missing = []

  if (!config.supabase.url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!config.supabase.anonKey) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

export function getSupabaseConfig() {
  validateEnvironment()
  return config.supabase
}
