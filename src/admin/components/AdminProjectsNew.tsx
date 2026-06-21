import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '../hooks/useAdminData';
import { Project, CaseStudyData } from '../types';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';
import CaseStudyEditor from './CaseStudyEditor';
import ProjectRow from './ProjectRow';

const DEFAULT_CASE_STUDY: CaseStudyData = {
  step1: { title: 'PROBLÈME', content: '' },
  step2: { title: 'SOLUTION', content: '' },
  step3: { title: 'FONCTIONNALITÉS', content: '' },
  step4: { title: 'OBSTACLE', content: '' },
  step5: { title: 'RÉSULTAT', content: '' }
};

interface FormData {
  title_fr: string;
  title_en: string;
  status: Project['status'];
  description_fr: string;
  description_en: string;
  stack: string;
  live_url: string;
  image_url: string;
  is_visible: boolean;
  is_featured: boolean;
  case_study: CaseStudyData;
}

const AdminProjectsNew: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const { data: projects, loading, saveItem, deleteItem, fetchData } = useAdminData<Project>({
    table: 'projects',
    orderBy: 'display_order',
    orderAsc: true,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title_fr: '', title_en: '', status: 'concept', description_fr: '', description_en: '',
    stack: '', live_url: '', image_url: '', is_visible: true, is_featured: false,
    case_study: DEFAULT_CASE_STUDY
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stackArray = formData.stack.split(',').map(s => s.trim()).filter(Boolean);
    
    const projectData: Partial<Project> = {
      title_fr: formData.title_fr,
      title_en: formData.title_en,
      status: formData.status,
      description_fr: formData.description_fr,
      description_en: formData.description_en,
      stack: stackArray,
      live_url: formData.live_url,
      image_url: formData.image_url,
      is_visible: formData.is_visible,
      is_featured: formData.is_featured,
      case_study_fr: formData.case_study,
      case_study_en: formData.case_study,
    };

    const result = await saveItem(projectData, editingProject?.id);
    if (result.success) {
      onToast('success', editingProject ? 'Projet modifié !' : 'Projet créé !');
      resetForm();
    } else {
      onToast('error', result.error || 'Erreur lors de la sauvegarde');
    }
  };

  const resetForm = () => {
    setFormData({
      title_fr: '', title_en: '', status: 'concept', description_fr: '', description_en: '',
      stack: '', live_url: '', image_url: '', is_visible: true, is_featured: false,
      case_study: DEFAULT_CASE_STUDY
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title_fr: project.title_fr,
      title_en: project.title_en,
      status: project.status,
      description_fr: project.description_fr,
      description_en: project.description_en,
      stack: Array.isArray(project.stack) ? project.stack.join(', ') : '',
      live_url: project.live_url,
      image_url: project.image_url,
      is_visible: project.is_visible,
      is_featured: project.is_featured,
      case_study: project.case_study_fr || DEFAULT_CASE_STUDY
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    const result = await deleteItem(id);
    if (result.success) {
      onToast('success', 'Projet supprimé !');
    } else {
      onToast('error', result.error || 'Erreur lors de la suppression');
    }
  };

  const toggleField = async (id: string, field: 'is_visible' | 'is_featured', current: boolean) => {
    const result = await saveItem({ [field]: !current }, id);
    if (!result.success) {
      onToast('error', result.error || 'Erreur lors de la modification');
    }
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

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{editingProject ? 'Modifier' : 'Nouveau'} Projet</h3>
                <button type="button" onClick={() => setShowCaseStudy(true)} className="text-xs bg-[#141430] border border-[#00BFFF] text-[#00BFFF] px-3 py-1 rounded hover:bg-[#00BFFF] hover:text-black transition-all inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Éditer Étude de Cas
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <BilingualInput label="Titre" valueFr={formData.title_fr} valueEn={formData.title_en} onChangeFr={(v) => setFormData({...formData, title_fr: v})} onChangeEn={(v) => setFormData({...formData, title_en: v})} type="input" />
                <BilingualInput label="Description" valueFr={formData.description_fr} valueEn={formData.description_en} onChangeFr={(v) => setFormData({...formData, description_fr: v})} onChangeEn={(v) => setFormData({...formData, description_en: v})} rows={3} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-1">Statut</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as Project['status']})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white">
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

      {showCaseStudy && (
        <CaseStudyEditor
          lang="fr"
          data={formData.case_study}
          onChange={(data) => setFormData({...formData, case_study: data})}
          onClose={() => setShowCaseStudy(false)}
          onSave={() => { setShowCaseStudy(false); onToast('success', 'Étude de cas mise à jour'); }}
        />
      )}

      <div className="bg-[#0A0A1E] border border-[#1A1A2E] rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center gap-5 p-4 bg-[#141430] border-b border-[#1A1A2E] text-xs font-bold text-[#4A5568] uppercase tracking-wider">
          <div className="w-14">Image</div>
          <div className="flex-1">Projet</div>
          <div className="hidden md:block w-24 text-center">Statut</div>
          <div className="w-20 text-center">Options</div>
          <div className="w-28 text-right">Actions</div>
        </div>

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
              setFormData({
                ...proj,
                stack: Array.isArray(proj.stack) ? proj.stack.join(', ') : '',
                case_study: proj.case_study_fr || DEFAULT_CASE_STUDY
              });
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