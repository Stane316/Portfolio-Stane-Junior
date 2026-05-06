import React, { useEffect, useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface SiteConfig {
  key: string;
  value_fr: string;
  value_en: string;
  value_generic: string;
}

const AdminContent: React.FC = () => {
  const [config, setConfig] = useState<Record<string, SiteConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState<string>('');
  const fileInputRef = useRef<Record<string, HTMLInputElement | null>>({});

  const configFields = [
    { key: 'hero_badge', label: 'Badge Hero', type: 'text' as const },
    { key: 'hero_tagline', label: 'Tagline Hero', type: 'textarea' as const },
    { key: 'growtech_url', label: 'URL GROW TECH', type: 'url' as const },
    { key: 'growtech_cta_badge', label: 'Badge CTA GROW TECH', type: 'text' as const },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' as const },
    { key: 'github', label: 'GitHub', type: 'url' as const },
    { key: 'linkedin', label: 'LinkedIn', type: 'url' as const },
    { key: 'email_contact', label: 'Email', type: 'email' as const },
    { key: 'testimonials_placeholder', label: 'Placeholder Témoignages', type: 'textarea' as const },
  ];

  const uploadFields = [
    { key: 'hero_image_url', label: '📸 Photo professionnelle (Hero)', bucket: 'portfolio-assets', folder: 'hero', accept: 'image/*', type: 'image' as const },
    { key: 'growtech_logo_url', label: '🏢 Logo GROW TECH', bucket: 'portfolio-assets', folder: 'growtech', accept: 'image/*', type: 'image' as const },
    { key: 'cv_url', label: '📄 CV (PDF)', bucket: 'portfolio-docs', folder: 'cv', accept: '.pdf', type: 'document' as const },
  ];

  const fetchConfig = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setConfig({});
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('site_config').select('*');
      if (error) throw error;
      const configMap = (data || []).reduce((acc, item) => {
        acc[item.key] = item;
        return acc;
      }, {} as Record<string, SiteConfig>);
      setConfig(configMap);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async (key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    try {
      setSaving(true);
      if (!isSupabaseConfigured()) {
        setConfig({ ...config, [key]: { ...(config[key] || { key }), [field]: value } });
        setSuccess('Sauvegardé localement');
        setTimeout(() => setSuccess(''), 3000);
        setSaving(false);
        return;
      }
      const existing = config[key];
      const { error } = await supabase.from('site_config').upsert({
        key,
        value_fr: field === 'value_fr' ? value : existing?.value_fr,
        value_en: field === 'value_en' ? value : existing?.value_en,
        value_generic: field === 'value_generic' ? value : existing?.value_generic,
      });
      if (error) throw error;
      setConfig({ ...config, [key]: { ...existing, [field]: value } });
      setSuccess('Sauvegardé !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de sauvegarde';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (key: string, file: File, bucket: string, folder: string) => {
    if (!isSupabaseConfigured()) {
      setError('Supabase non configuré');
      return;
    }
    try {
      setUploading(key);
      const extension = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      await handleSave(key, 'value_generic', data.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur upload';
      setError(message);
    } finally {
      setUploading('');
    }
  };

  const handleFileRemove = async (key: string, currentUrl: string, bucket: string) => {
    if (isSupabaseConfigured() && currentUrl) {
      try {
        const urlParts = currentUrl.split('/');
        const fileName = urlParts.slice(-2).join('/');
        await supabase.storage.from(bucket).remove([fileName]);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
    await handleSave(key, 'value_generic', '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Gestion du contenu</h2>
        {saving && <span className="text-[#00BFFF] text-sm">Sauvegarde...</span>}
      </div>

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">{success}</div>}

      {/* UPLOADS */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Téléversements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uploadFields.map(({ key, label, bucket, folder, accept, type }) => {
            const currentUrl = config[key]?.value_generic || '';
            return (
              <div key={key} className="space-y-3">
                <label className="block text-sm font-semibold text-white">{label}</label>
                {currentUrl && (
                  <div className="relative group">
                    {type === 'image' ? (
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-[rgba(0,191,255,0.15)] bg-[#141430]">
                        <img src={currentUrl} alt={label} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    ) : (
                      <div className="w-full p-4 rounded-lg border border-[rgba(0,191,255,0.15)] bg-[#141430] flex items-center gap-3">
                        <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" /></svg>
                        <div>
                          <p className="text-white text-sm">PDF Uploadé</p>
                          <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] text-xs hover:underline">Voir le document</a>
                        </div>
                      </div>
                    )}
                    <button onClick={() => handleFileRemove(key, currentUrl, bucket)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Supprimer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                {!currentUrl && (
                  <div onClick={() => fileInputRef.current[key]?.click()} className="w-full h-32 border-2 border-dashed border-[rgba(0,191,255,0.15)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#00BFFF] transition-colors bg-[#141430] bg-opacity-50">
                    <svg className="w-8 h-8 text-[#A8B4C8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-[#A8B4C8] text-sm text-center px-4">Cliquer pour {type === 'image' ? 'uploader' : 'uploader un PDF'}</p>
                    <p className="text-[#4A5568] text-xs mt-1">Max 5MB</p>
                  </div>
                )}
                <input ref={(el) => { fileInputRef.current[key] = el; }} type="file" accept={accept} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(key, file, bucket, folder); }} />
                {uploading === key && (
                  <div className="flex items-center gap-2 text-[#00BFFF] text-sm">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Upload en cours...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TEXTES */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Textes du site
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configFields.map(({ key, label, type }) => {
            const item = config[key];
            return (
              <div key={key} className="border border-[rgba(0,191,255,0.15)] rounded-lg p-4 bg-[#141430] bg-opacity-30">
                <label className="block text-sm font-semibold mb-2 text-white">{label}</label>
                {type === 'textarea' ? (
                  <textarea 
                    value={item?.value_generic || ''} 
                    onChange={(e) => handleSave(key, 'value_generic', e.target.value)} 
                    rows={3} 
                    placeholder={label}
                    title={label}
                    className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" 
                  />
                ) : (
                  <input 
                    type={type === 'url' ? 'url' : (type === 'email' ? 'email' : 'text')} 
                    value={item?.value_generic || ''} 
                    onChange={(e) => handleSave(key, 'value_generic', e.target.value)} 
                    placeholder={label}
                    title={label}
                    className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;