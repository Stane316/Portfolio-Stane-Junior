import React, { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploaderProps {
  label: string;
  currentUrl?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  bucket?: string;
  folder?: string;
  maxSize?: number;
  accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentUrl = '',
  onChange,
  onRemove,
  bucket = 'portfolio-assets',
  folder = 'general',
  maxSize = 5,
  accept = 'image/*',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = () => {
    onChange(urlInput);
  };

  const handleFileUpload = async (file: File) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase non configuré');
      return;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${maxSize}MB)`);
      return;
    }
    try {
      setUploading(true);
      setError('');
      const extension = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange(data.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur upload';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-white">{label}</label>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            activeTab === 'url'
              ? 'bg-[#00BFFF] text-black font-semibold'
              : 'text-[#A8B4C8] hover:text-white bg-[#141430]'
          }`}
        >
          <svg className="w-3 h-3 inline -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            activeTab === 'upload'
              ? 'bg-[#00BFFF] text-black font-semibold'
              : 'text-[#A8B4C8] hover:text-white bg-[#141430]'
          }`}
        >
          <svg className="w-3 h-3 inline -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Télécharger
        </button>
      </div>

      {/* Preview */}
      {currentUrl && (
        <div className="relative group">
          <div className="w-full h-32 rounded-lg overflow-hidden border border-[rgba(0,191,255,0.15)] bg-[#141430]">
            <img src={currentUrl} alt={label} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <button
            type="button"
            onClick={() => { onRemove(); setUrlInput(''); }}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* URL Input */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]"
          />
          <button
            type="button"
            onClick={handleUrlChange}
            className="px-4 py-2 bg-[#00BFFF] text-black rounded-lg text-sm font-semibold hover:bg-opacity-80 transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {/* Upload Input */}
      {activeTab === 'upload' && (
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-[rgba(0,191,255,0.15)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00BFFF] transition-colors bg-[#141430] bg-opacity-50"
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-[#00BFFF]">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <span className="text-sm">Upload...</span>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-[#A8B4C8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-[#A8B4C8] text-sm">Cliquer pour uploader</p>
                <p className="text-[#4A5568] text-xs mt-1">Max {maxSize}MB</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} aria-label="File upload input" />
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
};

export default ImageUploader;