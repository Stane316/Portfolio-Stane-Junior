import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * FileUpload — Drag & drop file upload to Supabase Storage
 *
 * P-13 FIX: Replaced 📁 emoji with SVG icon
 */

interface FileUploadProps {
  label: string;
  bucket: string;
  folder: string;
  currentUrl?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  bucket, 
  folder, 
  currentUrl, 
  onChange, 
  accept = 'image/*',
  maxSizeMB = 5
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase non configuré');
      return;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
      return;
    }

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

      onChange(publicUrl);
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">{label}</label>
      
      {/* Preview actuelle */}
      {currentUrl && (
        <div className="relative group w-full h-40 rounded-lg overflow-hidden border border-[#141430] bg-[#0A0A1E]">
          <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            type="button"
            aria-label="Supprimer l'image"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Zone de Drop */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          isDragging 
            ? 'border-[#00BFFF] bg-[#00BFFF] bg-opacity-10 scale-[1.02]' 
            : 'border-[#141430] hover:border-[#00BFFF] bg-[#141430] bg-opacity-30'
        } ${currentUrl ? 'mt-3' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          disabled={uploading}
          title={label}
          aria-label={label}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#A8B4C8]">Upload en cours...</span>
          </div>
        ) : (
          <div className="text-center pointer-events-none">
            {/* P-13 FIX: SVG icon replacing 📁 emoji */}
            <svg className="w-8 h-8 mx-auto mb-2 text-[#4A5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-sm text-[#A8B4C8]">
              Glisser une image ici ou <span className="text-[#00BFFF] underline">parcourir</span>
            </p>
            <p className="text-xs text-[#4A5568] mt-1">PNG, JPG, WebP (Max {maxSizeMB}MB)</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default FileUpload;
