import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';
import { useLanguage } from '../../contexts/LanguageContext';

// Données par défaut avec structure complète
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
  vision: { title_fr: 'Notre Vision', title_en: 'Our Vision', content_fr: 'Innover pour l\'Afrique.', content_en: 'Innovate for Africa.' }
};

const AdminGrowTech: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(DEFAULT_DATA);
  
  // States pour les formulaires
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  // Structure projet complète
  const [showCaseStudyEditor, setShowCaseStudyEditor] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title_fr: '', title_en: '', status: 'concept', description: '', stack: '', live_url: '', image_url: '',
    case_study: {
      step1: { title: 'PROBLÈME', content: '' },
      step2: { title: 'SOLUTION', content: '' },
      step3: { title: 'FONCTIONNALITÉS', content: '' },
      step4: { title: 'OBSTACLE', content: '' },
      step5: { title: 'RÉSULTAT', content: '' }
    }
  });
  const { lang } = useLanguage();

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

  // --- MEMBRES ---
  const handleOpenEditMember = (member: any) => {
    setEditingMember(member);
    setMemberForm(member);
    setShowMemberForm(true);
  };

  const handleSaveMember = () => {
    if (editingMember) {
      const updatedMembers = data.members.map((m: any) => m.id === editingMember.id ? { ...memberForm, id: editingMember.id } : m);
      saveData({ ...data, members: updatedMembers });
    } else {
      const newMember = { id: Date.now().toString(), ...memberForm };
      saveData({ ...data, members: [...data.members, newMember] });
    }
    resetMemberForm();
  };

  const resetMemberForm = () => {
    setShowMemberForm(false);
    setEditingMember(null);
    setMemberForm({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });
  };

  const handleRemoveMember = (id: string) => {
    saveData({ ...data, members: data.members.filter((m: any) => m.id !== id) });
  };

  // --- PROJETS ---
  const handleOpenEditProject = (project: any) => {
    setEditingProject(project);
    // Assurer que la structure case_study est correcte même pour les anciens projets
    const defaultCS = {
      step1: { title: 'PROBLÈME', content: '' },
      step2: { title: 'SOLUTION', content: '' },
      step3: { title: 'FONCTIONNALITÉS', content: '' },
      step4: { title: 'OBSTACLE', content: '' },
      step5: { title: 'RÉSULTAT', content: '' }
    };
    setProjectForm({
      ...project,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || ''),
      case_study: project.case_study || defaultCS
    });
    setShowProjectForm(true);
  };

  const handleSaveProject = () => {
    const newProjectData = {
      ...projectForm,
      id: editingProject ? editingProject.id : Date.now().toString(),
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingProject) {
      const updatedProjects = data.projects.map((p: any) => p.id === editingProject.id ? newProjectData : p);
      saveData({ ...data, projects: updatedProjects });
    } else {
      saveData({ ...data, projects: [...data.projects, newProjectData] });
    }
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectForm({
      title_fr: '', title_en: '', status: 'concept', description: '', stack: '', live_url: '', image_url: '',
      case_study: {
        step1: { title: 'PROBLÈME', content: '' },
        step2: { title: 'SOLUTION', content: '' },
        step3: { title: 'FONCTIONNALITÉS', content: '' },
        step4: { title: 'OBSTACLE', content: '' },
        step5: { title: 'RÉSULTAT', content: '' }
      }
    });
  };

  const handleRemoveProject = (id: string) => {
    saveData({ ...data, projects: data.projects.filter((p: any) => p.id !== id) });
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>

      {/* 1. Identité */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Identité & Description</h3>
        <FileUpload label="Logo de l'agence" bucket="portfolio-assets" folder="growtech" currentUrl={data.logo_url} onChange={(url) => saveData({...data, logo_url: url})} accept="image/*" maxSizeMB={5} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualInput 
            label="Description de l'agence"
            valueFr={data.description_fr}
            valueEn={data.description_en}
            onChangeFr={(val) => saveData({...data, description_fr: val})}
            onChangeEn={(val) => saveData({...data, description_en: val})}
            rows={4}
          />
        </div>
      </div>

      {/* 2. Vision */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Vision</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualInput 
              label="Titre de la Vision"
              valueFr={data.vision.title_fr}
              valueEn={data.vision.title_en}
              onChangeFr={(val) => saveData({...data, vision: {...data.vision, title_fr: val}})}
              onChangeEn={(val) => saveData({...data, vision: {...data.vision, title_en: val}})}
              type="input"
           />

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualInput 
             label="Contenu de la Vision"
             valueFr={data.vision.content_fr}
             valueEn={data.vision.content_en}
             onChangeFr={(val) => saveData({...data, vision: {...data.vision, content_fr: val}})}
             onChangeEn={(val) => saveData({...data, vision: {...data.vision, content_en: val}})}
             rows={3}
          />
        </div>
      </div>

      {/* 3. Projets (Structure Complète) */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
          <h3 className="text-white font-semibold text-lg">Projets de l'agence</h3>
          <button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter / Modifier Projet</button>
        </div>
        
        <AnimatePresence>
          {showProjectForm && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden space-y-4 bg-[#0A0A1E] p-4 rounded-xl border border-[#1A1A2E]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BilingualInput 
                   label="Titre du Projet"
                   valueFr={projectForm.title_fr}
                   valueEn={projectForm.title_en}
                   onChangeFr={(val) => setProjectForm({...projectForm, title_fr: val})}
                   onChangeEn={(val) => setProjectForm({...projectForm, title_en: val})}
                   type="input"
                />
                <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm">
                  <option value="concept">Concept</option>
                  <option value="in_progress">En cours</option>
                  <option value="delivered">Livré</option>
                </select>
                <input placeholder="Lien Live (URL)" value={projectForm.live_url} onChange={e => setProjectForm({...projectForm, live_url: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              </div>
              <BilingualInput 
                 label="Description du Projet"
                 valueFr={projectForm.description}
                 valueEn={projectForm.description_en || ''} // Assure-toi que description_en existe dans le state
                 onChangeFr={(val) => setProjectForm({...projectForm, description: val})}
                 onChangeEn={(val) => setProjectForm({...projectForm, description_en: val})}
                 rows={3}
              />
              <input placeholder="Stack (ex: React, Supabase)" value={projectForm.stack} onChange={e => setProjectForm({...projectForm, stack: e.target.value})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              
              <FileUpload label="Image Projet" bucket="portfolio-assets" folder="growtech-projects" currentUrl={projectForm.image_url} onChange={(url) => setProjectForm({...projectForm, image_url: url})} />

            {/* Étude de cas */}
            <div className="border-t border-[#1A1A2E] pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-white font-bold text-sm">Étude de Cas (5 Étapes)</h4>
                   <button 
                      type="button"
                      onClick={() => setShowCaseStudyEditor(true)} 
                      className="text-xs bg-[#141430] border border-[#00BFFF] text-[#00BFFF] px-3 py-1 rounded hover:bg-[#00BFFF] hover:text-black transition-all"
                    >
                      Ouvrir l'éditeur visuel
                   </button>
               </div>
               <p className="text-[#4A5568] text-xs italic">Cliquez pour structurer les 5 étapes avec le design amélioré.</p>
           </div>

            {/* Modal Éditeur */}
            {showCaseStudyEditor && (
              <CaseStudyEditor
                 lang={lang}
                 data={projectForm.case_study}
                 onChange={(newData) => setProjectForm({...projectForm, case_study: newData})}
                 onClose={() => setShowCaseStudyEditor(false)}
                 onSave={() => {
                      setShowCaseStudyEditor(false);
                      onToast('info', 'Étude de cas mise à jour');
                 }}
               />
           )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveProject} className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">{editingProject ? 'Modifier le projet' : 'Enregistrer le projet'}</button>
                <button onClick={resetProjectForm} className="px-4 bg-[#1A1A2E] text-white rounded hover:bg-red-500 hover:text-white">Annuler</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste Projets */}
        <div className="space-y-3">
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="flex items-center justify-between bg-[#141430] p-3 rounded border border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                {proj.image_url && <img src={proj.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                <div>
                  <p className="text-white text-sm font-medium">{proj.title_fr}</p>
                  <p className="text-[#4A5568] text-xs">{proj.status} · {Array.isArray(proj.stack) ? proj.stack.length : 0} technos</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEditProject(proj)} className="text-[#00BFFF] hover:text-white text-xs font-bold">✏️ Éditer</button>
                <button onClick={() => handleRemoveProject(proj.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
              </div>
            </div>
          ))}
          {data.projects.length === 0 && <p className="text-[#4A5568] text-sm italic">Aucun projet ajouté.</p>}
        </div>
      </div>

      {/* 4. Équipe */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
          <h3 className="text-white font-semibold text-lg">Équipe</h3>
          <button onClick={() => { resetMemberForm(); setShowMemberForm(true); }} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter / Modifier</button>
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
              <div className="flex gap-3 mt-3">
                <button onClick={handleSaveMember} className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">{editingMember ? 'Modifier' : 'Enregistrer'}</button>
                {editingMember && <button onClick={resetMemberForm} className="px-4 bg-[#1A1A2E] text-white rounded">Annuler</button>}
              </div>
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
              <div className="flex gap-2">
                <button onClick={() => handleOpenEditMember(member)} className="text-[#00BFFF] hover:text-white text-xs">✏️</button>
                <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminGrowTech;