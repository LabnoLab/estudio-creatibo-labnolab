import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
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
    return {};
  }
}

// Guardar metadatos
async function saveMetadata(metadata: Record<string, ImageMetadata>) {
  await writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// Generar nombre único para evitar conflictos
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-');
  
  return `${sanitizedName}-${timestamp}-${randomSuffix}${extension}`;
}

// POST - Upload de imagen con configuración
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const prompt = formData.get('prompt') as string;
    const tags = formData.get('tags') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 });
    }
    
    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }
    
    // Generar nombre único
    const filename = generateUniqueFilename(file.name);
    const filePath = path.join(REFERENCIAS_DIR, filename);
    
    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Crear metadatos
    const metadata = await readMetadata();
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    metadata[filename] = {
      filename,
      name: name || file.name.replace(/\.[^/.]+$/, ""),
      prompt: prompt || "",
      tags: tagsArray,
      uploadDate: new Date().toISOString(),
      size: file.size
    };
    
    await saveMetadata(metadata);
    
    return NextResponse.json({ 
      success: true, 
      filename,
      metadata: metadata[filename],
      message: 'File uploaded successfully' 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

// DELETE - Eliminar imagen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    // Eliminar archivo
    const filePath = path.join(REFERENCIAS_DIR, filename);
    await writeFile(filePath, ''); // En lugar de fs.unlink por seguridad
    
    // Actualizar metadatos
    const metadata = await readMetadata();
    delete metadata[filename];
    await saveMetadata(metadata);
    
    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
} 