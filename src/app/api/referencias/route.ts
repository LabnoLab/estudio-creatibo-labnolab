import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile, writeFile, stat } from 'fs/promises';
import path from 'path';

const REFERENCIAS_DIR = path.join(process.cwd(), 'public', 'uploads', 'referencias');
const METADATA_FILE = path.join(REFERENCIAS_DIR, 'metadata.json');

interface ImageMetadata {
  filename: string;
  name: string;
  prompt: string;
  tags: string[];
  uploadDate: string;
  size: number;
}

// Leer metadatos existentes
async function readMetadata(): Promise<Record<string, ImageMetadata>> {
  try {
    const data = await readFile(METADATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si no existe el archivo, devolver objeto vacío
    return {};
  }
}

// Guardar metadatos
async function saveMetadata(metadata: Record<string, ImageMetadata>) {
  await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// GET - Obtener lista de imágenes con metadatos
export async function GET() {
  try {
    const files = await readdir(REFERENCIAS_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file) && file !== 'metadata.json'
    );
    
    const metadata = await readMetadata();
    const images: ImageMetadata[] = [];
    
    for (const file of imageFiles) {
      const filePath = path.join(REFERENCIAS_DIR, file);
      const stats = await stat(filePath);
      
      if (metadata[file]) {
        images.push({
          ...metadata[file],
          filename: file,
          size: stats.size
        });
      } else {
        // Crear metadata básico si no existe
        const basicMetadata: ImageMetadata = {
          filename: file,
          name: file.replace(/\.[^/.]+$/, ""), // Nombre sin extensión
          prompt: "",
          tags: [],
          uploadDate: stats.birthtime.toISOString(),
          size: stats.size
        };
        images.push(basicMetadata);
      }
    }
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading referencias:', error);
    return NextResponse.json({ error: 'Error reading referencias' }, { status: 500 });
  }
}

// POST - Actualizar metadatos de una imagen
export async function POST(request: NextRequest) {
  try {
    const { filename, name, prompt, tags } = await request.json();
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    const metadata = await readMetadata();
    
    // Verificar que la imagen existe
    const filePath = path.join(REFERENCIAS_DIR, filename);
    const stats = await stat(filePath);
    
    metadata[filename] = {
      filename,
      name: name || filename.replace(/\.[^/.]+$/, ""),
      prompt: prompt || "",
      tags: tags || [],
      uploadDate: metadata[filename]?.uploadDate || stats.birthtime.toISOString(),
      size: stats.size
    };
    
    await saveMetadata(metadata);
    
    return NextResponse.json({ 
      success: true, 
      metadata: metadata[filename] 
    });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return NextResponse.json({ error: 'Error updating metadata' }, { status: 500 });
  }
} 