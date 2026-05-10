import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import FileUpload from './FileUpload';

interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string;
  initial: string;
  image_url: string;
  order: number;
}

interface GrowTechData {
  description_fr: string;
  description_en: string;
  members: TeamMember[];
  services: string[];
}

const AdminGrowTech: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GrowTechData>({
    description_fr: '', description_en: '', members: [], services: []
  });
  
  // États pour le formulaire membre
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  const fetchData = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    try {
      const { data: configData, error } = await supabase.from('site_config').select('*').in('key', ['growtech_data']);
      if (!error && configData && configData.length > 0) {
        const parsed = JSON.parse(configData[0].value_generic || '{}');
        setData({
          description_fr: parsed.description_fr || '',
          description_en: parsed.description_en || '',
          members: parsed.members || [],
          services: parsed.services || []
        });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveData = async (newData: GrowTechData) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('site_config').upsert({
        key: 'growtech_data',
        value_generic: JSON.stringify(newData)
      });
      setData(newData);
      onToast('success', 'Sauvegardé !');
    } catch (e: any) { onToast('error', e.message); }
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...memberForm,
      order: data.members.length
    };
    const newData = { ...data, members: [...data.members, newMember] };
    saveData(newData);
    setShowMemberForm(false);
    setMemberForm({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });
  };

  const handleRemoveMember = (id: string) => {
    const newData = { ...data, members: data.members.filter(m => m.id !== id) };
    saveData(newData);
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white">Gestion GROW TECH</h2>

      {/* Description */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-white font-semibold">Description de l'agence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea 
            placeholder="Description (FR)" 
            value={data.description_fr}
            onChange={(e) => saveData({...data, description_fr: e.target.value})}
            className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm"
            rows={4}
          />
          <textarea 
            placeholder="Description (EN)" 
            value={data.description_en}
            onChange={(e) => saveData({...data, description_en: e.target.value})}
            className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm"
            rows={4}
          />
        </div>
      </div>

      {/* Services */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-white font-semibold">Services (Séparés par des virgules)</h3>
        <input 
          type="text" 
          value={data.services.join(', ')}
          onChange={(e) => saveData({...data, services: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
          className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm"
        />
      </div>

      {/* Membres */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold">Équipe</h3>
          <button onClick={() => setShowMemberForm(!showMemberForm)} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">
            {showMemberForm ? 'Annuler' : '+ Ajouter Membre'}
          </button>
        </div>

        <AnimatePresence>
          {showMemberForm && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden border-t border-[#1A1A2E] pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input placeholder="Nom" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Initiales (ex: SJ)" value={memberForm.initial} onChange={e => setMemberForm({...memberForm, initial: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Rôle (FR)" value={memberForm.role_fr} onChange={e => setMemberForm({...memberForm, role_fr: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Role (EN)" value={memberForm.role_en} onChange={e => setMemberForm({...memberForm, role_en: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              </div>
              <FileUpload label="Photo Membre" bucket="portfolio-assets" folder="team" currentUrl={memberForm.image_url} onChange={(url) => setMemberForm({...memberForm, image_url: url})} />
              <button onClick={handleAddMember} className="mt-4 w-full bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">Enregistrer le membre</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {data.members.map(member => (
            <div key={member.id} className="flex items-center justify-between bg-[#141430] p-3 rounded border border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0A0A1E] flex items-center justify-center text-xs font-bold text-[#00BFFF]">{member.initial}</div>
                <div>
                  <p className="text-white text-sm font-medium">{member.name}</p>
                  <p className="text-[#4A5568] text-xs">{member.role_fr}</p>
                </div>
              </div>
              <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGrowTech;