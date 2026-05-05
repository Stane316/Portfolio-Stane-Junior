import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Project {
  id: string;
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

interface ProjectTableProps {
  projects: Project[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
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

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onRefresh, onToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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

  const resetForm = () => {
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
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }

    try {
      const stackArray = formData.stack.split(',').map((s: string) => s.trim()).filter(Boolean);
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
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title_fr: project.title_fr,
      title_en: project.title_en,
      status: project.status,
      description_fr: project.description_fr,
      description_en: project.description_en,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : project.stack,
      live_url: project.live_url,
      image_url: project.image_url || '',
      display_order: project.display_order,
      is_visible: project.is_visible,
      is_featured: project.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      await supabase.from('projects').delete().eq('id', id);
      onToast('success', 'Projet supprimé !');
      onRefresh();
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const toggleField = async (id: string, field: 'is_visible' | 'is_featured', current: boolean) => {
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      await supabase.from('projects').update({ [field]: !current }).eq('id', id);
      onRefresh();
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const moveOrder = async (id: string, direction: 'up' | 'down') => {
    if (!isSupabaseConfigured()) return;
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    
    const current = projects[idx];
    const target = projects[targetIdx];
    
    try {
      await supabase.from('projects').update({ display_order: target.display_order }).eq('id', current.id);
      await supabase.from('projects').update({ display_order: current.display_order }).eq('id', target.id);
      onRefresh();
    } catch (err: any) {
      onToast('error', err.message);
    }
  };

  const statusConfig = {
    delivered: { label: 'Livré', color: 'bg-green-500 bg-opacity-20 text-green-400' },
    in_progress: { label: 'En cours', color: 'bg-yellow-500 bg-opacity-20 text-yellow-400' },
    concept: { label: 'Concept', color: 'bg-blue-500 bg-opacity-20 text-blue-400' },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Projets ({projects.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card border border-[rgba(0,191,255,0.15)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (FR)</label>
                    <input type="text" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} required className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (EN)</label>
                    <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Statut</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]">
                    <option value="concept">Concept</option>
                    <option value="in_progress">En cours</option>
                    <option value="delivered">Livré</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Description (FR)</label>
                    <textarea value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} rows={2} required className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Description (EN)</label>
                    <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={2} required className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Stack (séparée par virgules)</label>
                    <input type="text" value={formData.stack} onChange={(e) => setFormData({ ...formData, stack: e.target.value })} placeholder="React, Supabase, TailwindCSS" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Lien live</label>
                    <input type="url" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
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

      {/* Table */}
      {projects.length === 0 ? (
        <div className="glass-card text-center py-12">
          <p className="text-[#A8B4C8]">Aucun projet. Créez votre premier projet !</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(0,191,255,0.15)]">
                <th className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Ordre</th>
                <th className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Titre</th>
                <th className="text-left py-3 px-4 text-[#A8B4C8] font-semibold">Statut</th>
                <th className="text-center py-3 px-4 text-[#A8B4C8] font-semibold">Visible</th>
                <th className="text-center py-3 px-4 text-[#A8B4C8] font-semibold">Featured</th>
                <th className="text-right py-3 px-4 text-[#A8B4C8] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const status = statusConfig[project.status];
                return (
                  <tr key={project.id} className="border-b border-[rgba(0,191,255,0.1)] hover:bg-[#141430] hover:bg-opacity-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveOrder(project.id, 'up')} className="text-[#A8B4C8] hover:text-white transition-colors" disabled={projects.indexOf(project) === 0}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <span className="text-center text-[#A8B4C8] font-mono text-xs">{project.display_order}</span>
                        <button onClick={() => moveOrder(project.id, 'down')} className="text-[#A8B4C8] hover:text-white transition-colors" disabled={projects.indexOf(project) === projects.length - 1}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{project.title_fr}</p>
                        <p className="text-[#4A5568] text-xs">{project.title_en}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleField(project.id, 'is_visible', project.is_visible)} className={`relative w-10 h-5 rounded-full transition-colors ${project.is_visible ? 'bg-[#00BFFF]' : 'bg-[#4A5568]'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${project.is_visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleField(project.id, 'is_featured', project.is_featured)} className={`relative w-10 h-5 rounded-full transition-colors ${project.is_featured ? 'bg-yellow-500' : 'bg-[#4A5568]'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${project.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Voir en live">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                        <button onClick={() => handleEdit(project)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Modifier">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-1.5 text-[#A8B4C8] hover:text-red-400 transition-colors" title="Supprimer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;