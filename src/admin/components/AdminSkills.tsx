/**
 * AdminSkills — Interface visuelle d'édition des compétences
 *
 * Remplace le JSON brut par des cartes drag-and-drop
 * avec ajout, modification, suppression et réorganisation.
 * 
 * Utilise le hook useDebouncedSave pour l'auto-save.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useDebouncedSave } from '../hooks/useDebouncedSave';

// ============================================================
// Types
// ============================================================

interface SkillItem {
  name: string;
  level: number;       // 0-100
  category: 'mastered' | 'learning' | 'basics';
  context_fr: string;
  context_en: string;
}

type CategoryKey = 'mastered' | 'learning' | 'basics';

interface AdminSkillsProps {
  onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
}

// ============================================================
// Category configuration
// ============================================================

const CATEGORIES: Record<CategoryKey, { label: string; color: string; dotColor: string; description: string }> = {
  mastered: {
    label: 'Maîtrisé',
    color: 'text-[#00BFFF]',
    dotColor: 'bg-[#00BFFF]',
    description: 'Technologies utilisées en production quotidiennement',
  },
  learning: {
    label: 'En apprentissage actif',
    color: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
    description: 'En cours d\'apprentissage avec projets réels',
  },
  basics: {
    label: 'Notions',
    color: 'text-[#718096]',
    dotColor: 'bg-[#718096]',
    description: 'Connaissances de base, projets exploratoires',
  },
};

// ============================================================
// Main Component
// ============================================================

const AdminSkills: React.FC<AdminSkillsProps> = ({ onToast }) => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [honestyFr, setHonestyFr] = useState('');
  const [honestyEn, setHonestyEn] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<SkillItem>({
    name: '',
    level: 50,
    category: 'learning',
    context_fr: '',
    context_en: '',
  });

  // ============================================
  // Fetch data
  // ============================================
  const fetchSkills = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSkills(DEFAULT_SKILLS);
      setHonestyFr('Je travaille avec une approche honnête : je ne liste que ce que je peux défendre et expliquer.');
      setHonestyEn('I work with an honest approach: I only list what I can defend and explain.');
      setLoading(false);
      return;
    }
    try {
      const [skillsRes, honestyRes] = await Promise.all([
        supabase.from('site_config').select('*').eq('key', 'skills_data').single(),
        supabase.from('site_config').select('*').eq('key', 'skills_honesty').single(),
      ]);

      if (skillsRes.data?.value_generic) {
        try {
          const parsed = JSON.parse(skillsRes.data.value_generic);
          setSkills(Array.isArray(parsed) ? parsed : DEFAULT_SKILLS);
        } catch {
          setSkills(DEFAULT_SKILLS);
        }
      }

      if (honestyRes.data) {
        setHonestyFr(honestyRes.data.value_fr || '');
        setHonestyEn(honestyRes.data.value_en || '');
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
      setSkills(DEFAULT_SKILLS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // ============================================
  // Save all skills to Supabase
  // ============================================
  const saveSkills = async (newSkills: SkillItem[]) => {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('site_config').upsert({
        key: 'skills_data',
        value_generic: JSON.stringify(newSkills),
        value_fr: null,
        value_en: null,
      });
      if (error) throw error;
    } catch (err) {
      onToast('error', 'Erreur lors de la sauvegarde');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveHonesty = async (fr: string, en: string) => {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('site_config').upsert({
        key: 'skills_honesty',
        value_fr: fr,
        value_en: en,
        value_generic: null,
      });
      if (error) throw error;
    } catch (err) {
      onToast('error', 'Erreur lors de la sauvegarde');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // CRUD handlers
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onToast('warning', 'Le nom de la compétence est requis');
      return;
    }

    let newSkills: SkillItem[];
    if (editingIndex !== null) {
      newSkills = skills.map((s, i) => (i === editingIndex ? formData : s));
      onToast('success', 'Compétence modifiée !');
    } else {
      newSkills = [...skills, formData];
      onToast('success', 'Compétence ajoutée !');
    }

    setSkills(newSkills);
    await saveSkills(newSkills);
    resetForm();
  };

  const handleDelete = async (index: number) => {
    const name = skills[index].name;
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    await saveSkills(newSkills);
    onToast('success', `"${name}" supprimée`);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= skills.length) return;
    const newSkills = [...skills];
    [newSkills[index], newSkills[newIndex]] = [newSkills[newIndex], newSkills[index]];
    setSkills(newSkills);
    await saveSkills(newSkills);
  };

  const resetForm = () => {
    setFormData({ name: '', level: 50, category: 'learning', context_fr: '', context_en: '' });
    setEditingIndex(null);
    setShowForm(false);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...skills[index] });
    setShowForm(true);
  };

  // ============================================
  // Debounced honesty save
  // ============================================
  const debouncedSaveHonesty = useDebouncedSave(
    async (val: string) => { await saveHonesty(val, honestyEn); },
    honestyFr,
    1000
  );

  // ============================================
  // Render
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const skillsByCategory = (cat: CategoryKey) => skills.filter((s) => s.category === cat);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Compétences</h2>
          <p className="text-[#A8B4C8] text-sm mt-1">{skills.length} compétences configurées</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="flex items-center gap-2 text-[#00BFFF] text-sm">
              <div className="w-3 h-3 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
              Sauvegarde...
            </span>
          )}
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {editingIndex !== null ? 'Modifier' : 'Ajouter'} une compétence
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="skill-name" className="block text-sm font-semibold text-white mb-1">Nom *</label>
                    <input
                      id="skill-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="React, TypeScript..."
                      className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="skill-category" className="block text-sm font-semibold text-white mb-1">Catégorie</label>
                    <select
                      id="skill-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryKey })}
                      className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]"
                    >
                      <option value="mastered">Maîtrisé</option>
                      <option value="learning">En apprentissage</option>
                      <option value="basics">Notions</option>
                    </select>
                  </div>
                </div>

                {/* Level slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="skill-level" className="text-sm font-semibold text-white">Niveau</label>
                    <span className={`text-sm font-bold ${CATEGORIES[formData.category].color}`}>{formData.level}%</span>
                  </div>
                  <input
                    id="skill-level"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#141430] rounded-lg appearance-none cursor-pointer accent-[#00BFFF]"
                  />
                  <div className="flex justify-between text-[10px] text-[#4A5568] mt-1">
                    <span>Débutant</span>
                    <span>Intermédiaire</span>
                    <span>Avancé</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="skill-context-fr" className="block text-sm font-semibold text-white mb-1">Contexte (FR)</label>
                    <input
                      id="skill-context-fr"
                      type="text"
                      value={formData.context_fr}
                      onChange={(e) => setFormData({ ...formData, context_fr: e.target.value })}
                      placeholder="Utilisé dans tous les projets..."
                      className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]"
                    />
                  </div>
                  <div>
                    <label htmlFor="skill-context-en" className="block text-sm font-semibold text-white mb-1">Contexte (EN)</label>
                    <input
                      id="skill-context-en"
                      type="text"
                      value={formData.context_en}
                      onChange={(e) => setFormData({ ...formData, context_en: e.target.value })}
                      placeholder="Used in all projects..."
                      className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2 px-6">
                    {editingIndex !== null ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2 px-6">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills by category */}
      {(['mastered', 'learning', 'basics'] as CategoryKey[]).map((cat) => {
        const catSkills = skillsByCategory(cat);
        const config = CATEGORIES[cat];
        return (
          <div key={cat} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-[#1A1A2E] pb-3">
              <span className={`w-3 h-3 rounded-full ${config.dotColor}`} />
              <h3 className={`text-lg font-bold ${config.color}`}>{config.label}</h3>
              <span className="text-[#4A5568] text-xs ml-auto">{catSkills.length} compétence{catSkills.length !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-[#4A5568] text-xs mb-4">{config.description}</p>

            {catSkills.length === 0 ? (
              <p className="text-[#4A5568] text-center italic py-4">Aucune compétence dans cette catégorie.</p>
            ) : (
              <div className="space-y-2">
                {catSkills.map((skill, idx) => {
                  const globalIndex = skills.indexOf(skill);
                  return (
                    <motion.div
                      key={`${skill.name}-${globalIndex}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex items-center gap-3 bg-[#141430] p-3 rounded-lg border border-[#1A1A2E] group hover:border-[rgba(0,191,255,0.3)] transition-colors"
                    >
                      {/* Level bar */}
                      <div className="w-16 flex-shrink-0">
                        <div className="h-1.5 bg-[#0A0A1E] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              skill.category === 'mastered' ? 'bg-[#00BFFF]' :
                              skill.category === 'learning' ? 'bg-yellow-400' : 'bg-[#718096]'
                            }`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#4A5568] mt-0.5 block text-center">{skill.level}%</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{skill.name}</p>
                        <p className="text-[#4A5568] text-xs truncate">{skill.context_fr}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMove(globalIndex, 'up')}
                          disabled={globalIndex === 0}
                          className="p-1 text-[#4A5568] hover:text-white disabled:opacity-30 transition-colors"
                          title="Monter"
                          aria-label="Monter la compétence"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          onClick={() => handleMove(globalIndex, 'down')}
                          disabled={globalIndex === skills.length - 1}
                          className="p-1 text-[#4A5568] hover:text-white disabled:opacity-30 transition-colors"
                          title="Descendre"
                          aria-label="Descendre la compétence"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button
                          onClick={() => openEdit(globalIndex)}
                          className="p-1 text-[#4A5568] hover:text-[#00BFFF] transition-colors"
                          title="Modifier"
                          aria-label="Modifier la compétence"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(globalIndex)}
                          className="p-1 text-[#4A5568] hover:text-red-400 transition-colors"
                          title="Supprimer"
                          aria-label="Supprimer la compétence"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Honesty note */}
      <div className="glass-card p-6">
        <h3 className="text-white font-semibold text-lg border-b border-[#1A1A2E] pb-2 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Note d'honnêteté
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="honesty-fr" className="block text-xs text-[#A8B4C8] mb-1">Français</label>
            <textarea
              id="honesty-fr"
              value={honestyFr}
              onChange={(e) => { setHonestyFr(e.target.value); debouncedSaveHonesty.scheduleSave(e.target.value); }}
              rows={3}
              className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]"
            />
          </div>
          <div>
            <label htmlFor="honesty-en" className="block text-xs text-[#A8B4C8] mb-1">English</label>
            <textarea
              id="honesty-en"
              value={honestyEn}
              onChange={(e) => setHonestyEn(e.target.value)}
              onBlur={() => saveHonesty(honestyFr, honestyEn)}
              rows={3}
              className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]"
            />
          </div>
          {debouncedSaveHonesty.saveStatus !== 'idle' && (
            <div className="flex items-center gap-2 text-xs">
              {debouncedSaveHonesty.saveStatus === 'saving' && (
                <><div className="w-3 h-3 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /> <span className="text-[#00BFFF]">Sauvegarde...</span></>
              )}
              {debouncedSaveHonesty.saveStatus === 'saved' && (
                <><svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="text-green-400">Sauvegardé</span></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Default skills data
// ============================================================

const DEFAULT_SKILLS: SkillItem[] = [
  { name: 'HTML5 / CSS3', level: 90, category: 'mastered', context_fr: 'Tous les projets', context_en: 'All projects' },
  { name: 'React / Next.js', level: 85, category: 'mastered', context_fr: 'Portfolio, CRM, Projets clients', context_en: 'Portfolio, CRM, Client projects' },
  { name: 'TypeScript', level: 70, category: 'mastered', context_fr: 'Architecture type-safe', context_en: 'Type-safe architecture' },
  { name: 'TailwindCSS', level: 85, category: 'mastered', context_fr: 'Design system complet', context_en: 'Complete design system' },
  { name: 'Framer Motion', level: 75, category: 'mastered', context_fr: 'Animations fluides', context_en: 'Smooth animations' },
  { name: 'Supabase', level: 75, category: 'mastered', context_fr: 'Auth, DB, Storage, Realtime', context_en: 'Auth, DB, Storage, Realtime' },
  { name: 'API REST', level: 80, category: 'mastered', context_fr: 'Intégration complète', context_en: 'Full integration' },
  { name: 'Git / GitHub', level: 70, category: 'mastered', context_fr: 'Versionning & collaboration', context_en: 'Versioning & collaboration' },
  { name: 'Vercel / Netlify', level: 80, category: 'mastered', context_fr: 'Déploiement continu', context_en: 'Continuous deployment' },
  { name: 'IA / Prompting', level: 75, category: 'mastered', context_fr: 'Accélération dev', context_en: 'Dev acceleration' },
  { name: 'Node.js', level: 55, category: 'learning', context_fr: 'APIs REST en cours', context_en: 'REST APIs in progress' },
  { name: 'PostgreSQL', level: 50, category: 'learning', context_fr: 'Requêtes avancées', context_en: 'Advanced queries' },
  { name: 'Three.js', level: 40, category: 'learning', context_fr: 'Scènes 3D basiques', context_en: 'Basic 3D scenes' },
  { name: 'Figma', level: 45, category: 'learning', context_fr: 'Maquettes & prototypes', context_en: 'Mockups & prototypes' },
  { name: 'SQL', level: 35, category: 'basics', context_fr: 'Requêtes de base', context_en: 'Basic queries' },
  { name: 'Docker', level: 30, category: 'basics', context_fr: 'Conteneurisation basique', context_en: 'Basic containerization' },
];

export default AdminSkills;
