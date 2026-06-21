import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import ImageUploader from '../ui/ImageUploader';

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
  created_at: string;
}

interface AdminProjectsProps {
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const COLUMNS = [
  { key: 'concept', labelFr: 'Concept', labelEn: 'Concept', color: 'border-gray-500' },
  { key: 'in_progress', labelFr: 'En cours', labelEn: 'In Progress', color: 'border-yellow-500' },
  { key: 'delivered', labelFr: 'Livré', labelEn: 'Delivered', color: 'border-green-500' },
];

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

const AdminProjects: React.FC<AdminProjectsProps> = ({ onToast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title_fr: '', title_en: '', status: 'concept', description_fr: '', description_en: '',
    stack: '', live_url: '', image_url: '', display_order: 0, is_visible: true, is_featured: false,
  });

  const fetchProjects = async () => {
    if (!isSupabaseConfigured()) { setProjects([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setProjects((data as Project[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setFormData({ title_fr: '', title_en: '', status: 'concept', description_fr: '', description_en: '', stack: '', live_url: '', image_url: '', display_order: 0, is_visible: true, is_featured: false });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) { onToast('error', 'Supabase non configuré'); return; }
    try {
      const stackArray = formData.stack.split(',').map((s: string) => s.trim()).filter(Boolean);
      const data = { ...formData, stack: stackArray };
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
      fetchProjects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title_fr: project.title_fr, title_en: project.title_en, status: project.status,
      description_fr: project.description_fr, description_en: project.description_en,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : (project.stack as unknown as string),
      live_url: project.live_url, image_url: project.image_url || '',
      display_order: project.display_order, is_visible: project.is_visible, is_featured: project.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      onToast('success', 'Projet supprimé !');
      fetchProjects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  const moveProject = async (id: string, newStatus: Project['status']) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('projects').update({ status: newStatus }).eq('id', id);
      fetchProjects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  const projectsByStatus = projects.reduce((acc: Record<string, Project[]>, p) => {
    acc[p.status] = [...(acc[p.status] || []), p];
    return acc;
  }, {} as Record<string, Project[]>);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Projets ({projects.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card border border-[rgba(0,191,255,0.15)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">{editingProject ? 'Modifier' : 'Nouveau projet'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (FR)</label>
                    <input type="text" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} required placeholder="Titre" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (EN)</label>
                    <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required placeholder="Title" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Statut</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as FormData['status'] })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]">
                    <option value="concept">Concept</option>
                    <option value="in_progress">En cours</option>
                    <option value="delivered">Livré</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Description (FR)</label>
                    <textarea value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} rows={2} placeholder="Description" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Description (EN)</label>
                    <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={2} placeholder="Description" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Stack</label>
                    <input type="text" value={formData.stack} onChange={(e) => setFormData({ ...formData, stack: e.target.value })} placeholder="React, Supabase" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Lien live</label>
                    <input type="url" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <ImageUploader label="Image du projet" currentUrl={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} onRemove={() => setFormData({ ...formData, image_url: '' })} folder="projects" />
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                  <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" /><span className="text-white text-sm">Featured</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" /><span className="text-white text-sm">Visible</span></label>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.key} className={`glass-card border-t-4 ${col.color} p-4`}>
              <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span>{col.labelFr}</span>
                <span className="text-xs bg-[#141430] text-[#A8B4C8] px-2 py-1 rounded-full">{(projectsByStatus[col.key] || []).length}</span>
              </h3>
              <div className="space-y-3 min-h-[100px]">
                {(projectsByStatus[col.key] || []).map((project) => (
                  <div key={project.id} className="bg-[#141430] bg-opacity-50 rounded-lg p-3 border border-[rgba(0,191,255,0.1)]">
                    {project.image_url && <img src={project.image_url} alt={project.title_fr} className="w-full h-20 object-cover rounded-lg mb-2" />}
                    <h4 className="text-white font-semibold text-sm truncate">{project.title_fr}</h4>
                    <p className="text-[#A8B4C8] text-xs line-clamp-2 mb-2">{project.description_fr}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(Array.isArray(project.stack) ? project.stack : (project.stack as string)?.split(',').map(s => s.trim()) || []).slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-[#0A0A1E] text-cyan-400 text-[10px] rounded-full">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {COLUMNS.filter(c => c.key !== col.key).map(c => (
                        <button key={c.key} onClick={() => moveProject(project.id, c.key as Project['status'])} className="flex-1 px-2 py-1 bg-[#0A0A1E] text-[#A8B4C8] text-[10px] rounded hover:text-white transition-colors" title={`Déplacer vers ${c.labelFr}`}>
                          → {c.labelFr}
                        </button>
                      ))}
                      <button onClick={() => handleEdit(project)} className="p-1 text-[#A8B4C8] hover:text-[#00BFFF]" title="Modifier" aria-label="Modifier le projet">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(project.id, project.title_fr)} className="p-1 text-[#A8B4C8] hover:text-red-400" title="Supprimer" aria-label="Supprimer le projet">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;