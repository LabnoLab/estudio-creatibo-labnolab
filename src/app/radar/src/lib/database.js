import { supabase, isSupabaseConfigured } from './supabase'

export async function saveAnalysis(title, sourceUrl, analysisData) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase no configurado. Saltando guardado del análisis.')
    return { success: false, error: 'Supabase no configurado' }
  }

  // Log datos antes de enviar
  const dataToSave = {
    title,
    source_url: sourceUrl,
    analysis_data: analysisData
  }
  console.log('Datos a guardar:', dataToSave)
  console.log('Title type:', typeof title, 'Title value:', title)
  console.log('Source URL type:', typeof sourceUrl, 'Source URL value:', sourceUrl)
  console.log('Analysis data type:', typeof analysisData, 'Analysis data keys:', Object.keys(analysisData || {}))

  try {
    const { data, error } = await supabase
      .from('trend_analyses')
      .insert([dataToSave])
      .select()

    if (error) {
      console.error('Error detallado de Supabase:', error.message, error)
      throw error
    }
    console.log('Guardado exitoso:', data)
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error detallado saving analysis:', error.message, error)
    return { success: false, error: error.message || 'Error desconocido al guardar' }
  }
}

export async function getAnalysisHistory() {
  if (!isSupabaseConfigured) {
    console.log('Supabase no configurado, retornando historial vacío')
    return { success: true, data: [] }
  }

  console.log('Cargando historial de análisis...')
  try {
    const { data, error } = await supabase
      .from('trend_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error detallado fetching analysis history:', error.message, error)
      throw error
    }
    console.log('Historial cargado exitosamente:', data?.length || 0, 'items')
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error detallado fetching analysis history:', error.message, error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getAnalysisById(id) {
  if (!isSupabaseConfigured) {
    console.log('Supabase no configurado, no se puede cargar análisis por ID')
    return { success: false, error: 'Supabase no configurado' }
  }

  console.log('Cargando análisis por ID:', id)
  try {
    const { data, error } = await supabase
      .from('trend_analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error detallado fetching analysis by ID:', error.message, error)
      throw error
    }
    console.log('Análisis cargado exitosamente:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('Error detallado fetching analysis:', error.message, error)
    return { success: false, error: error.message }
  }
} 