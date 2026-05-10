import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import FileUpload from './FileUpload';

const DEFAULT_DATA = {
  logo_url: '',
  description_fr: "GROW TECH est une agence digitale estudiantine co-fondée avec Godo Landron. Six personnes. Trois squads. On développe des solutions pour le Bénin et la sous-région OHADA.",
  description_en: "GROW TECH is a student digital agency co-founded with Godo Landron. Six people. Three squads. We build solutions for Benin and the OHADA sub-region.",
  members: [
    { id: '1', name: 'Stane-Junior Aniambossou', role_fr: 'Fondateur & Tech Lead', role_en: 'Founder & Tech Lead', initial: 'SJ', image_url: '' },
    { id: '2', name: 'Godo Landron', role_fr: 'Co-fondateur & Biz Dev', role_en: 'Co-founder & Biz Dev', initial: 'GL', image_url: '' },
    { id: '3', name: 'Huriel DENAKPO', role_fr: 'Lead Backend', role_en: 'Lead Backend', initial: 'HD', image_url: '' },
    { id: '4', name: 'Espanedi', role_fr: 'Lead Frontend', role_en: 'Lead Frontend', initial: 'ES', image_url: '' },
    { id: '5', name: 'Expedy', role_fr: 'Sales Manager', role_en: 'Sales Manager', initial: 'EX', image_url: '' },
    { id: '6', name: 'OLAFA Mauricia', role_fr: 'Sales Manager', role_en: 'Sales Manager', initial: 'OM', image_url: '' },
  ],
  projects: [],
  vision: { title_fr: '', title_en: '', content_fr: '', content_en: '' }
};

const AdminGrowTech: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ title_fr: '', title_en: '', description: '', image_url: '' });

  const fetchData = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    try {
      const { data: configData, error } = await supabase.from('site_config').select('*').eq('key', 'growtech_data').single();
      if (!error && configData?.value_generic) {
        setData(JSON.parse(configData.value_generic));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveData = async (newData: any) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('site_config').upsert({ key: 'growtech_data', value_generic: JSON.stringify(newData) });
      setData(newData);
      onToast('success', 'Données GROW TECH sauvegardées !');
    } catch (e: any) { onToast('error', e.message); }
  };

  const handleAddMember = () => {
    const newMember = { id: Date.now().toString(), ...memberForm };
    saveData({ ...data, members: [...data.members, newMember] });
    setShowMemberForm(false);
    setMemberForm({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });
  };

  const handleRemoveMember = (id: string) => {
    saveData({ ...data, members: data.members.filter((m: any) => m.id !== id) });
  };

  const handleAddProject = () => {
    const newProject = { id: Date.now().toString(), ...projectForm };
    saveData({ ...data, projects: [...data.projects, newProject] });
    setShowProjectForm(false);
    setProjectForm({ title_fr: '', title_en: '', description: '', image_url: '' });
  };

  const handleRemoveProject = (id: string) => {
    saveData({ ...data, projects: data.projects.filter((p: any) => p.id !== id) });
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>

      {/* Logo & Description */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg">Identité & Description</h3>
        <FileUpload label="Logo de l'agence" bucket="portfolio-assets" folder="growtech" currentUrl={data.logo_url} onChange={(url) => saveData({...data, logo_url: url})} accept="image/*" maxSizeMB={5} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea placeholder="Description (FR)" value={data.description_fr} onChange={(e) => saveData({...data, description_fr: e.target.value})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" rows={4} />
          <textarea placeholder="Description (EN)" value={data.description_en} onChange={(e) => saveData({...data, description_en: e.target.value})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" rows={4} />
        </div>
      </div>

      {/* Vision */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-white font-semibold text-lg">Vision de l'agence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Titre Vision (FR)" value={data.vision.title_fr} onChange={(e) => saveData({...data, vision: {...data.vision, title_fr: e.target.value}})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" />
          <input placeholder="Vision Title (EN)" value={data.vision.title_en} onChange={(e) => saveData({...data, vision: {...data.vision, title_en: e.target.value}})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea placeholder="Contenu Vision (FR)" value={data.vision.content_fr} onChange={(e) => saveData({...data, vision: {...data.vision, content_fr: e.target.value}})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" rows={3} />
          <textarea placeholder="Vision Content (EN)" value={data.vision.content_en} onChange={(e) => saveData({...data, vision: {...data.vision, content_en: e.target.value}})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-3 text-white text-sm" rows={3} />
        </div>
      </div>

      {/* Projets Agence */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Projets de l'agence</h3>
          <button onClick={() => setShowProjectForm(!showProjectForm)} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter Projet</button>
        </div>
        <AnimatePresence>
          {showProjectForm && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden border-t border-[#1A1A2E] pt-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Titre (FR)" value={projectForm.title_fr} onChange={e => setProjectForm({...projectForm, title_fr: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Title (EN)" value={projectForm.title_en} onChange={e => setProjectForm({...projectForm, title_en: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              </div>
              <input placeholder="Description courte" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <FileUpload label="Image Projet" bucket="portfolio-assets" folder="growtech-projects" currentUrl={projectForm.image_url} onChange={(url) => setProjectForm({...projectForm, image_url: url})} />
              <button onClick={handleAddProject} className="w-full bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">Enregistrer le projet</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-2">
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="flex items-center justify-between bg-[#141430] p-3 rounded border border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                {proj.image_url && <img src={proj.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                <p className="text-white text-sm">{proj.title_fr} / {proj.title_en}</p>
              </div>
              <button onClick={() => handleRemoveProject(proj.id)} className="text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
          {data.projects.length === 0 && <p className="text-[#4A5568] text-sm italic">Aucun projet ajouté.</p>}
        </div>
      </div>

      {/* Équipe */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Équipe</h3>
          <button onClick={() => setShowMemberForm(!showMemberForm)} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter Membre</button>
        </div>
        <AnimatePresence>
          {showMemberForm && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden border-t border-[#1A1A2E] pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input placeholder="Nom complet" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Initiales (ex: SJ)" value={memberForm.initial} onChange={e => setMemberForm({...memberForm, initial: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Rôle (FR)" value={memberForm.role_fr} onChange={e => setMemberForm({...memberForm, role_fr: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Role (EN)" value={memberForm.role_en} onChange={e => setMemberForm({...memberForm, role_en: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              </div>
              <FileUpload label="Photo Membre" bucket="portfolio-assets" folder="team" currentUrl={memberForm.image_url} onChange={(url) => setMemberForm({...memberForm, image_url: url})} />
              <button onClick={handleAddMember} className="mt-3 w-full bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">Enregistrer le membre</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-2">
          {data.members.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between bg-[#141430] p-3 rounded border border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                {member.image_url ? <img src={member.image_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-[#0A0A1E] flex items-center justify-center text-xs font-bold text-[#00BFFF]">{member.initial}</div>}
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