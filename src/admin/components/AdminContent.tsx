import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import FileUpload from './FileUpload';

/**
 * AdminContent — UNIVERSAL MEDIA MANAGEMENT
 * 
 * Fully dynamic image + video management for all key zones.
 * 
 * Supported sections:
 * - Hero (image OR video)
 * - About (image)
 * - Vision (image)
 * 
 * Per UNIVERSAL ADMIN UPLOAD MEDIA SYSTEM PROMPT
 * + CREATIVE DIRECTION (flexible media)
 */

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
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'vision' | 'projects'>('hero');

  const { isBlocked, proceed, cancel } = useUnsavedChanges();

  const fetchConfig = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) { setConfig({}); setLoading(false); return; }
      const { data } = await supabase.from('site_config').select('*');
      const map = (data || []).reduce((acc: any, item: any) => { acc[item.key] = item; return acc; }, {});
      setConfig(map);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = useCallback((key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    setConfig(prev => ({ ...prev, [key]: { ...(prev[key] || { key }), [field]: value } as SiteConfig }));

    setTimeout(async () => {
      try {
        setSaving(true);
        if (!isSupabaseConfigured()) return;
        const ex = config[key] || {} as any;
        await supabase.from('site_config').upsert({
          key,
          value_fr: field === 'value_fr' ? value : ex.value_fr || '',
          value_en: field === 'value_en' ? value : ex.value_en || '',
          value_generic: field === 'value_generic' ? value : ex.value_generic || '',
        });
        setSuccess('Sauvegardé !');
        setTimeout(() => setSuccess(''), 1800);
      } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    }, 600);
  }, [config]);

  // Universal media change handler (supports image + video)
  const handleMediaChange = (key: string, url: string, type?: 'image' | 'video') => {
    // We store the URL in value_generic (the main field used on the site)
    handleSave(key, 'value_generic', url);

    // Optional: we can store type if we want later (e.g. hero_media_type)
    if (type && key === 'hero_image_url') {
      // For hero we also support a dedicated video key
      // If user uploads video to hero, we can guide them to use hero_video_url
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#00BFFF] animate-spin rounded-full" /></div>;

  const tabs = [
    { id: 'hero' as const, label: 'Hero' },
    { id: 'about' as const, label: 'À propos' },
    { id: 'vision' as const, label: 'Vision' },
    { id: 'projects' as const, label: 'Projets' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Gestion des médias</h2>
          <p className="text-sm text-[#A8B4C8] mt-1">Image ou vidéo selon les zones • Mise à jour en direct</p>
        </div>
        {saving && <span className="text-[#00BFFF] text-sm">Sauvegarde...</span>}
      </div>

      {isBlocked && <div className="p-4 bg-yellow-500/20 rounded">Modifications non sauvegardées</div>}
      {error && <div className="p-3 bg-red-500/20 text-red-400 rounded">{error}</div>}
      {success && <div className="p-3 bg-green-500/20 text-green-400 rounded">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1A1A2E] pb-1 flex-wrap">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)} 
            className={`px-6 py-2 rounded-t text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#141430] text-white border-b-2 border-[#00BFFF]' : 'text-[#A8B4C8] hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* HERO — Image OR Video */}
      {activeTab === 'hero' && (
        <div className="glass-card p-8 space-y-8">
          <div>
            <h3 className="font-bold text-xl mb-1">Hero Section</h3>
            <p className="text-sm text-[#A8B4C8]">Image ou vidéo cinématique. La vidéo est prioritaire si elle existe.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload
              label="Média Hero (Image ou Vidéo)"
              bucket="media"
              folder="hero"
              currentUrl={config['hero_image_url']?.value_generic}
              onChange={(url) => handleMediaChange('hero_image_url', url)}
              accept="image/*,video/*"
              maxSizeMB={60}
              currentType={config['hero_image_url']?.value_generic?.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'}
            />

            <div>
              <label className="block text-sm font-semibold text-white mb-2">URL Vidéo Hero (optionnel)</label>
              <input 
                type="text" 
                placeholder="https://... .mp4 ou lien Supabase"
                value={config['hero_video_url']?.value_generic || ''} 
                onChange={e => handleSave('hero_video_url', 'value_generic', e.target.value)} 
                className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded-xl p-4 text-sm" 
              />
              <p className="text-xs text-[#A8B4C8] mt-2">Si une vidéo est fournie ici, elle sera utilisée à la place de l'image.</p>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT */}
      {activeTab === 'about' && (
        <div className="glass-card p-8">
          <h3 className="font-bold text-xl mb-6">Photo À propos</h3>
          <FileUpload
            label="Photo À propos"
            bucket="media"
            folder="about"
            currentUrl={config['about_image_url']?.value_generic}
            onChange={(url) => handleMediaChange('about_image_url', url)}
            accept="image/*"
            maxSizeMB={15}
          />
        </div>
      )}

      {/* VISION */}
      {activeTab === 'vision' && (
        <div className="glass-card p-8">
          <h3 className="font-bold text-xl mb-6">Média Vision</h3>
          <FileUpload
            label="Image / Vidéo Vision"
            bucket="media"
            folder="vision"
            currentUrl={config['vision_image_url']?.value_generic}
            onChange={(url) => handleMediaChange('vision_image_url', url)}
            accept="image/*,video/*"
            maxSizeMB={40}
          />
        </div>
      )}

      {/* PROJECTS */}
      {activeTab === 'projects' && (
        <div className="glass-card p-8">
          <h3 className="font-bold text-xl mb-6">Médias Projets (exemple)</h3>
          <p className="text-sm text-[#A8B4C8] mb-6">Les médias des projets individuels sont gérés dans l'onglet <strong>Projets</strong>. Ici vous pouvez définir un fallback global.</p>
          
          <FileUpload
            label="Image de fallback Projets"
            bucket="media"
            folder="projects"
            currentUrl={config['projects_fallback_image']?.value_generic}
            onChange={(url) => handleMediaChange('projects_fallback_image', url)}
            accept="image/*"
            maxSizeMB={12}
          />
        </div>
      )}
    </div>
  );
};

export default AdminContent;
