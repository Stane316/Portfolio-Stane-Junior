import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import BilingualInput from './BilingualInput';
import FileUpload from './FileUpload';

interface VisionItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  status: 'concept' | 'in_progress' | 'paused';
  image_url: string;
  order: number;
}

const AdminVision: React.FC<{ onToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void }> = ({ onToast }) => {
  const [visions, setVisions] = useState<VisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_fr: '', title_en: '', description_fr: '', description_en: '',
    status: 'concept' as const, image_url: ''
  });

  const fetchData = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('vision_items').select('*').order('order', { ascending: true });
      if (!error) setVisions((data as VisionItem[]) || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const saveData = async (newData: any) => {
    if (!isSupabaseConfigured()) return;
    try {
      if (editingId) {
        await supabase.from('vision_items').update(newData).eq('id', editingId);
      } else {
        await supabase.from('vision_items').insert([newData]);
      }
      onToast('success', 'Sauvegardé !');
      fetchData();
    } catch (e: any) { onToast('error', e.message); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveData({ ...formData, order: visions.length });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title_fr: '', title_en: '', description_fr: '', description_en: '', status: 'concept', image_url: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: VisionItem) => {
    setEditingId(item.id);
    setFormData({
      title_fr: item.title_fr, title_en: item.title_en,
      description_fr: item.description_fr, description_en: item.description_en,
      status: item.status, image_url: item.image_url
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce concept ?')) return;
    try {
      await supabase.from('vision_items').delete().eq('id', id);
      onToast('success', 'Supprimé !');
      fetchData();
    } catch (e: any) { onToast('error', e.message); }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="w-6 h-6 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion Vision / Concepts</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <span className="text-xl">+</span> Nouveau Concept
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Modifier' : 'Ajouter'} un concept</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <BilingualInput label="Titre du concept" valueFr={formData.title_fr} valueEn={formData.title_en} onChangeFr={(v) => setFormData({...formData, title_fr: v})} onChangeEn={(v) => setFormData({...formData, title_en: v})} type="input" />
                <BilingualInput label="Description" valueFr={formData.description_fr} valueEn={formData.description_en} onChangeFr={(v) => setFormData({...formData, description_fr: v})} onChangeEn={(v) => setFormData({...formData, description_en: v})} rows={4} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-1">Statut</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full bg-[#141430] border border-[#1A1A2E] rounded p-2 text-white">
                      <option value="concept">Concept</option>
                      <option value="in_progress">En développement</option>
                      <option value="paused">En pause</option>
                    </select>
                  </div>
                  <FileUpload label="Image" bucket="portfolio-assets" folder="vision" currentUrl={formData.image_url} onChange={(url) => setFormData({...formData, image_url: url})} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">{editingId ? 'Modifier' : 'Créer'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary">Annuler</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visions.map((item) => (
          <div key={item.id} className="glass-card group relative overflow-hidden hover:border-[#00BFFF] transition-colors">
            {item.image_url && <img src={item.image_url} alt="" className="w-full h-40 object-cover rounded-lg mb-4" />}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-lg">{item.title_fr}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.status === 'in_progress' ? 'bg-green-500/20 text-green-400' : 
                item.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {item.status === 'in_progress' ? 'En cours' : item.status === 'paused' ? 'Pause' : 'Concept'}
              </span>
            </div>
            <p className="text-[#A8B4C8] text-sm line-clamp-2 mb-4">{item.description_fr}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-[#A8B4C8] hover:text-[#00BFFF]">✏️</button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-[#A8B4C8] hover:text-red-400">🗑</button>
            </div>
          </div>
        ))}
      </div>
      {visions.length === 0 && <p className="text-[#4A5568] text-center italic">Aucun concept ajouté.</p>}
    </div>
  );
};

export default AdminVision;