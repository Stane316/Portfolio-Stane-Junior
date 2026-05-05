/**
 * AdminContent - Gestion du contenu avec upload d'images
 */

import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import ImageUpload from './ImageUpload';

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
    { key: 'hero_badge', label: 'Badge Hero', type: 'text' },
    { key: 'hero_tagline', label: 'Tagline Hero', type: 'textarea' },
    { key: 'growtech_url', label: 'URL GROW TECH', type: 'url' },
    { key: 'growtech_cta_badge', label: 'Badge CTA GROW TECH', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'github', label: 'GitHub', type: 'url' },
    { key: 'linkedin', label: 'LinkedIn', type: 'url' },
    { key: 'email_contact', label: 'Email', type: 'email' },
    { key: 'testimonials_placeholder', label: 'Placeholder Témoignages', type: 'textarea' },
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    try {
      setSaving(true);
      
      if (!isSupabaseConfigured()) {
        setConfig({ ...config, [key]: { ...(config[key] || { key }), [field]: value } });
        setSuccess('Saved locally (Supabase not configured)');
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion du contenu</h2>
        {saving && <span className="text-cyan-400">Sauvegarde...</span>}
      </div>

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">{success}</div>}

      {/* UPLOADS - Section principale */}
      <div className="glass-card border-l-4 border-l-cyan-400">
        <h3 className="text-lg font-bold text-white mb-4">📁 Téléversements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Photo professionnelle Hero */}
          <div>
            <ImageUpload
              label="📸 Photo professionnelle (Hero)"
              bucket="portfolio-assets"
              folder="hero"
              currentUrl={config['hero_image_url']?.value_generic || ''}
              onUpload={(url) => handleSave('hero_image_url', 'value_generic', url)}
              onRemove={() => handleSave('hero_image_url', 'value_generic', '')}
              maxSize={5}
            />
          </div>

          {/* Logo GROW TECH */}
          <div>
            <ImageUpload
              label="🏢 Logo GROW TECH"
              bucket="portfolio-assets"
              folder="growtech"
              currentUrl={config['growtech_logo_url']?.value_generic || ''}
              onUpload={(url) => handleSave('growtech_logo_url', 'value_generic', url)}
              onRemove={() => handleSave('growtech_logo_url', 'value_generic', '')}
              maxSize={5}
            />
          </div>

          {/* CV PDF */}
          <div>
            <ImageUpload
              label="📄 CV (PDF)"
              bucket="portfolio-docs"
              folder="cv"
              currentUrl={config['cv_url']?.value_generic || ''}
              onUpload={(url) => handleSave('cv_url', 'value_generic', url)}
              onRemove={() => handleSave('cv_url', 'value_generic', '')}
              accept=".pdf"
              maxSize={10}
              type="document"
            />
          </div>
        </div>
      </div>

      {/* TEXTES - Section secondaire */}
      <div className="glass-card">
        <h3 className="text-lg font-bold text-white mb-4">✏️ Textes du site</h3>
        <div className="grid grid-cols-1 gap-4">
          {configFields.map(({ key, label, type }) => {
            const item = config[key];
            return (
              <div key={key} className="border border-gray-700 rounded-lg p-4">
                <label className="block text-sm font-semibold mb-2 text-white">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    value={item?.value_generic || ''}
                    onChange={(e) => handleSave(key, 'value_generic', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white resize-none"
                  />
                ) : (
                  <input
                    type={type === 'url' ? 'url' : (type === 'email' ? 'email' : 'text')}
                    value={item?.value_generic || ''}
                    onChange={(e) => handleSave(key, 'value_generic', e.target.value)}
                    className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white"
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
