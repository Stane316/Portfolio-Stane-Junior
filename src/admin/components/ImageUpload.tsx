/**
 * ImageUpload Component
 * 
 * Composant réutilisable pour l'upload d'images et fichiers.
 * Supporte: images (JPG, PNG, SVG, WebP) et documents (PDF)
 * 
 * @see /src/lib/supabase.ts
 */

import React, { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploadProps {
  label: string;
  bucket: 'portfolio-assets' | 'portfolio-docs';
  folder?: string;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // en MB
  type?: 'image' | 'document';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  bucket,
  folder = '',
  currentUrl,
  onUpload,
  onRemove,
  accept = 'image/*',
  maxSize = 5,
  type = 'image',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFileName = (file: File): string => {
    const extension = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const folderPath = folder ? `${folder}/` : '';
    return `${folderPath}${timestamp}-${random}.${extension}`;
  };

  const handleUpload = async (file: File) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase non configuré');
      return;
    }

    // Validation taille
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${maxSize}MB)`);
      return;
    }

    // Validation type
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Format d\'image non supporté');
      return;
    }

    if (type === 'document' && file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const fileName = generateFileName(file);
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onUpload(publicUrl);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = async () => {
    if (currentUrl && isSupabaseConfigured()) {
      try {
        // Extraire le nom du fichier de l'URL
        const urlParts = currentUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from(bucket)
          .remove([folder ? `${folder}/${fileName}` : fileName]);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white">{label}</label>
      
      {/* Zone de preview */}
      {preview && (
        <div className="relative group">
          {type === 'image' ? (
            <div className="w-full max-w-xs h-40 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]">
              <img
                src={preview}
                alt={label}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full max-w-xs p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
              <div>
                <p className="text-white text-sm">PDF Uploadé</p>
                <a href={preview} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-cyan)] text-xs hover:underline">
                  Voir le document
                </a>
              </div>
            </div>
          )}
          
          {/* Bouton supprimer */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Zone d'upload */}
      {!preview && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-xs h-32 border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-cyan)] transition-colors bg-[var(--bg-card)] bg-opacity-50"
        >
          <svg className="w-8 h-8 text-[var(--text-secondary)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[var(--text-secondary)] text-sm text-center px-4">
            Cliquer pour {type === 'image' ? 'uploader une image' : 'uploader un PDF'}
          </p>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            Max {maxSize}MB • {type === 'image' ? 'JPG, PNG, SVG, WebP' : 'PDF'}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Message d'erreur */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Loading */}
      {uploading && (
        <div className="flex items-center gap-2 text-[var(--accent-cyan)] text-sm">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Upload en cours...
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
