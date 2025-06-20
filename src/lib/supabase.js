import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug de configuración
console.log('Supabase Configuration Debug:')
console.log('URL presente:', !!supabaseUrl, supabaseUrl ? 'Set' : 'Not set')
console.log('Key presente:', !!supabaseKey, supabaseKey ? 'Set' : 'Not set')

// Solo crear cliente si las variables de entorno están configuradas
let supabaseClient = null
try {
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey)
    console.log('Cliente Supabase creado exitosamente')
  } else {
    console.log('No se puede crear cliente Supabase - faltan variables de entorno')
  }
} catch (error) {
  console.error('Error creando cliente Supabase:', error.message, error)
}

export const supabase = supabaseClient
export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseClient)

console.log('isSupabaseConfigured:', isSupabaseConfigured) 