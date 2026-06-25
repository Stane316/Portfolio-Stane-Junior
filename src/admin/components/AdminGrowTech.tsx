import React, { useState, useEffect } from 'react';
import { GrowTechData } from '../types';
import { useAdminData } from '../hooks/useAdminData';
import FileUpload from './FileUpload';
import BilingualInput from './BilingualInput';
import AdminGrowTechMembers from './AdminGrowTechMembers';
import AdminGrowTechProjects from './AdminGrowTechProjects';
import AdminGrowTechVision from './AdminGrowTechVision';

const DEFAULT_DATA: GrowTechData = {
  logo_url: '',
  description_fr: "GROW TECH est une agence digitale estudiantine co-fondée avec Godo Landron.",
  description_en: "GROW TECH is a student digital agency co-founded with Godo Landron.",
  members: [],
  projects: [],
  vision: { title_fr: 'Notre Vision', title_en: 'Our Vision', content_fr: '', content_en: '' }
};

const AdminGrowTech: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const { data: configData, loading, saveItem } = useAdminData<any>({
    table: 'site_config',
    filter: { column: 'key', value: 'growtech_data' },
    selectAll: true
  });

  const [draft, setDraft] = useState<GrowTechData>(DEFAULT_DATA);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load server data into local draft ONLY once when loaded
  useEffect(() => {
    if (configData.length > 0 && configData[0].value_generic) {
      try {
        const parsed = JSON.parse(configData[0].value_generic);
        const loaded = { ...DEFAULT_DATA, ...parsed };
        setDraft(loaded);
        setIsDirty(false);
      } catch (e) {
        console.error('Erreur parsing growtech_data:', e);
      }
    }
  }, [configData]);

  // Pure local draft updates — NEVER trigger save
  const updateDraft = (updates: Partial<GrowTechData>) => {
    setDraft(prev => {
      const updated = { ...prev, ...updates };
      setIsDirty(true);
      return updated;
    });
  };

  const updateIdentity = (partial: Partial<GrowTechData>) => {
    updateDraft(partial);
  };

  const updateVision = (vision: GrowTechData['vision']) => {
    updateDraft({ vision });
  };

  const updateProjects = (projects: GrowTechData['projects']) => {
    updateDraft({ projects });
  };

  const updateMembers = (members: GrowTechData['members']) => {
    updateDraft({ members });
  };

  const handleSaveAll = async () => {
    if (!isDirty) return;

    setSaving(true);
    try {
      const payload = {
        key: 'growtech_data',
        value_generic: JSON.stringify(draft)
      };
      const result = await saveItem(payload, configData[0]?.id);

      if (result.success) {
        setIsDirty(false);
        onToast('success', '✅ Toutes les données GROW TECH ont été enregistrées avec succès !');
      } else {
        onToast('error', result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err: any) {
      onToast('error', 'Erreur inattendue : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (configData.length > 0 && configData[0].value_generic) {
      try {
        const parsed = JSON.parse(configData[0].value_generic);
        const loaded = { ...DEFAULT_DATA, ...parsed };
        setDraft(loaded);
        setIsDirty(false);
        onToast('info', 'Modifications annulées. Données serveur rechargées.');
      } catch (e) {
        onToast('error', 'Impossible de réinitialiser');
      }
    } else {
      setDraft(DEFAULT_DATA);
      setIsDirty(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header with single explicit save button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>
          <p className="text-[#4A5568] text-sm mt-1">État local + bouton d'enregistrement unique (stable)</p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700">
              Modifications non sauvegardées
            </span>
          )}
          
          <button
            onClick={handleReset}
            disabled={!isDirty || saving}
            className="px-4 py-2 text-sm bg-[#1A1A2E] hover:bg-[#252545] text-white rounded-lg border border-[#1A1A2E] disabled:opacity-50 transition-colors"
          >
            Annuler
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={!isDirty || saving}
            className="px-6 py-2 text-sm font-bold bg-[#00BFFF] hover:bg-[#00A3D9] text-black rounded-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.985]"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer toutes les modifications'
            )}
          </button>
        </div>
      </div>

      {/* Identité & Description - local updates only */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Identité & Description</h3>
        
        <FileUpload
          label="Logo"
          bucket="portfolio-assets"
          folder="growtech"
          currentUrl={draft.logo_url}
          onChange={(url) => updateIdentity({ logo_url: url })}
          accept="image/*"
          maxSizeMB={5}
        />

        <BilingualInput
          label="Description"
          valueFr={draft.description_fr}
          valueEn={draft.description_en}
          onChangeFr={(v) => updateIdentity({ description_fr: v })}
          onChangeEn={(v) => updateIdentity({ description_en: v })}
          rows={4}
        />
      </div>

      {/* Sub-components receive local draft + pure update callbacks */}
      <AdminGrowTechVision 
        vision={draft.vision} 
        onChange={updateVision} 
      />

      <AdminGrowTechProjects 
        projects={draft.projects} 
        onChange={updateProjects} 
        onToast={onToast} 
      />

      <AdminGrowTechMembers 
        members={draft.members} 
        onChange={updateMembers} 
        onToast={onToast} 
      />

      {/* Bottom save CTA */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveAll}
          disabled={!isDirty || saving}
          className="px-8 py-3 bg-[#00BFFF] hover:bg-[#00A3D9] text-black font-bold rounded-xl text-base flex items-center gap-3 disabled:opacity-60 transition-all"
        >
          {saving ? 'Enregistrement en cours...' : '💾 Enregistrer toutes les modifications'}
        </button>
      </div>
    </div>
  );
};

export default AdminGrowTech;
