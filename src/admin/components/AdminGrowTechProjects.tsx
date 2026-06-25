import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project as GrowTechProject } from '../types';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';

interface AdminGrowTechProjectsProps {
  projects: GrowTechProject[];
  onChange: (projects: GrowTechProject[]) => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

const AdminGrowTechProjects: React.FC<AdminGrowTechProjectsProps> = ({ projects, onChange, onToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<GrowTechProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title_fr: '', title_en: '', status: 'concept' as const, description: '', stack: '', live_url: '', image_url: ''
  });

  const handleOpenEdit = (project: GrowTechProject) => {
    setEditingProject(project);
    setProjectForm({
      title_fr: project.title_fr,
      title_en: project.title_en,
      status: project.status,
      description: project.description_fr,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack || ''),
      live_url: project.live_url || '',
      image_url: project.image_url || ''
    });
    setShowForm(true);
  };

  const handleSaveProject = () => {
    if (!projectForm.title_fr.trim()) {
      onToast('error', 'Le titre est requis');
      return;
    }

    const newProject: GrowTechProject = {
      id: editingProject ? editingProject.id : Date.now().toString(),
      title_fr: projectForm.title_fr.trim(),
      title_en: projectForm.title_en.trim(),
      status: projectForm.status,
      description_fr: projectForm.description,
      description_en: projectForm.description,
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean),
      live_url: projectForm.live_url,
      image_url: projectForm.image_url,
      case_study_fr: editingProject?.case_study_fr || null,
      case_study_en: editingProject?.case_study_en || null,
      is_visible: true,
      is_featured: false,
      display_order: editingProject ? editingProject.display_order : projects.length,
      created_at: editingProject?.created_at || new Date().toISOString()
    };

    let updated: GrowTechProject[];

    if (editingProject) {
      updated = projects.map(p => p.id === editingProject.id ? newProject : p);
      onToast('success', 'Projet modifié (local)');
    } else {
      updated = [...projects, newProject];
      onToast('success', 'Projet ajouté (local)');
    }

    onChange(updated);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setProjectForm({ 
      title_fr: '', title_en: '', status: 'concept', description: '', stack: '', live_url: '', image_url: '' 
    });
  };

  const handleRemove = (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    const updated = projects.filter(p => p.id !== id);
    onChange(updated);
    onToast('success', 'Projet supprimé (local)');
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1A1A2E] pb-2">
        <h3 className="text-white font-semibold text-lg">Projets ({projects.length})</h3>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="text-xs bg-[#00BFFF] text-black px-3 py-1 rounded font-bold"
        >
          + Ajouter un projet
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden space-y-4 bg-[#0A0A1E] p-4 rounded-xl border border-[#1A1A2E]"
          >
            <BilingualInput 
              label="Titre" 
              valueFr={projectForm.title_fr} 
              valueEn={projectForm.title_en} 
              onChangeFr={(v) => setProjectForm({ ...projectForm, title_fr: v })} 
              onChangeEn={(v) => setProjectForm({ ...projectForm, title_en: v })} 
              type="input" 
            />
            
            <textarea 
              placeholder="Description" 
              value={projectForm.description} 
              onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} 
              className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" 
              rows={2} 
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Stack (React, Supabase)" 
                value={projectForm.stack} 
                onChange={e => setProjectForm({ ...projectForm, stack: e.target.value })} 
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" 
              />
              <input 
                placeholder="Lien Live" 
                value={projectForm.live_url} 
                onChange={e => setProjectForm({ ...projectForm, live_url: e.target.value })} 
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" 
              />
              <select 
                value={projectForm.status} 
                onChange={e => setProjectForm({ ...projectForm, status: e.target.value as any })} 
                className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm"
              >
                <option value="concept">Concept</option>
                <option value="in_progress">En cours</option>
                <option value="delivered">Livré</option>
              </select>
            </div>

            <FileUpload 
              label="Image Projet" 
              bucket="portfolio-assets" 
              folder="growtech-projects" 
              currentUrl={projectForm.image_url} 
              onChange={(url) => setProjectForm({ ...projectForm, image_url: url })} 
            />

            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleSaveProject} 
                className="flex-1 bg-[#00BFFF] text-black font-bold py-2 rounded"
              >
                Ajouter / Modifier (brouillon)
              </button>
              <button onClick={resetForm} className="px-4 bg-[#1A1A2E] text-white rounded">Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 mt-4">
        {projects.length === 0 && (
          <div className="text-sm text-[#4A5568] italic py-2">Aucun projet. Les modifications restent locales jusqu'à « Enregistrer ».</div>
        )}
        
        {projects.map((proj) => (
          <div key={proj.id} className="flex items-center justify-between bg-[#141430] rounded-xl p-3">
            <div className="flex items-center gap-3">
              {proj.image_url && (
                <img src={proj.image_url} alt="" className="w-10 h-10 rounded object-cover" />
              )}
              <div>
                <div className="font-medium text-white">{proj.title_fr}</div>
                <div className="text-xs text-[#A8B4C8]">{proj.status} • {proj.stack?.length || 0} tech</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenEdit(proj)} 
                className="text-xs px-3 py-1 bg-[#1A1A2E] rounded hover:bg-[#252545]"
              >
                Modifier
              </button>
              <button 
                onClick={() => handleRemove(proj.id)} 
                className="text-xs px-3 py-1 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGrowTechProjects;
