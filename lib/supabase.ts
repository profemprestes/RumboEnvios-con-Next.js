import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"
import { getSupabaseConfig } from "./config"

const { url, anonKey } = getSupabaseConfig()

export const supabase = createClient<Database>(url!, anonKey!)
