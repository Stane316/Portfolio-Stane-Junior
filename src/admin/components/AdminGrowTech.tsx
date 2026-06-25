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

  const [data, setData] = useState<GrowTechData>(DEFAULT_DATA);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load from DB (only once when data arrives)
  useEffect(() => {
    if (configData.length > 0 && configData[0].value_generic) {
      try {
        const parsed = JSON.parse(configData[0].value_generic);
        setData({ ...DEFAULT_DATA, ...parsed });
        setIsDirty(false);
      } catch (e) {
        console.error('Erreur parsing growtech_data:', e);
      }
    }
  }, [configData]);

  // Update local state only (no save)
  const updateData = (updates: Partial<GrowTechData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    setIsDirty(true);
  };

  // Single explicit save
  const handleSave = async () => {
    if (!isDirty) return;

    setSaving(true);
    try {
      const result = await saveItem(
        { key: 'growtech_data', value_generic: JSON.stringify(data) },
        configData[0]?.id
      );

      if (result.success) {
        setIsDirty(false);
        onToast('success', 'Données GROW TECH sauvegardées !');
      } else {
        onToast('error', result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      onToast('error', 'Erreur inattendue');
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>
        
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            isDirty && !saving
              ? 'bg-[#00BFFF] text-black hover:bg-white'
              : 'bg-[#1A1A2E] text-[#4A5568] cursor-not-allowed'
          }`}
        >
          {saving ? 'Sauvegarde...' : isDirty ? 'Enregistrer les modifications' : 'Aucune modification'}
        </button>
      </div>

      {/* Identité */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">
          Identité &amp; Description
        </h3>

        <FileUpload
          label="Logo GROW TECH"
          bucket="portfolio-assets"
          folder="growtech"
          currentUrl={data.logo_url}
          onChange={(url) => updateData({ logo_url: url })}
          accept="image/*"
          maxSizeMB={5}
        />

        <BilingualInput
          label="Description de l'agence"
          valueFr={data.description_fr}
          valueEn={data.description_en}
          onChangeFr={(v) => updateData({ description_fr: v })}
          onChangeEn={(v) => updateData({ description_en: v })}
          rows={4}
        />
      </div>

      {/* Vision */}
      <AdminGrowTechVision
        vision={data.vision}
        onChange={(vision) => updateData({ vision })}
      />

      {/* Projets */}
      <AdminGrowTechProjects
        projects={data.projects}
        onChange={(projects) => updateData({ projects })}
        onToast={onToast}
      />

      {/* Membres */}
      <AdminGrowTechMembers
        members={data.members}
        onChange={(members) => updateData({ members })}
        onToast={onToast}
      />

      {isDirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#00BFFF] text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-white transition-all"
          >
            {saving ? 'Sauvegarde en cours...' : 'Enregistrer toutes les modifications'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminGrowTech;
