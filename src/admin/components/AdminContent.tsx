import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import ImageUploader from '../ui/ImageUploader';
import FileUpload from './FileUpload';

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

  const fetchConfig = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) { setConfig({}); setLoading(false); return; }
      const { data, error } = await supabase.from('site_config').select('*');
      if (error) throw error;
      const configMap = (data || []).reduce((acc, item) => { acc[item.key] = item; return acc; }, {} as Record<string, SiteConfig>);
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

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Gestion du contenu</h2>
        {saving && <span className="text-[#00BFFF] text-sm">Sauvegarde...</span>}
      </div>

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">{success}</div>}

      {/* HERO IMAGE UPLOAD */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Photo Hero (Section À propos)
        </h3>
        <p className="text-[#A8B4C8] text-sm mb-4">Remplace les initiales SJ par votre photo professionnelle</p>
        <ImageUploader 
          label="Photo professionnelle" 
          currentUrl={config['hero_image_url']?.value_generic || ''} 
          onChange={(url) => handleSave('hero_image_url', 'value_generic', url)} 
          onRemove={() => handleSave('hero_image_url', 'value_generic', '')} 
          folder="hero"
          maxSize={5}
        />

        {/* Photo About (Section À propos) */}
        <FileUpload 
          label="👤 Photo À propos (Section About)"
          bucket="portfolio-assets"
          folder="about"
          currentUrl={config['about_image_url']?.value_generic || ''}
          onChange={(url) => handleSave('about_image_url', 'value_generic', url)}
          maxSizeMB={5}
        />

        {/* CV PDF */}
        <FileUpload 
          label="CV (PDF)"
          bucket="portfolio-assets"
          folder="cv"
          currentUrl={config['cv_url']?.value_generic || ''}
          onChange={(url) => handleSave('cv_url', 'value_generic', url)}
          accept=".pdf"
          maxSizeMB={10}
        />
      </div>

      {/* TEXTES */}
      <div className="glass-card border border-[rgba(0,191,255,0.15)]">
        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Textes du site
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configFields.map(({ key, label, type }) => {
            const item = config[key];
            return (
              <div key={key} className="border border-[rgba(0,191,255,0.15)] rounded-lg p-4 bg-[#141430] bg-opacity-30">
                <label htmlFor={key} className="block text-sm font-semibold mb-2 text-white">{label}</label>
                {type === 'textarea' ? (
                  <textarea id={key} placeholder={label} value={item?.value_generic || ''} onChange={(e) => handleSave(key, 'value_generic', e.target.value)} rows={3} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                ) : (
                  <input id={key} placeholder={label} type={type === 'url' ? 'url' : (type === 'email' ? 'email' : 'text')} value={item?.value_generic || ''} onChange={(e) => handleSave(key, 'value_generic', e.target.value)} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
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