import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '../hooks/useAdminData';
import { GrowTechData, TeamMember, Project as GrowTechProject, CaseStudyData } from '../types';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';
import ProjectRow from './ProjectRow';

const DEFAULT_DATA: GrowTechData = {
  logo_url: '',
  description_fr: "GROW TECH est une agence digitale estudiantine co-fondée avec Godo Landron. Six personnes. Trois squads. On développe des solutions pour le Bénin et la sous-région OHADA.",
  description_en: "GROW TECH is a student digital agency co-founded with Godo Landron. Six people. Three squads. We build solutions for Benin and the OHADA sub-region.",
  members: [
    { id: '1', name: 'Stane-Junior Aniambossou', role_fr: 'Fondateur & Tech Lead', role_en: 'Founder & Tech Lead', initial: 'SJ', image_url: '', order: 0 },
    { id: '2', name: 'Godo Landron', role_fr: 'Co-fondateur & Biz Dev', role_en: 'Co-founder & Biz Dev', initial: 'GL', image_url: '', order: 1 },
    { id: '3', name: 'Huriel DENAKPO', role_fr: 'Lead Backend', role_en: 'Lead Backend', initial: 'HD', image_url: '', order: 2 },
    { id: '4', name: 'Espanedi', role_fr: 'Lead Frontend', role_en: 'Lead Frontend', initial: 'ES', image_url: '', order: 3 },
    { id: '5', name: 'Expedy', role_fr: 'Sales Manager', role_en: 'Sales Manager', initial: 'EX', image_url: '', order: 4 },
    { id: '6', name: 'OLAFA Mauricia', role_fr: 'Sales Manager', role_en: 'Sales Manager', initial: 'OM', image_url: '', order: 5 },
  ],
  projects: [],
  vision: { title_fr: 'Notre Vision', title_en: 'Our Vision', content_fr: 'Innover pour l\'Afrique.', content_en: 'Innovate for Africa.' }
};

const DEFAULT_CASE_STUDY: CaseStudyData = {
  step1: { title: 'PROBLÈME', content: '' },
  step2: { title: 'SOLUTION', content: '' },
  step3: { title: 'FONCTIONNALITÉS', content: '' },
  step4: { title: 'OBSTACLE', content: '' },
  step5: { title: 'RÉSULTAT', content: '' }
};

