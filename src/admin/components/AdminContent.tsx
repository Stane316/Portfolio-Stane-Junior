import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import FileUpload from './FileUpload';
import { getMediaForKey } from '../../hooks/useSupabaseData';

/**
 * AdminContent — UNIVERSAL MEDIA SYSTEM (Phase 2)
 * 
 * Fully dynamic image + video management for all key zones.
 * Uses both site_config AND media_items table.
 * 
 * Supported sections:
 * - Hero (image OR video)
 * - About (image)
 * - Vision (image OR video)
 * - Projects (fallback + per-project future)
 * 
 * Per UNIVERSAL ADMIN UPLOAD MEDIA SYSTEM PROMPT
 */

interface SiteConfig {
  key: string;
  value_fr: string;
  value_en: string;
  value_generic: string;
}

interface MediaItem {
  id?: string;
  key: string;
  type: 'image' | 'video';
  url: string | null;
  section: string;
}

const AdminContent: React.FC = () => {
  const [config, setConfig] = useState<Record<string, SiteConfig>>({});
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'vision' | 'projects'>('hero');

  const { isBlocked, proceed, cancel } = useUnsavedChanges();

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) { 
        setConfig({}); 
        setMediaItems([]); 
        setLoading(false); 
        return; 
      }

      const [configRes, mediaRes] = await Promise.all([
        supabase.from('site_config').select('*'),
        supabase.from('media_items').select('*').eq('active', true).order('order_index')
      ]);

      const map = (configRes.data || []).reduce((acc: any, item: any) => { 
        acc[item.key] = item; 
        return acc; 
      }, {});
      setConfig(map);

      setMediaItems((mediaRes.data || []) as MediaItem[]);
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = useCallback(async (key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    setConfig(prev => ({ 
      ...prev, 
      [key]: { ...(prev[key] || { key }), [field]: value } as SiteConfig 
    }));

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
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setSaving(false); 
    }
  }, [config]);

  // Universal media handler — saves to BOTH site_config + media_items
  const handleMediaChange = async (key: string, url: string, type: 'image' | 'video' = 'image', section: string = 'general') => {
    // 1. Update site_config (for legacy compatibility)
    await handleSave(key, 'value_generic', url);

    // 2. Also upsert into media_items table (new universal system)
    if (isSupabaseConfigured() && url) {
      try {
        await supabase.from('media_items').upsert({
          key,
          type,
          url,
          storage_path: url,
          section,
          active: true,
          alt_fr: null,
          alt_en: null,
        }, { onConflict: 'key' });
        
        // Refresh media list
        await fetchData();
      } catch (err) {
        console.warn('[Admin] Failed to upsert media_items', err);
      }
    }
  };

  const getCurrentMedia = (key: string, fallbackKey?: string) => {
    const media = getMediaForKey(key, config as any, mediaItems);
    if (media.url) return media;

    if (fallbackKey) {
      return getMediaForKey(fallbackKey, config as any, mediaItems);
    }
    return { url: null, type: 'image' as const };
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-[#00BFFF] animate-spin rounded-full" />
    </div>
  );

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
          <p className="text-sm text-[#A8B4C8] mt-1">Image ou vidéo par zone • Synchronisation live • Media Items + Config</p>
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

      {/* HERO — Image OR Video (priority to video) */}
      {activeTab === 'hero' && (
        <div className="glass-card p-8 space-y-8">
          <div>
            <h3 className="font-bold text-xl mb-1">Hero Section</h3>
            <p className="text-sm text-[#A8B4C8]">Image ou vidéo cinématique. La vidéo est prioritaire.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload
              label="Média Hero (Image ou Vidéo)"
              bucket="media"
              folder="hero"
              currentUrl={getCurrentMedia('hero_media', 'hero_image_url').url}
              onChange={(url, type) => handleMediaChange('hero_media', url, type, 'hero')}
              accept="image/*,video/*"
              maxSizeMB={60}
              currentType={getCurrentMedia('hero_media', 'hero_image_url').type}
            />

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">URL Vidéo Hero directe (optionnel)</label>
                <input 
                  type="text" 
                  placeholder="https://... .mp4"
                  value={config['hero_video_url']?.value_generic || ''} 
                  onChange={e => handleSave('hero_video_url', 'value_generic', e.target.value)} 
                  className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded-xl p-4 text-sm" 
                />
                <p className="text-xs text-[#A8B4C8] mt-2">Si une vidéo est fournie ici, elle sera utilisée en priorité.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Alt text (FR)</label>
                <input 
                  type="text" 
                  placeholder="Portrait cinématique de Stane"
                  value={config['hero_media_alt_fr']?.value_generic || ''} 
                  onChange={e => handleSave('hero_media_alt_fr', 'value_generic', e.target.value)} 
                  className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded-xl p-3 text-sm" 
                />
              </div>
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
            currentUrl={getCurrentMedia('about_photo', 'about_image_url').url}
            onChange={(url) => handleMediaChange('about_photo', url, 'image', 'about')}
            accept="image/*"
            maxSizeMB={15}
            currentType="image"
          />
          <div className="mt-4">
            <label className="block text-sm font-semibold text-white mb-2">Description photo (FR)</label>
            <input 
              type="text" 
              value={config['about_photo_alt_fr']?.value_generic || ''} 
              onChange={e => handleSave('about_photo_alt_fr', 'value_generic', e.target.value)} 
              className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded-xl p-3 text-sm" 
              placeholder="Stane dans son studio"
            />
          </div>
        </div>
      )}

      {/* VISION — Image OR Video */}
      {activeTab === 'vision' && (
        <div className="glass-card p-8">
          <h3 className="font-bold text-xl mb-6">Média Vision (Image ou Vidéo)</h3>
          <FileUpload
            label="Image / Vidéo Vision"
            bucket="media"
            folder="vision"
            currentUrl={getCurrentMedia('vision_media', 'vision_image_url').url}
            onChange={(url, type) => handleMediaChange('vision_media', url, type, 'vision')}
            accept="image/*,video/*"
            maxSizeMB={50}
            currentType={getCurrentMedia('vision_media', 'vision_image_url').type}
          />
          <p className="text-xs text-[#A8B4C8] mt-3">Accepte image ou vidéo. Idéal pour une vision cinématique du futur.</p>
        </div>
      )}

      {/* PROJECTS */}
      {activeTab === 'projects' && (
        <div className="glass-card p-8 space-y-6">
          <div>
            <h3 className="font-bold text-xl mb-2">Médias Projets</h3>
            <p className="text-sm text-[#A8B4C8]">Fallback global + médias par projet (gérés dans l'onglet Projets).</p>
          </div>
          
          <FileUpload
            label="Image de fallback Projets"
            bucket="media"
            folder="projects"
            currentUrl={getCurrentMedia('projects_fallback_image', 'projects_fallback_image').url}
            onChange={(url) => handleMediaChange('projects_fallback_image', url, 'image', 'projects')}
            accept="image/*"
            maxSizeMB={15}
            currentType="image"
          />
          
          <div className="p-4 bg-[#0A0A1E] rounded-xl text-xs text-[#A8B4C8]">
            Les projets individuels ont leur propre champ <code>image_url</code> dans la table <strong>projects</strong>.
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
