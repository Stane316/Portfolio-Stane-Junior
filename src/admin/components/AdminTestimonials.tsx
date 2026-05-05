/**
 * Admin Testimonials Component
 * 
 * CRUD complet pour la gestion des témoignages.
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface Testimonial {
  id: string;
  person_name: string;
  person_role: string;
  company: string;
  content_fr: string;
  content_en: string;
  photo_url: string;
  video_url: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

interface FormData {
  person_name: string;
  person_role: string;
  company: string;
  content_fr: string;
  content_en: string;
  photo_url: string;
  video_url: string;
  display_order: number;
  is_visible: boolean;
}

const AdminTestimonials: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    person_name: '',
    person_role: '',
    company: '',
    content_fr: '',
    content_en: '',
    photo_url: '',
    video_url: '',
    display_order: 0,
    is_visible: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setFormData({
      person_name: '',
      person_role: '',
      company: '',
      content_fr: '',
      content_en: '',
      photo_url: '',
      video_url: '',
      display_order: 0,
      is_visible: true,
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const testimonialData = {
        person_name: formData.person_name,
        person_role: formData.person_role,
        company: formData.company,
        content_fr: formData.content_fr,
        content_en: formData.content_en,
        photo_url: formData.photo_url,
        video_url: formData.video_url,
        display_order: formData.display_order,
        is_visible: formData.is_visible,
      };

      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingId);

        if (error) throw error;
        setSuccess(isFr ? 'Témoignage mis à jour !' : 'Testimonial updated!');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);

        if (error) throw error;
        setSuccess(isFr ? 'Témoignage créé !' : 'Testimonial created!');
      }

      resetForm();
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      person_name: testimonial.person_name,
      person_role: testimonial.person_role,
      company: testimonial.company || '',
      content_fr: testimonial.content_fr,
      content_en: testimonial.content_en,
      photo_url: testimonial.photo_url || '',
      video_url: testimonial.video_url || '',
      display_order: testimonial.display_order,
      is_visible: testimonial.is_visible,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isFr ? 'Supprimer ce témoignage ?' : 'Delete this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setSuccess(isFr ? 'Témoignage supprimé !' : 'Testimonial deleted!');
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      await supabase.from('testimonials').update({ is_visible: !current }).eq('id', id);
      fetchTestimonials();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">
          {isFr ? 'Gestion des témoignages' : 'Testimonials Management'}
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isFr ? 'Nouveau témoignage' : 'New Testimonial'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400">{error}</div>}
      {success && <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-400">{success}</div>}

      {showForm && (
        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? (isFr ? 'Modifier' : 'Edit') : (isFr ? 'Nouveau témoignage' : 'New Testimonial')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Nom' : 'Name'}</label>
                <input type="text" value={formData.person_name} onChange={(e) => setFormData({ ...formData, person_name: e.target.value })} required className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Rôle/Poste' : 'Role'}</label>
                <input type="text" value={formData.person_role} onChange={(e) => setFormData({ ...formData, person_role: e.target.value })} required className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Entreprise' : 'Company'}</label>
              <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Témoignage (FR)' : 'Testimonial (FR)'}</label>
                <textarea value={formData.content_fr} onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })} rows={4} required className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Témoignage (EN)' : 'Testimonial (EN)'}</label>
                <textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={4} required className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)] resize-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'URL Photo' : 'Photo URL'}</label>
              <input type="url" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'URL Vidéo (YouTube/Vimeo)' : 'Video URL'}</label>
              <input type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://..." className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">{isFr ? 'Ordre' : 'Order'}</label>
              <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full px-4 py-2 glass rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-white focus:outline-none focus:border-[var(--accent-cyan)]" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} className="w-4 h-4" />
              <span className="text-white">{isFr ? 'Visible' : 'Visible'}</span>
            </label>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary">{editingId ? (isFr ? 'Mettre à jour' : 'Update') : (isFr ? 'Créer' : 'Create')}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">{isFr ? 'Annuler' : 'Cancel'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {testimonials.length === 0 ? (
          <div className="glass-card text-center py-12">
            <p className="text-[var(--text-secondary)]">{isFr ? 'Aucun témoignage' : 'No testimonials'}</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{testimonial.person_name}</h3>
                    {!testimonial.is_visible && <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">{isFr ? 'Caché' : 'Hidden'}</span>}
                  </div>
                  <p className="text-[var(--accent-cyan)] text-sm mb-1">{testimonial.person_role}</p>
                  {testimonial.company && <p className="text-[var(--text-secondary)] text-sm mb-2">{testimonial.company}</p>}
                  <p className="text-[var(--text-secondary)] text-sm italic">"{testimonial.content_fr.substring(0, 100)}..."</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleVisibility(testimonial.id, testimonial.is_visible)} className="p-2 text-[var(--text-secondary)] hover:text-white">{testimonial.is_visible ? '👁' : '🙈'}</button>
                  <button onClick={() => handleEdit(testimonial)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)]">✏️</button>
                  <button onClick={() => handleDelete(testimonial.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500">🗑</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
