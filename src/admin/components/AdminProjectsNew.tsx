import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';
import ProjectRow from './ProjectRow'; // Import du nouveau design

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
  case_study_fr: any;
  case_study_en: any;
  is_visible: boolean;
  is_featured: boolean;
  display_order: number;
}

const AdminProjectsNew: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  
  const [formData, setFormData] = useState({
    title_fr: '', title_en: '', status: 'concept' as const, description_fr: '', description_en: '',
    stack: '', live_url: '', image_url: '', is_visible: true, is_featured: false,
    case_study: { step1: {title:'',content:''}, step2: {title:'',content:''}, step3: {title:'',content:''}, step4: {title:'',content:''}, step5: {title:'',content:''} }
  });

  const fetchData = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (!error) setProjects((data as Project[]) || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveData = async (newData: any) => {
    if (!isSupabaseConfigured()) return;
    try {
      if (editingProject) {
        await supabase.from('projects').update(newData).eq('id', editingProject.id);
      } else {
        await supabase.from('projects').insert([newData]);
      }
      onToast('success', 'Projet sauvegardé !');
      fetchData();
    } catch (e: any) { onToast('error', e.message); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stackArray = formData.stack.split(',').map(s => s.trim()).filter(Boolean);
    saveData({ ...formData, stack: stackArray });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title_fr: '', title_en: '', status: 'concept', description_fr: '', description_en: '', stack: '', live_url: '', image_url: '', is_visible: true, is_featured: false, case_study: { step1: {title:'',content:''}, step2: {title:'',content:''}, step3: {title:'',content:''}, step4: {title:'',content:''}, step5: {title:'',content:''} } });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
      case_study: project.case_study_fr || { step1: {title:'',content:''}, step2: {title:'',content:''}, step3: {title:'',content:''}, step4: {title:'',content:''}, step5: {title:'',content:''} }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      onToast('success', 'Projet supprimé !');
      fetchData();
    } catch (e: any) { onToast('error', e.message); }
  };

  const toggleField = async (id: string, field: string, current: boolean) => {
    try {
      await supabase.from('projects').update({ [field]: !current }).eq('id', id);
      fetchData();
    } catch (e: any) { onToast('error', e.message); }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Projets ({projects.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <span className="text-xl">+</span> Nouveau Projet
        </button>
      </div>

      {/* Formulaire (Caché par défaut) */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{editingProject ? 'Modifier' : 'Nouveau'} Projet</h3>
                <button type="button" onClick={() => setShowCaseStudy(true)} className="text-xs bg-[#141430] border border-[#00BFFF] text-[#00BFFF] px-3 py-1 rounded hover:bg-[#00BFFF] hover:text-black transition-all">
                  📖 Éditer Étude de Cas
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <BilingualInput label="Titre" valueFr={formData.title_fr} valueEn={formData.title_en} onChangeFr={(v) => setFormData({...formData, title_fr: v})} onChangeEn={(v) => setFormData({...formData, title_en: v})} type="input" />
                <BilingualInput label="Description" valueFr={formData.description_fr} valueEn={formData.description_en} onChangeFr={(v) => setFormData({...formData, description_fr: v})} onChangeEn={(v) => setFormData({...formData, description_en: v})} rows={3} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-1">Statut</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white">
                      <option value="concept">Concept</option>
                      <option value="in_progress">En cours</option>
                      <option value="delivered">Livré</option>
                    </select>
                  </div>
                  <input placeholder="Stack (React, Supabase...)" value={formData.stack} onChange={(e) => setFormData({...formData, stack: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                  <input placeholder="Lien Live (URL)" value={formData.live_url} onChange={(e) => setFormData({...formData, live_url: e.target.value})} className="bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white text-sm" />
                </div>
                <FileUpload label="Image du projet" bucket="portfolio-assets" folder="projects" currentUrl={formData.image_url} onChange={(url) => setFormData({...formData, image_url: url})} />
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({...formData, is_visible: e.target.checked})} className="w-4 h-4 accent-[#00BFFF]" /> Visible</label>
                  <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 accent-[#00BFFF]" /> Featured</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary">{editingProject ? 'Modifier' : 'Créer'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Annuler</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Étude de Cas */}
      {showCaseStudy && (
        <CaseStudyEditor
          lang="fr"
          data={formData.case_study}
          onChange={(data) => setFormData({...formData, case_study: data})}
          onClose={() => setShowCaseStudy(false)}
          onSave={() => { setShowCaseStudy(false); onToast('success', 'Étude de cas sauvegardée'); }}
        />
      )}

      {/* LISTE DES PROJETS - NOUVEAU DESIGN PREMIUM */}
      <div className="bg-[#0A0A1E] border border-[#1A1A2E] rounded-2xl overflow-hidden shadow-lg">
        {/* Header Tableau */}
        <div className="flex items-center gap-5 p-4 bg-[#141430] border-b border-[#1A1A2E] text-xs font-bold text-[#4A5568] uppercase tracking-wider">
          <div className="w-14">Image</div>
          <div className="flex-1">Projet</div>
          <div className="hidden md:block w-24 text-center">Statut</div>
          <div className="w-20 text-center">Options</div>
          <div className="w-28 text-right">Actions</div>
        </div>

        {/* Rows */}
        {projects.map((proj) => (
          <ProjectRow
            key={proj.id}
            id={proj.id}
            title_fr={proj.title_fr}
            title_en={proj.title_en}
            status={proj.status}
            image_url={proj.image_url}
            stack={proj.stack}
            is_visible={proj.is_visible}
            is_featured={proj.is_featured}
            onEdit={() => handleEdit(proj)}
            onDelete={() => handleDelete(proj.id)}
            onToggleVisible={() => toggleField(proj.id, 'is_visible', proj.is_visible)}
            onToggleFeatured={() => toggleField(proj.id, 'is_featured', proj.is_featured)}
            onEditCaseStudy={() => {
              setEditingProject(proj);
              setFormData({ ...proj, stack: Array.isArray(proj.stack) ? proj.stack.join(', ') : '', case_study: proj.case_study_fr || { step1: {title:'',content:''}, step2: {title:'',content:''}, step3: {title:'',content:''}, step4: {title:'',content:''}, step5: {title:'',content:''} } });
              setShowCaseStudy(true);
            }}
          />
        ))}
        
        {projects.length === 0 && (
          <div className="p-12 text-center text-[#4A5568] italic">
            Aucun projet pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsNew;