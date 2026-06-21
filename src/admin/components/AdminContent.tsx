/**
 * AdminContent — Manages all site_config content (Hero, About, Footer, Links)
 *
 * Features:
 * - Debounced auto-save (800ms) via configRef for stale-closure safety (P-04 FIX)
 * - Immediate save for file uploads
 * - P-13 FIX: Replaced emoji in labels (📸, 👤, 📄) with text-only labels
 * - P-05 FIX: Unsaved changes detection with beforeunload + router blocking
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
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
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'footer' | 'links'>('hero');

  // P-05: Unsaved changes detection
  const { isBlocked, proceed, cancel } = useUnsavedChanges();

  // Track whether any field has been modified since last save
  const dirtyRef = useRef(false);
  const markDirty = useCallback(() => {
    if (!dirtyRef.current) {
      dirtyRef.current = true;
    }
  }, []);

  // Debounce refs — store timeout IDs per config key+field
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchConfig = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) { setConfig({}); setLoading(false); return; }
      const { data, error } = await supabase.from('site_config').select('*');
      if (error) throw error;
      const configMap = (data || []).reduce((acc, item) => { acc[item.key] = item; return acc; }, {} as Record<string, SiteConfig>);
      setConfig(configMap);
      // Data just loaded = no dirty state
      dirtyRef.current = false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceRefs.current).forEach(clearTimeout);
    };
  }, []);

  // ---- Debounced save: updates local state immediately, saves to Supabase after 800ms of inactivity ----
  // P-04 FIX: Use functional config access via ref to avoid stale closure
  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  const handleSave = useCallback((key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    // 1. Optimistic local update (instant)
    setConfig(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { key }), [field]: value } as SiteConfig,
    }));

    // 2. Mark as dirty
    markDirty();

    // 3. Clear previous debounce for this key+field
    const debounceKey = `${key}_${field}`;
    if (debounceRefs.current[debounceKey]) {
      clearTimeout(debounceRefs.current[debounceKey]);
    }

    // 4. Debounce the Supabase upsert — reads latest config from ref
    debounceRefs.current[debounceKey] = setTimeout(async () => {
      try {
        setSaving(true);
        if (!isSupabaseConfigured()) {
          setSuccess('Sauvegardé localement');
          setTimeout(() => setSuccess(''), 3000);
          setSaving(false);
          return;
        }
        // Read latest config from ref to avoid stale values
        const currentConfig = configRef.current;
        const existing = currentConfig[key];
        const { error } = await supabase.from('site_config').upsert({
          key,
          value_fr: field === 'value_fr' ? value : existing?.value_fr || '',
          value_en: field === 'value_en' ? value : existing?.value_en || '',
          value_generic: field === 'value_generic' ? value : existing?.value_generic || '',
        });
        if (error) throw error;
        // After save, mark as clean
        dirtyRef.current = false;
        setSuccess('Sauvegardé !');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur de sauvegarde';
        setError(message);
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [markDirty]);

  // ---- Immediate save for image/file uploads (no debounce — these are explicit actions) ----
  const handleImmediateSave = useCallback(async (key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => {
    try {
      setSaving(true);
      markDirty();
      if (!isSupabaseConfigured()) {
        setConfig(prev => ({ ...prev, [key]: { ...(prev[key] || { key }), [field]: value } as SiteConfig }));
        setSuccess('Sauvegardé localement');
        setTimeout(() => setSuccess(''), 3000);
        setSaving(false);
        return;
      }
      const existing = config[key];
      const { error } = await supabase.from('site_config').upsert({
        key,
        value_fr: field === 'value_fr' ? value : existing?.value_fr || '',
        value_en: field === 'value_en' ? value : existing?.value_en || '',
        value_generic: field === 'value_generic' ? value : existing?.value_generic || '',
      });
      if (error) throw error;
      setConfig(prev => ({ ...prev, [key]: { ...existing, [field]: value } as SiteConfig }));
      // After save, mark as clean
      dirtyRef.current = false;
      setSuccess('Sauvegardé !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de sauvegarde';
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [config, markDirty]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  }

  const tabs = [
    { id: 'hero' as const, label: 'Hero' },
    { id: 'about' as const, label: 'À propos' },
    { id: 'footer' as const, label: 'Footer' },
    { id: 'links' as const, label: 'Liens' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Gestion du contenu</h2>
        {saving && <span className="text-[#00BFFF] text-sm animate-pulse flex items-center gap-2"><div className="w-3 h-3 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /> Sauvegarde...</span>}
      </div>

      {/* P-05: Unsaved changes navigation blocker */}
      {isBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Modifications non sauvegardées">
          <div className="bg-[#141430] border border-[rgba(0,191,255,0.3)] rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-white">Modifications non sauvegardées</h3>
            </div>
            <p className="text-[#A8B4C8] text-sm mb-6">Vous avez des modifications en cours de sauvegarde. Quitter cette page pourrait entraîner une perte de données.</p>
            <div className="flex gap-3">
              <button onClick={cancel} className="btn-secondary text-sm py-2 px-4">Rester</button>
              <button onClick={proceed} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors">Quitter sans sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400" role="alert">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400" role="alert">{success}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#141430] p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#00BFFF] text-black'
                : 'text-[#A8B4C8] hover:text-white hover:bg-[#1A1A2E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================ */}
      {/* TAB: HERO */}
      {/* ============================================ */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Hero Image Upload */}
          <div className="glass-card border border-[rgba(0,191,255,0.15)]">
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Images
            </h3>
            <div className="space-y-4">
              <ImageUploader
                label="Photo professionnelle (Hero)"
                currentUrl={config['hero_image_url']?.value_generic || ''}
                onChange={(url) => handleImmediateSave('hero_image_url', 'value_generic', url)}
                onRemove={() => handleImmediateSave('hero_image_url', 'value_generic', '')}
                folder="hero"
                maxSize={5}
              />
              <FileUpload
                label="Photo À propos"
                bucket="portfolio-assets"
                folder="about"
                currentUrl={config['about_image_url']?.value_generic || ''}
                onChange={(url) => handleImmediateSave('about_image_url', 'value_generic', url)}
                maxSizeMB={5}
              />
              <FileUpload
                label="CV (PDF)"
                bucket="portfolio-assets"
                folder="cv"
                currentUrl={config['cv_url']?.value_generic || ''}
                onChange={(url) => handleImmediateSave('cv_url', 'value_generic', url)}
                accept=".pdf"
                maxSizeMB={10}
              />
            </div>
          </div>

          {/* Hero Texts */}
          <div className="glass-card border border-[rgba(0,191,255,0.15)]">
            <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Textes Hero
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConfigField config={config} label="Badge (FR)" configKey="hero_badge" field="value_fr" onSave={handleSave} type="text" />
              <ConfigField config={config} label="Badge (EN)" configKey="hero_badge" field="value_en" onSave={handleSave} type="text" />
              <ConfigField config={config} label="Tagline (FR)" configKey="hero_tagline" field="value_fr" onSave={handleSave} type="textarea" />
              <ConfigField config={config} label="Tagline (EN)" configKey="hero_tagline" field="value_en" onSave={handleSave} type="textarea" />
            </div>

            {/* Stats */}
            <h4 className="text-white font-semibold mt-6 mb-3">Statistiques Hero</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['1', '2', '3'].map((num) => (
                <div key={num} className="border border-[rgba(0,191,255,0.15)] rounded-lg p-4 bg-[#141430] bg-opacity-30 space-y-2">
                  <p className="text-[#00BFFF] text-xs font-bold uppercase">Stat {num}</p>
                  <ConfigField config={config} label="Valeur" configKey={`hero_stat_${num}`} field="value_generic" onSave={handleSave} type="text" compact />
                  <ConfigField config={config} label="Label (FR)" configKey={`hero_stat_${num}_label`} field="value_fr" onSave={handleSave} type="text" compact />
                  <ConfigField config={config} label="Label (EN)" configKey={`hero_stat_${num}_label`} field="value_en" onSave={handleSave} type="text" compact />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: ABOUT */}
      {/* ============================================ */}
      {activeTab === 'about' && (
        <div className="glass-card border border-[rgba(0,191,255,0.15)]">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Section À propos
          </h3>
          <div className="space-y-4">
            <ConfigField config={config} label="Paragraphe 1 (FR)" configKey="about_text_p1" field="value_fr" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 1 (EN)" configKey="about_text_p1" field="value_en" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 2 (FR)" configKey="about_text_p2" field="value_fr" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 2 (EN)" configKey="about_text_p2" field="value_en" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 3 (FR)" configKey="about_text_p3" field="value_fr" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 3 (EN)" configKey="about_text_p3" field="value_en" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 4 (FR)" configKey="about_text_p4" field="value_fr" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Paragraphe 4 (EN)" configKey="about_text_p4" field="value_en" onSave={handleSave} type="textarea" />

            <div className="border-t border-[#1A1A2E] pt-4 mt-4">
              <h4 className="text-white font-semibold mb-3">Badges d'information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigField config={config} label="Localisation (FR)" configKey="about_location" field="value_fr" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Localisation (EN)" configKey="about_location" field="value_en" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Éducation (FR)" configKey="about_education" field="value_fr" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Éducation (EN)" configKey="about_education" field="value_en" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Rôle (FR)" configKey="about_role" field="value_fr" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Rôle (EN)" configKey="about_role" field="value_en" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Cible (FR)" configKey="about_target" field="value_fr" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Cible (EN)" configKey="about_target" field="value_en" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Disponibilité (FR)" configKey="about_available" field="value_fr" onSave={handleSave} type="text" />
                <ConfigField config={config} label="Disponibilité (EN)" configKey="about_available" field="value_en" onSave={handleSave} type="text" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: FOOTER */}
      {/* ============================================ */}
      {activeTab === 'footer' && (
        <div className="glass-card border border-[rgba(0,191,255,0.15)]">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h6m6 0h6" /></svg>
            Footer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfigField config={config} label="Tagline (FR)" configKey="footer_tagline" field="value_fr" onSave={handleSave} type="text" />
            <ConfigField config={config} label="Tagline (EN)" configKey="footer_tagline" field="value_en" onSave={handleSave} type="text" />
            <ConfigField config={config} label="Fondateur (FR)" configKey="footer_founder" field="value_fr" onSave={handleSave} type="text" />
            <ConfigField config={config} label="Fondateur (EN)" configKey="footer_founder" field="value_en" onSave={handleSave} type="text" />
            <ConfigField config={config} label="Placeholder témoignages (FR)" configKey="testimonials_placeholder" field="value_fr" onSave={handleSave} type="textarea" />
            <ConfigField config={config} label="Placeholder témoignages (EN)" configKey="testimonials_placeholder" field="value_en" onSave={handleSave} type="textarea" />
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* TAB: LINKS */}
      {/* ============================================ */}
      {activeTab === 'links' && (
        <div className="glass-card border border-[rgba(0,191,255,0.15)]">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            Liens & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConfigField config={config} label="WhatsApp" configKey="whatsapp" field="value_generic" onSave={handleSave} type="text" />
            <ConfigField config={config} label="GitHub" configKey="github" field="value_generic" onSave={handleSave} type="url" />
            <ConfigField config={config} label="LinkedIn" configKey="linkedin" field="value_generic" onSave={handleSave} type="url" />
            <ConfigField config={config} label="Email" configKey="email_contact" field="value_generic" onSave={handleSave} type="email" />
            <ConfigField config={config} label="URL GROW TECH" configKey="growtech_url" field="value_generic" onSave={handleSave} type="url" />
            <ConfigField config={config} label="Badge CTA GROW TECH" configKey="growtech_cta_badge" field="value_generic" onSave={handleSave} type="text" />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Composant réutilisable pour les champs de configuration
// With debounced save — updates local state on every keystroke
// but only persists to Supabase after debounce (handled by parent)
// ============================================================

interface ConfigFieldProps {
  config: Record<string, SiteConfig>;
  label: string;
  configKey: string;
  field: 'value_fr' | 'value_en' | 'value_generic';
  onSave: (key: string, field: 'value_fr' | 'value_en' | 'value_generic', value: string) => void;
  type: 'text' | 'textarea' | 'url' | 'email';
  compact?: boolean;
}

const ConfigField: React.FC<ConfigFieldProps> = ({ config, label, configKey, field, onSave, type, compact }) => {
  const item = config[configKey];
  const value = item?.[field] || '';

  const inputType = type === 'url' ? 'url' : type === 'email' ? 'email' : 'text';
  const fieldId = `${configKey}-${field}`;

  return (
    <div className={compact ? '' : 'border border-[rgba(0,191,255,0.15)] rounded-lg p-4 bg-[#141430] bg-opacity-30'}>
      {!compact && (
        <label htmlFor={fieldId} className="block text-sm font-semibold mb-2 text-white">{label}</label>
      )}
      {compact && (
        <label htmlFor={fieldId} className="block text-xs text-[#A8B4C8] mb-1">{label}</label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          placeholder={label}
          value={value}
          onChange={(e) => onSave(configKey, field, e.target.value)}
          rows={compact ? 2 : 3}
          className={`w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF] transition-colors ${compact ? 'text-xs' : ''}`}
        />
      ) : (
        <input
          id={fieldId}
          placeholder={label}
          type={inputType}
          value={value}
          onChange={(e) => onSave(configKey, field, e.target.value)}
          className={`w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] transition-colors ${compact ? 'text-xs' : ''}`}
        />
      )}
    </div>
  );
};

export default AdminContent;
