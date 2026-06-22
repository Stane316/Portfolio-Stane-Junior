import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

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
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'footer' | 'links' | 'growtech'>('hero');

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
        setTimeout(() => setSuccess(''), 2000);
      } catch (e: any) { setError(e.message); } finally { setSaving(false); }
    }, 700);
  }, [config]);

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#00BFFF] animate-spin rounded-full" /></div>;

  const tabs = [
    { id: 'hero' as const, label: 'Hero' },
    { id: 'about' as const, label: 'À propos' },
    { id: 'footer' as const, label: 'Footer' },
    { id: 'links' as const, label: 'Liens' },
    { id: 'growtech' as const, label: 'GROW TECH' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Gestion du contenu</h2>
        {saving && <span className="text-[#00BFFF] text-sm">Sauvegarde...</span>}
      </div>

      {isBlocked && <div className="p-4 bg-yellow-500/20 rounded">Modifications non sauvegardées</div>}
      {error && <div className="p-3 bg-red-500/20 text-red-400 rounded">{error}</div>}
      {success && <div className="p-3 bg-green-500/20 text-green-400 rounded">{success}</div>}

      <div className="flex gap-2 border-b border-[#1A1A2E] pb-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-5 py-2 rounded-t text-sm font-medium ${activeTab === t.id ? 'bg-[#141430] text-white border-b-2 border-[#00BFFF]' : 'text-[#A8B4C8]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && <div className="glass-card p-6">Hero fields...</div>}
      {activeTab === 'about' && <div className="glass-card p-6">About fields...</div>}
      {activeTab === 'footer' && <div className="glass-card p-6">Footer fields...</div>}
      {activeTab === 'links' && <div className="glass-card p-6">Links fields...</div>}

      {activeTab === 'growtech' && (
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">GROW TECH</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#A8B4C8] block mb-1">URL GROW TECH</label>
              <input type="text" value={config['growtech_url']?.value_generic || ''} onChange={e => handleSave('growtech_url', 'value_generic', e.target.value)} className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded p-3 text-sm" />
            </div>
            <div>
              <label className="text-sm text-[#A8B4C8] block mb-1">Badge CTA</label>
              <input type="text" value={config['growtech_cta_badge']?.value_generic || ''} onChange={e => handleSave('growtech_cta_badge', 'value_generic', e.target.value)} className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded p-3 text-sm" />
            </div>
          </div>
          <p className="text-xs text-[#A8B4C8] mt-4">Les données détaillées (équipe, projets, vision) sont gérées dans l'onglet <strong>GROW TECH</strong> du menu latéral.</p>
        </div>
      )}
    </div>
  );
};

export default AdminContent;