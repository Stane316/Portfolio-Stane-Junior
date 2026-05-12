import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import FileUpload from './FileUpload';
import BilingualInput from './BilingualInput';

interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  slug: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  category: string;
  image_url: string;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
}

interface AdminBlogProps {
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

const AdminBlog: React.FC<AdminBlogProps> = ({ onToast }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Formulaire
  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    slug: '',
    excerpt_fr: '',
    excerpt_en: '',
    content_fr: '',
    content_en: '',
    category: 'tech',
    image_url: '',
    is_published: false,
    display_order: 0,
  });

  const fetchPosts = async () => {
    if (!isSupabaseConfigured()) { setPosts([]); setLoading(false); return; }
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Génération automatique du slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (field: 'title_fr' | 'title_en', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Si on édite le titre FR et que le slug est vide ou ressemble au titre FR précédent, on met à jour le slug
      if (field === 'title_fr' && (!prev.slug || prev.slug === generateSlug(prev.title_fr))) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({
      title_fr: '', title_en: '', slug: '', excerpt_fr: '', excerpt_en: '',
      content_fr: '', content_en: '', category: 'tech', image_url: '',
      is_published: false, display_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) { onToast('error', 'Supabase non configuré'); return; }
    
    if (!formData.slug) {
      onToast('error', 'Le slug (URL) est requis');
      return;
    }

    try {
      const data = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(data).eq('id', editingId);
        if (error) throw error;
        onToast('success', 'Article mis à jour !');
      } else {
        const { error } = await supabase.from('blog_posts').insert([data]);
        if (error) throw error;
        onToast('success', 'Article créé !');
      }
      resetForm();
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      title_fr: post.title_fr,
      title_en: post.title_en,
      slug: post.slug,
      excerpt_fr: post.excerpt_fr || '',
      excerpt_en: post.excerpt_en || '',
      content_fr: post.content_fr || '',
      content_en: post.content_en || '',
      category: post.category,
      image_url: post.image_url || '',
      is_published: post.is_published,
      display_order: post.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article "${title}" ?`)) return;
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      onToast('success', 'Article supprimé !');
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('blog_posts').update({ 
        is_published: !current, 
        published_at: !current ? new Date().toISOString() : null 
      }).eq('id', id);
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      onToast('error', message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Blog ({posts.length})</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nouvel article
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="glass-card border border-[rgba(0,191,255,0.15)] p-6">
              <h3 className="text-lg font-bold text-white mb-4">{editingId ? 'Modifier l\'article' : 'Nouvel article'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Upload Image */}
                <FileUpload 
                  label="Image de couverture"
                  bucket="portfolio-assets"
                  folder="blog"
                  currentUrl={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  accept="image/*"
                  maxSizeMB={5}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (FR)</label>
                    <BilingualInput 
                       label="Titre de l'article"
                       valueFr={formData.title_fr}
                       valueEn={formData.title_en}
                       onChangeFr={(val) => setFormData({...formData, title_fr: val})}
                       onChangeEn={(val) => setFormData({...formData, title_en: val})}
                       type="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (EN)</label>
                    <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required placeholder="Article Title" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Slug (URL)</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required placeholder="mon-article" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF] font-mono" />
                  <p className="text-[#4A5568] text-xs mt-1">Ex: /blog/{formData.slug || 'mon-article'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Extrait (FR)</label>
                    <BilingualInput 
                        label="Extrait (Résumé)"
                        valueFr={formData.excerpt_fr}
                        valueEn={formData.excerpt_en}
                        onChangeFr={(val) => setFormData({...formData, excerpt_fr: val})}
                        onChangeEn={(val) => setFormData({...formData, excerpt_en: val})}
                        rows={2}
                     />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Extrait (EN)</label>
                    <textarea value={formData.excerpt_en} onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })} rows={2} placeholder="Short summary..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Contenu (FR)</label>
                    <BilingualInput 
                        label="Contenu de l'article"
                        valueFr={formData.content_fr}
                        valueEn={formData.content_en}
                        onChangeFr={(val) => setFormData({...formData, content_fr: val})}
                        onChangeEn={(val) => setFormData({...formData, content_en: val})}
                        rows={8}
                     />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Contenu (EN)</label>
                    <textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={6} placeholder="Full content..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold mb-1 text-white">Catégorie</label>
                    <select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} title="Sélectionnez une catégorie" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]">
                      <option value="tech">Technologie</option>
                      <option value="growtech">GROW TECH</option>
                      <option value="africa">Afrique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="display_order" className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                    <input id="display_order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} placeholder="0" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" />
                      <span className="text-white text-sm">{formData.is_published ? 'Publié' : 'Brouillon'}</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2 px-6">{editingId ? 'Mettre à jour' : 'Créer'}</button>
                  <button type="button" onClick={resetForm} className="btn-secondary text-sm py-2 px-6">Annuler</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {posts.length === 0 ? (
        <div className="glass-card text-center py-12"><p className="text-[#A8B4C8]">Aucun article. Créez votre premier article !</p></div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass-card border border-[rgba(0,191,255,0.15)]">
              <div className="flex items-start gap-4">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title_fr} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold truncate">{post.title_fr}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${post.is_published ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-gray-500 bg-opacity-20 text-gray-400'}`}>
                      {post.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                    <span className="px-2 py-0.5 bg-[#00BFFF] bg-opacity-20 text-[#00BFFF] text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-[#A8B4C8] text-xs truncate">{post.excerpt_fr}</p>
                  <p className="text-[#4A5568] text-[10px] mt-1 font-mono">/blog/{post.slug}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => togglePublish(post.id, post.is_published)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF]" title={post.is_published ? 'Dépublier' : 'Publier'}>
                    {post.is_published ? '✅' : '📄'}
                  </button>
                  <button onClick={() => handleEdit(post)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF]">✏️</button>
                  <button onClick={() => handleDelete(post.id, post.title_fr)} className="p-1.5 text-[#A8B4C8] hover:text-red-400">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;