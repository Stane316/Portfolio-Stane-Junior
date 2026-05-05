import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { validateTestimonial } from '../../lib/validation';
import EmptyState from './EmptyState';

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

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  onConfirmDelete: (name: string, onDone: () => void) => void;
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

interface FormErrors {
  [key: string]: string;
}

const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ testimonials, onRefresh, onToast, onConfirmDelete }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
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

  const resetForm = (): void => {
    setFormData({ person_name: '', person_role: '', company: '', content_fr: '', content_en: '', photo_url: '', video_url: '', display_order: 0, is_visible: true });
    setFormErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormErrors({});

    const validation = validateTestimonial({
      person_name: formData.person_name,
      person_role: formData.person_role,
      content_fr: formData.content_fr,
      content_en: formData.content_en,
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
      const data = { ...formData };
      if (editingId) {
        const { error } = await supabase.from('testimonials').update(data).eq('id', editingId);
        if (error) throw error;
        onToast('success', 'Témoignage mis à jour !');
      } else {
        const { error } = await supabase.from('testimonials').insert([data]);
        if (error) throw error;
        onToast('success', 'Témoignage créé !');
      }
      resetForm();
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  const handleEdit = (t: Testimonial): void => {
    setEditingId(t.id);
    setFormData({
      person_name: t.person_name,
      person_role: t.person_role,
      company: t.company || '',
      content_fr: t.content_fr,
      content_en: t.content_en,
      photo_url: t.photo_url || '',
      video_url: t.video_url || '',
      display_order: t.display_order,
      is_visible: t.is_visible,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string): void => {
    onConfirmDelete(name, async () => {
      if (!isSupabaseConfigured()) {
        onToast('error', 'Supabase non configuré');
        return;
      }
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        onToast('success', 'Témoignage supprimé !');
        onRefresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue';
        onToast('error', message);
      }
    });
  };

  const toggleVisible = async (id: string, current: boolean): Promise<void> => {
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      const { error } = await supabase.from('testimonials').update({ is_visible: !current }).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Témoignages ({testimonials.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4" aria-expanded={showForm}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouveau
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card border border-[rgba(0,191,255,0.15)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="test-name" className="block text-sm font-semibold mb-1 text-white">Nom <span className="text-red-400">*</span></label>
                    <input id="test-name" type="text" value={formData.person_name} onChange={(e) => { setFormData({ ...formData, person_name: e.target.value }); setFormErrors({ ...formErrors, person_name: '' }); }} required className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] ${formErrors.person_name ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={!!formErrors.person_name} />
                    {formErrors.person_name && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.person_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="test-role" className="block text-sm font-semibold mb-1 text-white">Rôle <span className="text-red-400">*</span></label>
                    <input id="test-role" type="text" value={formData.person_role} onChange={(e) => { setFormData({ ...formData, person_role: e.target.value }); setFormErrors({ ...formErrors, person_role: '' }); }} required className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] ${formErrors.person_role ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={!!formErrors.person_role} />
                    {formErrors.person_role && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.person_role}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="test-company" className="block text-sm font-semibold mb-1 text-white">Entreprise</label>
                  <input id="test-company" type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="test-content-fr" className="block text-sm font-semibold mb-1 text-white">Contenu (FR) <span className="text-red-400">*</span></label>
                    <textarea id="test-content-fr" value={formData.content_fr} onChange={(e) => { setFormData({ ...formData, content_fr: e.target.value }); setFormErrors({ ...formErrors, content_fr: '' }); }} rows={3} required className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF] ${formErrors.content_fr ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={!!formErrors.content_fr} />
                    {formErrors.content_fr && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.content_fr}</p>}
                  </div>
                  <div>
                    <label htmlFor="test-content-en" className="block text-sm font-semibold mb-1 text-white">Contenu (EN) <span className="text-red-400">*</span></label>
                    <textarea id="test-content-en" value={formData.content_en} onChange={(e) => { setFormData({ ...formData, content_en: e.target.value }); setFormErrors({ ...formErrors, content_en: '' }); }} rows={3} required className={`w-full px-3 py-2 bg-[#141430] border rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF] ${formErrors.content_en ? 'border-red-500' : 'border-[rgba(0,191,255,0.15)]'}`} aria-invalid={!!formErrors.content_en} />
                    {formErrors.content_en && <p className="text-red-400 text-xs mt-1" role="alert">{formErrors.content_en}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="test-photo" className="block text-sm font-semibold mb-1 text-white">Photo URL</label>
                    <input id="test-photo" type="url" value={formData.photo_url} onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label htmlFor="test-video" className="block text-sm font-semibold mb-1 text-white">Vidéo URL</label>
                    <input id="test-video" type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div>
                  <label htmlFor="test-order" className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                  <input id="test-order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" />
                  <span className="text-white text-sm">Visible</span>
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2 px-6">{editingId ? 'Mettre à jour' : 'Créer'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2 px-6">Annuler</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {testimonials.length === 0 ? (
        <EmptyState icon="💬" title="Aucun témoignage" description="Ajoutez des témoignages clients pour renforcer la crédibilité." action={{ label: 'Ajouter un témoignage', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t: Testimonial) => (
            <div key={t.id} className="glass-card border border-[rgba(0,191,255,0.15)]">
              <div className="flex items-start gap-3 mb-3">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.person_name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{t.person_name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold">{t.person_name}</h4>
                  <p className="text-[#00BFFF] text-sm">{t.person_role}</p>
                  {t.company && <p className="text-[#4A5568] text-xs">{t.company}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(t.id, t.is_visible)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" aria-label={t.is_visible ? 'Masquer' : 'Afficher'}>{t.is_visible ? '👁' : '🙈'}</button>
                  <button onClick={() => handleEdit(t)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" aria-label="Modifier">✏️</button>
                  <button onClick={() => handleDelete(t.id, t.person_name)} className="p-1.5 text-[#A8B4C8] hover:text-red-400 transition-colors" aria-label="Supprimer">🗑</button>
                </div>
              </div>
              <p className="text-[#A8B4C8] text-sm italic">"{t.content_fr.substring(0, 120)}..."</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;