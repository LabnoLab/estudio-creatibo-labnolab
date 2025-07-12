import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { directory } = await request.json();

    if (!directory) {
      return NextResponse.json({ error: 'Directorio requerido' }, { status: 400 });
    }

    // Construir la ruta al directorio
    const dirPath = path.join(process.cwd(), 'public', 'uploads', directory);
    
    try {
      // Verificar que el directorio existe
      await fs.access(dirPath);
      
      // Leer contenido del directorio
      const files = await fs.readdir(dirPath);
      
      // Filtrar solo archivos de imagen y excluir metadata.json
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });
      
      return NextResponse.json({ 
        count: imageFiles.length,
        files: imageFiles 
      });
    } catch (error) {
      // Si el directorio no existe, retornar 0
      return NextResponse.json({ 
        count: 0,
        files: [] 
      });
    }
  } catch (error) {
    console.error('Error contando archivos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 