const AdminGrowTech: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  // Utilisation du hook pour récupérer les données de site_config
  const { data: configData, loading, saveItem } = useAdminData<any>({
    table: 'site_config',
    filter: { column: 'key', value: 'growtech_data' },
    selectAll: true
  });

  const [data, setData] = useState<GrowTechData>(DEFAULT_DATA);
  
  // States Membres
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', role_fr: '', role_en: '', initial: '', image_url: '' });

  // States Projets
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<GrowTechProject | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title_fr: '', title_en: '', status: 'concept' as const, description: '', stack: '', live_url: '', image_url: '',
    case_study: DEFAULT_CASE_STUDY
  });

  // Charger les données depuis configData
  React.useEffect(() => {
    if (configData.length > 0 && configData[0].value_generic) {
      try {
        const parsed = JSON.parse(configData[0].value_generic);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch (e) {
        console.error('Erreur parsing growtech_data:', e);
      }
    }
  }, [configData]);

  const saveData = async (newData: GrowTechData) => {
    const result = await saveItem({ key: 'growtech_data', value_generic: JSON.stringify(newData) }, configData[0]?.id);
    if (result.success) {
      setData(newData);
      onToast('success', 'Données GROW TECH sauvegardées !');
    } else {
      onToast('error', result.error || 'Erreur lors de la sauvegarde');
    }
  };

  // --- Membres ---
  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, role_fr: member.role_fr, role_en: member.role_en, initial: member.initial, image_url: member.image_url });
    setShowMemberForm(true);
  };

  const handleSaveMember = () => {
    const newMember: TeamMember = {
      id: editingMember ? editingMember.id : Date.now().toString(),
      ...memberForm,
      order: data.members.length
    };

    if (editingMember) {
      const updatedMembers = data.members.map((m) => m.id === editingMember.id ? newMember : m);
      saveData({ ...data, members: updatedMembers });
    } else {
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
    saveData({ ...data, members: data.members.filter((m) => m.id !== id) });
  };

  // --- Projets ---
  const handleOpenEditProject = (project: GrowTechProject) => {
    setEditingProject(project);
    setProjectForm({
      title_fr: project.title_fr,
      title_en: project.title_en,
      status: project.status,
      description: project.description_fr,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || ''),
      live_url: project.live_url,
      image_url: project.image_url,
      case_study: project.case_study_fr || DEFAULT_CASE_STUDY
    });
    setShowProjectForm(true);
  };

  const handleSaveProject = () => {
    const newProjectData: GrowTechProject = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title_fr: projectForm.title_fr,
      title_en: projectForm.title_en,
      status: projectForm.status,
      description_fr: projectForm.description,
      description_en: projectForm.description, // Simplifié pour l'exemple
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
      live_url: projectForm.live_url,
      image_url: projectForm.image_url,
      case_study_fr: projectForm.case_study,
      case_study_en: projectForm.case_study,
      is_visible: true,
      is_featured: false,
      display_order: data.projects.length,
      created_at: new Date().toISOString()
    };

    if (editingProject) {
      const updatedProjects = data.projects.map((p) => p.id === editingProject.id ? newProjectData : p);
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
      case_study: DEFAULT_CASE_STUDY
    });
  };

  const handleRemoveProject = (id: string) => {
    saveData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-bold text-white">Gestion GROW TECH</h2>

      {/* 1. Identité */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Identité & Description</h3>
        <FileUpload label="Logo de l'agence" bucket="portfolio-assets" folder="growtech" currentUrl={data.logo_url} onChange={(url) => saveData({...data, logo_url: url})} accept="image/*" maxSizeMB={5} />
        <BilingualInput label="Description" valueFr={data.description_fr} valueEn={data.description_en} onChangeFr={(v) => saveData({...data, description_fr: v})} onChangeEn={(v) => saveData({...data, description_en: v})} rows={4} />
      </div>

      {/* 2. Vision */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2">Vision</h3>
        <BilingualInput label="Titre" valueFr={data.vision.title_fr} valueEn={data.vision.title_en} onChangeFr={(v) => saveData({...data, vision: {...data.vision, title_fr: v}})} onChangeEn={(v) => saveData({...data, vision: {...data.vision, title_en: v}})} type="input" />
        <BilingualInput label="Contenu" valueFr={data.vision.content_fr} valueEn={data.vision.content_en} onChangeFr={(v) => saveData({...data, vision: {...data.vision, content_fr: v}})} onChangeEn={(v) => saveData({...data, vision: {...data.vision, content_en: v}})} rows={3} />
      </div>

      {/* 3. Projets (Design Unifié) */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
          <h3 className="text-white font-semibold text-lg">Projets de l'agence</h3>
          <button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter Projet</button>
        </div>
        
        <AnimatePresence>
          {showProjectForm && (
            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="overflow-hidden space-y-4 bg-[#0A0A1E] p-4 rounded-xl border border-[#1A1A2E]">
              <div className="flex justify-between items-center mb-2">
                 <h4 className="text-white font-bold text-sm">Éditer Projet</h4>
                 <button type="button" onClick={() => setShowCaseStudy(true)} className="text-xs bg-[#141430] border border-[#00BFFF] text-[#00BFFF] px-3 py-1 rounded hover:bg-[#00BFFF] hover:text-black transition-all">
                   📖 Étude de Cas
                 </button>
              </div>
              
              <BilingualInput label="Titre" valueFr={projectForm.title_fr} valueEn={projectForm.title_en} onChangeFr={(v) => setProjectForm({...projectForm, title_fr: v})} onChangeEn={(v) => setProjectForm({...projectForm, title_en: v})} type="input" />
              <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" rows={2} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Stack (React, Supabase)" value={projectForm.stack} onChange={e => setProjectForm({...projectForm, stack: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <input placeholder="Lien Live" value={projectForm.live_url} onChange={e => setProjectForm({...projectForm, live_url: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value as any})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm">
                  <option value="concept">Concept</option>
                  <option value="in_progress">En cours</option>
                  <option value="delivered">Livré</option>
                </select>
              </div>
              <FileUpload label="Image Projet" bucket="portfolio-assets" folder="growtech-projects" currentUrl={projectForm.image_url} onChange={(url) => setProjectForm({...projectForm, image_url: url})} />
              
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveProject} className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded hover:opacity-90">Enregistrer</button>
                <button onClick={resetProjectForm} className="px-4 bg-[#1A1A2E] text-white rounded hover:bg-red-500 hover:text-white">Annuler</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showCaseStudy && (
           <CaseStudyEditor
            lang="fr"
            data={projectForm.case_study}
            onChange={(data: CaseStudyData) => setProjectForm({...projectForm, case_study: data})}
            onClose={() => setShowCaseStudy(false)}
            onSave={() => { setShowCaseStudy(false); onToast('success', 'Étude de cas sauvegardée'); }}
          />
        )}

        <div className="bg-[#0A0A1E] border border-[#1A1A2E] rounded-2xl overflow-hidden shadow-lg mt-4">
          <div className="flex items-center gap-5 p-4 bg-[#141430] border-b border-[#1A1A2E] text-xs font-bold text-[#4A5568] uppercase tracking-wider">
            <div className="w-14">Image</div>
            <div className="flex-1">Projet</div>
            <div className="hidden md:block w-24 text-center">Statut</div>
            <div className="w-28 text-right">Actions</div>
          </div>

          {data.projects.map((proj: GrowTechProject) => (
             <ProjectRow
              key={proj.id}
              id={proj.id}
              title_fr={proj.title_fr}
              title_en={proj.title_en}
              status={proj.status}
              image_url={proj.image_url}
              stack={proj.stack}
              is_visible={true}
              is_featured={false}
              onEdit={() => handleOpenEditProject(proj)}
              onDelete={() => handleRemoveProject(proj.id)}
              onToggleVisible={() => {}}
              onToggleFeatured={() => {}}
            />
          ))}
          {data.projects.length === 0 && <div className="p-12 text-center text-[#4A5568] italic">Aucun projet.</div>}
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
          {data.members.map((member: TeamMember) => (
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