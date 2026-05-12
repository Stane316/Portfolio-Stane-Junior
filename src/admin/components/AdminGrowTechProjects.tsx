import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project as GrowTechProject, CaseStudyData } from '../types';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';
import ProjectRow from './ProjectRow';

interface AdminGrowTechProjectsProps {
  projects: GrowTechProject[];
  onSave: (projects: GrowTechProject[]) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

const DEFAULT_CASE_STUDY: CaseStudyData = {
  step1: { title: 'PROBLÈME', content: '' },
  step2: { title: 'SOLUTION', content: '' },
  step3: { title: 'FONCTIONNALITÉS', content: '' },
  step4: { title: 'OBSTACLE', content: '' },
  step5: { title: 'RÉSULTAT', content: '' }
};

const AdminGrowTechProjects: React.FC<AdminGrowTechProjectsProps> = ({ projects, onSave, onToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<GrowTechProject | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title_fr: '', title_en: '', status: 'concept' as const, description: '', stack: '', live_url: '', image_url: '',
    case_study: DEFAULT_CASE_STUDY
  });

  const handleOpenEdit = (project: GrowTechProject) => {
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
    setShowForm(true);
  };

  const handleSaveProject = () => {
    const newProjectData: GrowTechProject = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title_fr: projectForm.title_fr,
      title_en: projectForm.title_en,
      status: projectForm.status,
      description_fr: projectForm.description,
      description_en: projectForm.description,
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
      live_url: projectForm.live_url,
      image_url: projectForm.image_url,
      case_study_fr: projectForm.case_study,
      case_study_en: projectForm.case_study,
      is_visible: true,
      is_featured: false,
      display_order: projects.length,
      created_at: new Date().toISOString()
    };

    if (editingProject) {
      onSave(projects.map((p) => p.id === editingProject.id ? newProjectData : p));
      onToast('success', 'Projet modifié !');
    } else {
      onSave([...projects, newProjectData]);
      onToast('success', 'Projet ajouté !');
    }
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setProjectForm({
      title_fr: '', title_en: '', status: 'concept', description: '', stack: '', live_url: '', image_url: '',
      case_study: DEFAULT_CASE_STUDY
    });
  };

  const handleRemove = (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    onSave(projects.filter((p) => p.id !== id));
    onToast('success', 'Projet supprimé !');
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
        <h3 className="text-white font-semibold text-lg">Projets ({projects.length})</h3>
        <button onClick={() => { resetProjectForm(); setShowForm(true); }} className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold">+ Ajouter Projet</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 bg-[#0A0A1E] p-4 rounded-xl border border-[#1A1A2E]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-bold text-sm">Éditer Projet</h4>
              <button type="button" onClick={() => setShowCaseStudy(true)} className="text-xs bg-[#141430] border border-[#00BFFF] text-[#00BFFF] px-3 py-1 rounded hover:bg-[#00BFFF] hover:text-black transition-all">
                📖 Étude de Cas
              </button>
            </div>

            <BilingualInput label="Titre" valueFr={projectForm.title_fr} valueEn={projectForm.title_en} onChangeFr={(v) => setProjectForm({ ...projectForm, title_fr: v })} onChangeEn={(v) => setProjectForm({ ...projectForm, title_en: v })} type="input" />
            <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Stack (React, Supabase)" value={projectForm.stack} onChange={e => setProjectForm({ ...projectForm, stack: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <input placeholder="Lien Live" value={projectForm.live_url} onChange={e => setProjectForm({ ...projectForm, live_url: e.target.value })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
              <select value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value as any })} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm">
                <option value="concept">Concept</option>
                <option value="in_progress">En cours</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
            <FileUpload label="Image Projet" bucket="portfolio-assets" folder="growtech-projects" currentUrl={projectForm.image_url} onChange={(url) => setProjectForm({ ...projectForm, image_url: url })} />

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
          onChange={(data) => setProjectForm({ ...projectForm, case_study: data })}
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

        {projects.map((proj) => (
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
            onEdit={() => handleOpenEdit(proj)}
            onDelete={() => handleRemove(proj.id)}
            onToggleVisible={() => { }}
            onToggleFeatured={() => { }}
          />
        ))}
        {projects.length === 0 && <div className="p-12 text-center text-[#4A5568] italic">Aucun projet.</div>}
      </div>
    </div>
  );
};

export default AdminGrowTechProjects;