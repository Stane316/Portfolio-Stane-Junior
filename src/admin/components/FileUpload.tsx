import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * FileUpload — Universal Drag & drop for IMAGE or VIDEO
 * 
 * Supports:
 * - Images: JPG, PNG, WEBP
 * - Videos: MP4, MOV, WEBM
 * 
 * Per UNIVERSAL ADMIN MEDIA SYSTEM PROMPT
 */

interface FileUploadProps {
  label: string;
  bucket: string;
  folder: string;
  currentUrl?: string;
  onChange: (url: string, type: 'image' | 'video') => void;
  accept?: string;
  maxSizeMB?: number;
  currentType?: 'image' | 'video';
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  bucket, 
  folder, 
  currentUrl, 
  onChange, 
  accept = 'image/*,video/*',
  maxSizeMB = 50,
  currentType = 'image'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectType = (file: File): 'image' | 'video' => {
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  };

  const handleUpload = async (file: File) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase non configuré');
      return;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
      return;
    }

    const fileType = detectType(file);
    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl, fileType);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const removeMedia = () => {
    onChange('', currentType);
  };

  const isVideo = currentUrl && (currentType === 'video' || currentUrl.match(/\.(mp4|mov|webm)$/i));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">{label}</label>

      {currentUrl && (
        <div className="relative group w-full rounded-2xl overflow-hidden border border-[#1A1A2E] bg-[#0A0A1E]">
          {isVideo ? (
            <video 
              src={currentUrl} 
              controls 
              className="w-full max-h-[320px] object-contain bg-black" 
            />
          ) : (
            <img 
              src={currentUrl} 
              alt="Preview" 
              className="w-full max-h-[320px] object-contain" 
            />
          )}
          
          <button
            onClick={removeMedia}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
            type="button"
            aria-label="Supprimer le média"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[10px] text-white rounded">
            {isVideo ? 'VIDEO' : 'IMAGE'}
          </div>
        </div>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-[#00BFFF] bg-[#00BFFF]/10 scale-[1.01]' 
            : 'border-[#1A1A2E] hover:border-[#00BFFF] bg-[#141430]/40'
        } ${currentUrl ? 'mt-3' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#A8B4C8]">Upload en cours...</span>
          </div>
        ) : (
          <div className="text-center pointer-events-none">
            <svg className="w-9 h-9 mx-auto mb-3 text-[#4A5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 16a4 4 0 01-.88-7.903 5 5 0 0110.76 1.03A4.5 4.5 0 0118 16M9 19l3-3m0 0l3 3m-3-3v12" />
            </svg>
            <p className="text-sm text-[#A8B4C8]">
              Glisser une image ou une vidéo ici ou <span className="text-[#00BFFF] underline">parcourir</span>
            </p>
            <p className="text-xs text-[#4A5568] mt-1">
              JPG, PNG, WEBP, MP4, MOV, WEBM • Max {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default FileUpload;