'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, X, Edit2, Copy, Check, Tag, Calendar, FileText, Search, Plus, Trash2, Sparkles, Heart, Eye, Download, Share2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageMetadata {
  filename: string;
  name: string;
  prompt: string;
  tags: string[];
  uploadDate: string;
  size: number;
}

interface UploadModalData {
  name: string;
  prompt: string;
  tags: string;
}

// Función utilitaria para formatear tamaño de archivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function Referencias() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [editingMetadata, setEditingMetadata] = useState<ImageMetadata | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalData, setUploadModalData] = useState<UploadModalData>({
    name: '',
    prompt: '',
    tags: ''
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null);
  const [promptError, setPromptError] = useState<string | null>(null);

  // Cargar imágenes al iniciar
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/referencias');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar imágenes por búsqueda
  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setPendingFile(imageFile);
      setUploadModalData({
        name: imageFile.name.replace(/\.[^/.]+$/, ""),
        prompt: '',
        tags: ''
      });
      setUploadModalOpen(true);
    }
  }, []);

  // Upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setUploadModalData({
        name: file.name.replace(/\.[^/.]+$/, ""),
        prompt: '',
        tags: ''
      });
      setUploadModalOpen(true);
    }
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', pendingFile);
    formData.append('name', uploadModalData.name);
    formData.append('prompt', uploadModalData.prompt);
    formData.append('tags', uploadModalData.tags);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        await loadImages();
        setUploadModalOpen(false);
        setPendingFile(null);
        setUploadModalData({ name: '', prompt: '', tags: '' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  // Metadata handlers
  const handleSaveMetadata = async (metadata: ImageMetadata) => {
    try {
      const response = await fetch('/api/referencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: metadata.filename,
          name: metadata.name,
          prompt: metadata.prompt,
          tags: metadata.tags
        })
      });
      
      if (response.ok) {
        await loadImages();
        setEditingMetadata(null);
        
        // Actualizar imagen seleccionada si es la misma
        if (selectedImage?.filename === metadata.filename) {
          setSelectedImage(metadata);
        }
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para mejorar prompts con OpenAI
  const handleImprovePrompt = async (currentPrompt: string, metadata: ImageMetadata) => {
    if (!currentPrompt.trim()) {
      setPromptError('El prompt no puede estar vacío');
      return;
    }

    setImprovingPrompt(true);
    setPromptError(null);
    setImprovedPrompt(null);

    try {
      const response = await fetch('/api/mejorar-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          imageContext: metadata.name,
          tags: metadata.tags
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al mejorar el prompt');
      }

      const data = await response.json();
      setImprovedPrompt(data.improvedPrompt);
    } catch (error) {
      console.error('Error improving prompt:', error);
      setPromptError(error instanceof Error ? error.message : 'Error al mejorar el prompt');
    } finally {
      setImprovingPrompt(false);
    }
  };

  // Función para aplicar el prompt mejorado
  const handleApplyImprovedPrompt = async (metadata: ImageMetadata) => {
    if (!improvedPrompt) return;

    const updatedMetadata = { ...metadata, prompt: improvedPrompt };
    await handleSaveMetadata(updatedMetadata);
    setImprovedPrompt(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando tu galería creativa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header Galería Moderna */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎨 Estudio Creativo
              </h1>
              <p className="text-orange-600 font-medium">
                Tu galería de referencias visuales e inspiración
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar inspiración..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer font-medium"
              >
                <Plus className="h-5 w-5 mr-2" />
                Subir Imagen
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Galería Masonry */}
      <div className="p-8">
        <div
          className={`transition-all duration-300 ${
            dragOver ? 'bg-orange-100 border-orange-400' : 'bg-white/40 border-orange-200'
          } border-2 border-dashed rounded-3xl p-8 backdrop-blur-sm`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {images.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="h-12 w-12 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tu galería está esperando
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Arrastra imágenes aquí o haz clic en "Subir Imagen" para comenzar a construir tu colección de referencias visuales
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  JPEG, PNG, WebP
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Máx. 10MB
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  IA incluida
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.filename}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02] transform">
                    <div className="relative">
                      <img
                        src={`/uploads/referencias/${image.filename}`}
                        alt={image.name}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {formatFileSize(image.size)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                        {image.name}
                      </h3>
                      {image.prompt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {image.prompt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{image.tags.length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(image.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  ✨ Agregar a tu galería
                </h3>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {pendingFile && (
                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(pendingFile)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la imagen
                  </label>
                  <input
                    type="text"
                    value={uploadModalData.name}
                    onChange={(e) =>
                      setUploadModalData({ ...uploadModalData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nombre descriptivo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prompt creativo
                  </label>
                  <textarea
                    value={uploadModalData.prompt}
                    onChange={(e) =>
                      setUploadModalData({ ...uploadModalData, prompt: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe cómo usar esta imagen..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={uploadModalData.tags}
                    onChange={(e) =>
                      setUploadModalData({ ...uploadModalData, tags: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="diseño, retrato, digital, minimalista..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg"
                >
                  {uploading ? 'Subiendo...' : 'Agregar a Galería'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl max-h-[90vh] overflow-hidden flex shadow-2xl"
            >
              {/* Image Panel */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-8">
                <img
                  src={`/uploads/referencias/${selectedImage.filename}`}
                  alt={selectedImage.name}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Metadata Panel */}
              <div className="w-96 bg-white p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Detalles de la imagen
                  </h3>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {editingMetadata?.filename === selectedImage.filename ? (
                  <EditMetadataForm
                    metadata={editingMetadata}
                    onChange={setEditingMetadata}
                    onSave={handleSaveMetadata}
                    onCancel={() => setEditingMetadata(null)}
                    onImprovePrompt={handleImprovePrompt}
                    improvingPrompt={improvingPrompt}
                    improvedPrompt={improvedPrompt}
                    promptError={promptError}
                    onApplyImprovedPrompt={(metadata) => {
                      setEditingMetadata(metadata);
                      setImprovedPrompt(null);
                    }}
                    onDiscardImprovedPrompt={() => setImprovedPrompt(null)}
                  />
                ) : (
                  <ViewMetadata
                    metadata={selectedImage}
                    onEdit={() => setEditingMetadata({ ...selectedImage })}
                    onCopyPrompt={handleCopyPrompt}
                    copiedPrompt={copiedPrompt}
                    onImprovePrompt={handleImprovePrompt}
                    improvingPrompt={improvingPrompt}
                    improvedPrompt={improvedPrompt}
                    promptError={promptError}
                    onApplyImprovedPrompt={handleApplyImprovedPrompt}
                    onDiscardImprovedPrompt={() => setImprovedPrompt(null)}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente para ver metadatos
function ViewMetadata({
  metadata,
  onEdit,
  onCopyPrompt,
  copiedPrompt,
  onImprovePrompt,
  improvingPrompt,
  improvedPrompt,
  promptError,
  onApplyImprovedPrompt,
  onDiscardImprovedPrompt
}: {
  metadata: ImageMetadata;
  onEdit: () => void;
  onCopyPrompt: (prompt: string) => void;
  copiedPrompt: string | null;
  onImprovePrompt: (currentPrompt: string, metadata: ImageMetadata) => void;
  improvingPrompt: boolean;
  improvedPrompt: string | null;
  promptError: string | null;
  onApplyImprovedPrompt: (metadata: ImageMetadata) => void;
  onDiscardImprovedPrompt: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900">{metadata.name}</h4>
        <button
          onClick={onEdit}
          className="p-2 text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-orange-500" />
          {new Date(metadata.uploadDate).toLocaleDateString('es-ES')}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-2 text-orange-500" />
          {formatFileSize(metadata.size)}
        </div>

        {metadata.tags.length > 0 && (
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Tag className="h-4 w-4 mr-2 text-orange-500" />
              Tags
            </div>
            <div className="flex flex-wrap gap-1">
              {metadata.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sección de Prompts */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-bold text-gray-900">✨ Prompt Creativo</h5>
            <div className="flex items-center space-x-2">
              {metadata.prompt && (
                <button
                  onClick={() => onCopyPrompt(metadata.prompt)}
                  className="text-orange-500 hover:text-orange-600 p-1 rounded transition-colors"
                  title="Copiar prompt"
                >
                  {copiedPrompt === metadata.prompt ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              )}
              {metadata.prompt && (
                <button
                  onClick={() => onImprovePrompt(metadata.prompt, metadata)}
                  disabled={improvingPrompt}
                  className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  title="Mejorar prompt con IA"
                >
                  {improvingPrompt ? (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                      <span>Mejorando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Mejorar con IA</span>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {metadata.prompt ? (
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-600 font-medium">Prompt actual:</span>
                <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border mt-1">
                  {metadata.prompt}
                </p>
              </div>
              
              {/* Prompt mejorado */}
              {improvedPrompt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-green-800 font-medium">🤖 Prompt mejorado por IA:</span>
                    <button
                      onClick={() => onCopyPrompt(improvedPrompt)}
                      className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                      title="Copiar prompt mejorado"
                    >
                      {copiedPrompt === improvedPrompt ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-green-900 bg-white p-3 rounded-lg border mb-3">
                    {improvedPrompt}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApplyImprovedPrompt(metadata)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors font-medium"
                    >
                      Aplicar y Guardar
                    </button>
                    <button
                      onClick={onDiscardImprovedPrompt}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-full hover:bg-gray-400 transition-colors font-medium"
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              )}
              
              {/* Error de prompt */}
              {promptError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-xs text-red-800 font-medium">Error:</span>
                  <p className="text-sm text-red-700 mt-1">{promptError}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-2">No hay prompt asociado</p>
              <button
                onClick={onEdit}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Agregar prompt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para editar metadatos
function EditMetadataForm({
  metadata,
  onChange,
  onSave,
  onCancel,
  onImprovePrompt,
  improvingPrompt,
  improvedPrompt,
  promptError,
  onApplyImprovedPrompt,
  onDiscardImprovedPrompt
}: {
  metadata: ImageMetadata;
  onChange: (metadata: ImageMetadata) => void;
  onSave: (metadata: ImageMetadata) => void;
  onCancel: () => void;
  onImprovePrompt: (currentPrompt: string, metadata: ImageMetadata) => void;
  improvingPrompt: boolean;
  improvedPrompt: string | null;
  promptError: string | null;
  onApplyImprovedPrompt: (metadata: ImageMetadata) => void;
  onDiscardImprovedPrompt: () => void;
}) {
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    onChange({ ...metadata, tags });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre
        </label>
        <input
          type="text"
          value={metadata.name}
          onChange={(e) => onChange({ ...metadata, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Prompt
          </label>
          {metadata.prompt && (
            <button
              onClick={() => onImprovePrompt(metadata.prompt, metadata)}
              disabled={improvingPrompt}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              title="Mejorar prompt con IA"
            >
              {improvingPrompt ? (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                  <span>Mejorando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Mejorar con IA</span>
                </div>
              )}
            </button>
          )}
        </div>
        <textarea
          value={metadata.prompt}
          onChange={(e) => onChange({ ...metadata, prompt: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Describe el uso creativo de esta imagen..."
        />
        
        {/* Prompt mejorado */}
        {improvedPrompt && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-green-800 font-medium">🤖 Prompt mejorado por IA:</span>
            </div>
            <p className="text-sm text-green-900 bg-white p-3 rounded-lg border mb-3">
              {improvedPrompt}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => onApplyImprovedPrompt({ ...metadata, prompt: improvedPrompt })}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                Aplicar
              </button>
              <button
                onClick={onDiscardImprovedPrompt}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-full hover:bg-gray-400 transition-colors font-medium"
              >
                Descartar
              </button>
            </div>
          </div>
        )}
        
        {/* Error de prompt */}
        {promptError && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <span className="text-xs text-red-800 font-medium">Error:</span>
            <p className="text-sm text-red-700 mt-1">{promptError}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tags (separados por comas)
        </label>
        <input
          type="text"
          value={metadata.tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={() => onSave(metadata)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-lg"
        >
          Guardar
        </button>
      </div>
    </div>
  );
} 