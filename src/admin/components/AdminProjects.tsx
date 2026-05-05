/**
 * AdminProjects - CRUD avec upload d'images
 */

import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import ImageUpload from './ImageUpload';

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

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        setProjects([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!isSupabaseConfigured()) {
        setError('Supabase non configuré');
        return;
      }

      const stackArray = formData.stack.split(',').map((s: string) => s.trim()).filter(Boolean);

      const projectData = {
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
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        setSuccess('Projet mis à jour !');
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
        setSuccess('Projet créé !');
      }

      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
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
      stack: project.stack ? (Array.isArray(project.stack) ? project.stack.join(', ') : project.stack) : '',
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
    try {
      await supabase.from('projects').delete().eq('id', id);
      setSuccess('Projet supprimé !');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await supabase.from('projects').update({ is_visible: !current }).eq('id', id);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await supabase.from('projects').update({ is_featured: !current }).eq('id', id);
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const config = {
      delivered: { text: 'Livré', color: 'bg-green-500' },
      in_progress: { text: 'En cours', color: 'bg-yellow-500' },
      concept: { text: 'Concept', color: 'bg-gray-500' },
    };
    return config[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion des projets</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau projet
        </button>
      </div>

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">{success}</div>}

      {showForm && (
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image upload */}
            <ImageUpload
              label="Image du projet (aperçu)"
              bucket="portfolio-assets"
              folder="projects"
              currentUrl={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
              onRemove={() => setFormData({ ...formData, image_url: '' })}
              maxSize={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Titre (FR)</label>
                <input type="text" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} required className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-cyan-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Titre (EN)</label>
                <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-cyan-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Statut</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white">
                <option value="concept">Concept</option>
                <option value="in_progress">En cours</option>
                <option value="delivered">Livré</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Description (FR)</label>
                <textarea value={formData.description_fr} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} rows={3} required className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">Description (EN)</label>
                <textarea value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={3} required className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white resize-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Stack (séparée par virgules)</label>
              <input type="text" value={formData.stack} onChange={(e) => setFormData({ ...formData, stack: e.target.value })} placeholder="React, Supabase, TailwindCSS" className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Lien live</label>
              <input type="url" value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">Ordre</label>
              <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full px-4 py-2 glass rounded-lg border border-gray-700 bg-gray-900 text-white" />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4" />
                <span className="text-white">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} className="w-4 h-4" />
                <span className="text-white">Visible</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">{editingProject ? 'Mettre à jour' : 'Créer'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.length === 0 ? (
          <div className="glass-card text-center py-12">
            <p className="text-gray-400">Aucun projet</p>
          </div>
        ) : (
          projects.map((project) => {
            const status = getStatusBadge(project.status);
            return (
              <div key={project.id} className="glass-card">
                <div className="flex items-start gap-4 mb-4">
                  {/* Project Image */}
                  {project.image_url ? (
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                      <img src={project.image_url} alt={project.title_fr} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-lg flex-shrink-0 bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
                      Pas d'image
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{project.title_fr}</h3>
                      <span className={`px-2 py-1 ${status.color} text-white text-xs font-semibold rounded-full`}>{status.text}</span>
                      {project.is_featured && <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">⭐</span>}
                      {!project.is_visible && <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">Caché</span>}
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{project.title_en}</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(project.stack) ? project.stack : project.stack?.split(',').map(s => s.trim()) || []).map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-800 border border-gray-700 text-cyan-400 text-xs rounded-full">{tech}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={() => toggleVisibility(project.id, project.is_visible)} className="p-2 text-gray-400 hover:text-white">{project.is_visible ? '👁' : '🙈'}</button>
                    <button onClick={() => toggleFeatured(project.id, project.is_featured)} className="p-2 text-gray-400 hover:text-yellow-500">⭐</button>
                    <button onClick={() => handleEdit(project)} className="p-2 text-gray-400 hover:text-cyan-400">✏️</button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-500">🗑</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
