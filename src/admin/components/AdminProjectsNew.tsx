import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';

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
    title_fr: '', title_en: '', status: 'concept' as 'delivered' | 'in_progress' | 'concept', description_fr: '', description_en: '',
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projets ({projects.length})</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <span className="text-xl">+</span> Nouveau Projet
        </button>
      </div>

      {/* Formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
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

      {/* Liste des Projets - Style Carte Moderne */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <motion.div key={proj.id} layout className="glass-card group hover:border-[#00BFFF] transition-all duration-300 relative overflow-hidden">
            {/* Barre de couleur statut */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              proj.status === 'delivered' ? 'bg-green-500' : 
              proj.status === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            
            <div className="flex items-center gap-6 pl-4">
              {/* Image Thumbnail */}
              <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#0A0A1E] border border-[#1A1A2E]">
                {proj.image_url ? (
                  <img src={proj.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🚀</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-lg truncate">{proj.title_fr}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    proj.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 
                    proj.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {proj.status === 'delivered' ? 'Livré' : proj.status === 'in_progress' ? 'En cours' : 'Concept'}
                  </span>
                </div>
                <p className="text-[#4A5568] text-sm truncate">{proj.title_en}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(proj.stack) && proj.stack.map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#141430] border border-[#1A1A2E] rounded text-[#A8B4C8] text-xs">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#4A5568] text-xs">Visible</span>
                  <button onClick={() => toggleField(proj.id, 'is_visible', proj.is_visible)} className={`w-10 h-5 rounded-full transition-colors ${proj.is_visible ? 'bg-[#00BFFF]' : 'bg-[#1A1A2E]'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${proj.is_visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4A5568] text-xs">Featured</span>
                  <button onClick={() => toggleField(proj.id, 'is_featured', proj.is_featured)} className={`w-10 h-5 rounded-full transition-colors ${proj.is_featured ? 'bg-yellow-500' : 'bg-[#1A1A2E]'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${proj.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => handleEdit(proj)} className="p-2 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" title="Modifier">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(proj.id)} className="p-2 text-[#A8B4C8] hover:text-red-400 transition-colors" title="Supprimer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {projects.length === 0 && <p className="text-[#4A5568] text-center italic">Aucun projet.</p>}
    </div>
  );
};

export default AdminProjectsNew;