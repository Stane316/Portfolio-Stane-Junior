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

  useEffect(() => {
    if (configData.length > 0 && configData[0].value_generic) {
      try {
        const parsed = JSON.parse(configData[0].value_generic);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch (e) {
        console.error('Erreur parsing:', e);
      }
    }
  }, [configData]);

  const handleSaveData = async (newData: GrowTechData) => {
    const result = await saveItem({ key: 'growtech_data', value_generic: JSON.stringify(newData) }, configData[0]?.id);
    if (result.success) {
      setData(newData);
      onToast('success', 'Données sauvegardées !');
    } else {
      onToast('error', result.error || 'Erreur');
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>

      {/* Identité */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Identité & Description</h3>
        <FileUpload label="Logo" bucket="portfolio-assets" folder="growtech" currentUrl={data.logo_url} onChange={(url) => handleSaveData({ ...data, logo_url: url })} accept="image/*" maxSizeMB={5} />
        <BilingualInput label="Description" valueFr={data.description_fr} valueEn={data.description_en} onChangeFr={(v) => handleSaveData({ ...data, description_fr: v })} onChangeEn={(v) => handleSaveData({ ...data, description_en: v })} rows={4} />
      </div>

      {/* Composants séparés */}
      <AdminGrowTechVision vision={data.vision} onSave={(vision) => handleSaveData({ ...data, vision })} />
      <AdminGrowTechProjects projects={data.projects} onSave={(projects) => handleSaveData({ ...data, projects })} onToast={onToast} />
      <AdminGrowTechMembers members={data.members} onSave={(members) => handleSaveData({ ...data, members })} onToast={onToast} />
    </div>
  );
};

export default AdminGrowTech;