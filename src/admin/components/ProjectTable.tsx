import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { validateProject } from '../../lib/validation';
import CaseStudyEditor from './CaseStudyEditor';

interface CaseStudyData {
  [key: string]: { title: string; content: string };
}

interface Project {
  id: string;
  title_fr: string;
  title_en: string;
  status: 'delivered' | 'in_progress' | 'concept';
  description_fr: string;
  description_en: string;
  stack: string[];
  live_url: string;
  image_url: string;
  case_study_fr: CaseStudyData;
  case_study_en: CaseStudyData;
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
}

interface ProjectTableProps {
  projects: Project[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  onConfirmDelete: (name: string, onDone: () => void) => void;
}

interface FormData {
  title_fr: string;
  title_en: string;
  status: 'delivered' | 'in_progress' | 'concept';
  description_fr: string;
  description_en: string;
  stack: string;
  live_url: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onRefresh, onToast, onConfirmDelete }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title_fr: '',
    title_en: '',
    status: 'concept',
    description_fr: '',
    description_en: '',
    stack: '',
    live_url: '',
    image_url: '',
    display_order: 0,
    is_visible: true,
    is_featured: false,
  });

  const resetForm = (): void => {
    setFormData({
      title_fr: '',
      title_en: '',
      status: 'concept',
      description_fr: '',
      description_en: '',
      stack: '',
      live_url: '',
      image_url: '',
      display_order: 0,
      is_visible: true,
      is_featured: false,
    });
    setFormErrors({});
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormErrors({});

    const validation = validateProject({
      title_fr: formData.title_fr,
      title_en: formData.title_en,
      description_fr: formData.description_fr,
      description_en: formData.description_en,
      live_url: formData.live_url,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      onToast('error', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }

    try {
      const stackArray: string[] = formData.stack.split(',').map((s: string) => s.trim()).filter(Boolean);
      const data = {
        title_fr: formData.title_fr,
        title_en: formData.title_en,
        status: formData.status,
        description_fr: formData.description_fr,
        description_en: formData.description_en,
        stack: stackArray,
        live_url: formData.live_url,
        image_url: formData.image_url,
        display_order: formData.display_order,
        is_visible: formData.is_visible,
        is_featured: formData.is_featured,
      };

      if (editingProject) {
        const { error } = await supabase.from('projects').update(data).eq('id', editingProject.id);
        if (error) throw error;
        onToast('success', 'Projet mis à jour !');
      } else {
        const { error } = await supabase.from('projects').insert([data]);
        if (error) throw error;
        onToast('success', 'Projet créé !');
      }
      resetForm();
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  const handleEdit = (project: Project): void => {
    setEditingProject(project);
    setFormData({
      title_fr: project.title_fr,
      title_en: project.title_en,
      status: project.status,
      description_fr: project.description_fr,
      description_en: project.description_en,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
      live_url: project.live_url,
      image_url: project.image_url || '',
      display_order: project.display_order,
      is_visible: project.is_visible,
      is_featured: project.is_featured,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = (id: string, title: string): void => {
    onConfirmDelete(title, async () => {
      if (!isSupabaseConfigured()) {
        onToast('error', 'Supabase non configuré');
        return;
      }
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        onToast('success', 'Projet supprimé !');
        onRefresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        onToast('error', message);
      }
    });
  };

  const toggleField = async (id: string, field: 'is_visible' | 'is_featured', current: boolean): Promise<void> => {
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      const { error } = await supabase.from('projects').update({ [field]: !current }).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  const moveOrder = async (id: string, direction: 'up' | 'down'): Promise<void> => {
    if (!isSupabaseConfigured()) return;
    const idx: number = projects.findIndex((p: Project) => p.id === id);
    if (idx === -1) return;
    const targetIdx: number = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    
    const current: Project = projects[idx];
    const target: Project = projects[targetIdx];
    
    try {
      await supabase.from('projects').update({ display_order: target.display_order }).eq('id', current.id);
      await supabase.from('projects').update({ display_order: current.display_order }).eq('id', target.id);
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    delivered: { label: 'Livré', color: 'bg-green-500 bg-opacity-20 text-green-400' },
    in_progress: { label: 'En cours', color: 'bg-yellow-500 bg-opacity-20 text-yellow-400' },
    concept: { label: 'Concept', color: 'bg-blue-500 bg-opacity-20 text-blue-400' },
  };

  const currentCaseStudyProject: Project | undefined = projects.find((p: Project) => p.id === showCaseStudy);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Projets ({projects.length})</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4"
          aria-expanded={showForm}
          aria-controls="project-form"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div id="project-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card border border-[rgba(0,191,255,0.15)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-title-fr" className="block text-sm font-semibold mb-1 text-white">Titre (FR) <span className="text-red-400">*</span></label>
                    <input id="project-title-fr" type="text" value={formData.title_fr} onChange={(e) => { setFormData({ ...formData, title_fr: e.target.value }); setFormErrors({ ...formErrors, title_fr: '' }); }} required placeholder="Titre du projet" className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] ${formErrors.title_fr ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={formErrors.title_fr ? true : undefined} aria-describedby={formErrors.title_fr ? 'error-title-fr' : undefined} />
                    {formErrors.title_fr && <p id="error-title-fr" className="text-red-400 text-xs mt-1" role="alert">{formErrors.title_fr}</p>}
                  </div>
                  <div>
                    <label htmlFor="project-title-en" className="block text-sm font-semibold mb-1 text-white">Titre (EN) <span className="text-red-400">*</span></label>
                    <input id="project-title-en" type="text" value={formData.title_en} onChange={(e) => { setFormData({ ...formData, title_en: e.target.value }); setFormErrors({ ...formErrors, title_en: '' }); }} required placeholder="Project title" className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] ${formErrors.title_en ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={formErrors.title_en ? true : undefined} />
                    {formErrors.title_en && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.title_en}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="project-status" className="block text-sm font-semibold mb-1 text-white">Statut</label>
                  <select id="project-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as FormData['status'] })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]">
                    <option value="concept">Concept</option>
                    <option value="in_progress">En cours</option>
                    <option value="delivered">Livré</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-desc-fr" className="block text-sm font-semibold mb-1 text-white">Description (FR) <span className="text-red-400">*</span></label>
                    <textarea id="project-desc-fr" value={formData.description_fr} onChange={(e) => { setFormData({ ...formData, description_fr: e.target.value }); setFormErrors({ ...formErrors, description_fr: '' }); }} rows={2} required placeholder="Description du projet" className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF] ${formErrors.description_fr ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={formErrors.description_fr ? true : undefined} />
                    {formErrors.description_fr && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.description_fr}</p>}
                  </div>
                  <div>
                    <label htmlFor="project-desc-en" className="block text-sm font-semibold mb-1 text-white">Description (EN) <span className="text-red-400">*</span></label>
                    <textarea id="project-desc-en" value={formData.description_en} onChange={(e) => { setFormData({ ...formData, description_en: e.target.value }); setFormErrors({ ...formErrors, description_en: '' }); }} rows={2} required placeholder="Project description" className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF] ${formErrors.description_en ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={formErrors.description_en ? true : undefined} />
                    {formErrors.description_en && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.description_en}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="project-stack" className="block text-sm font-semibold mb-1 text-white">Stack (virgules)</label>
                    <input id="project-stack" type="text" value={formData.stack} onChange={(e) => setFormData({ ...formData, stack: e.target.value })} placeholder="React, Supabase" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label htmlFor="project-url" className="block text-sm font-semibold mb-1 text-white">Lien live</label>
                    <input id="project-url" type="url" value={formData.live_url} onChange={(e) => { setFormData({ ...formData, live_url: e.target.value }); setFormErrors({ ...formErrors, live_url: '' }); }} placeholder="https://..." className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] ${formErrors.live_url ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={formErrors.live_url ? true : undefined} />
                    {formErrors.live_url && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.live_url}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="project-image" className="block text-sm font-semibold mb-1 text-white">Image URL</label>
                  <input id="project-image" type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div>
                  <label htmlFor="project-order" className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                  <input id="project-order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" />
                    <span className="text-white text-sm">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" />
                    <span className="text-white text-sm">Visible</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2 px-6">{editingProject ? 'Mettre à jour' : 'Créer'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2 px-6">Annuler</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {projects.length === 0 ? (
        <div className="glass-card text-center py-12"><p className="text-[#A8B4C8]">Aucun projet. Créez votre premier projet !</p></div>
      ) : (
        <div className="overflow-x-auto" role="table" aria-label="Liste des projets">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(0,191,255,0.15)]">
                <th scope="col" className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Ordre</th>
                <th scope="col" className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Titre</th>
                <th scope="col" className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Statut</th>
                <th scope="col" className="text-center py-3 px-4 text-[#A8B4C8] font-semibold">Visible</th>
                <th scope="col" className="text-center py-3 px-4 text-[#A8B4C8] font-semibold">Featured</th>
                <th scope="col" className="text-right py-3 px-4 text-[#A8B4C8] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project: Project) => {
                const status = statusConfig[project.status];
                return (
                  <tr key={project.id} className="border-b border-[rgba(0,191,255,0.1)] hover:bg-[#141430] hover:bg-opacity-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveOrder(project.id, 'up')} className="text-[#A8B4C8] hover:text-white transition-colors" disabled={projects.indexOf(project) === 0} aria-label="Monter le projet">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <span className="text-center text-[#A8B4C8] font-mono text-xs">{project.display_order}</span>
                        <button onClick={() => moveOrder(project.id, 'down')} className="text-[#A8B4C8] hover:text-white transition-colors" disabled={projects.indexOf(project) === projects.length - 1} aria-label="Descendre le projet">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div><p className="text-white font-medium">{project.title_fr}</p><p className="text-[#4A5568] text-xs">{project.title_en}</p></div>
                    </td>
                    <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span></td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => toggleField(project.id, 'is_visible', project.is_visible)} 
                        className={`relative w-10 h-5 rounded-full transition-colors ${project.is_visible ? 'bg-[#00BFFF]' : 'bg-[#4A5568]'}`} 
                        role="switch" 
                        aria-checked={project.is_visible} 
                        aria-label={`Marquer comme ${project.is_visible ? 'caché' : 'visible'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${project.is_visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => toggleField(project.id, 'is_featured', project.is_featured)} 
                        className={`relative w-10 h-5 rounded-full transition-colors ${project.is_featured ? 'bg-yellow-500' : 'bg-[#4A5568]'}`} 
                        role="switch" 
                        aria-checked={project.is_featured}
                        aria-label={`Marquer comme ${project.is_featured ? 'non featured' : 'featured'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${project.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setShowCaseStudy(project.id)} className="p-1.5 text-[#A8B4C8] hover:text-yellow-400 transition-colors" title="Étude de cas" aria-label="Voir l'étude de cas">📖</button>
                        {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Voir en live" aria-label="Voir le projet en live"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>}
                        <button onClick={() => handleEdit(project)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Modifier" aria-label="Modifier le projet"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => handleDelete(project.id, project.title_fr)} className="p-1.5 text-[#A8B4C8] hover:text-red-400 transition-colors" title="Supprimer" aria-label="Supprimer le projet"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showCaseStudy && currentCaseStudyProject && (
          <CaseStudyEditor
            projectId={showCaseStudy}
            onClose={() => setShowCaseStudy(null)}
            onToast={onToast}
            initialData={{ fr: currentCaseStudyProject.case_study_fr, en: currentCaseStudyProject.case_study_en }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectTable;