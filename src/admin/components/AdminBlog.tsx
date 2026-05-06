import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import EmptyState from './EmptyState';

interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  slug: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  category: 'tech' | 'growtech' | 'africa' | 'other';
  image_url: string;
  article_url: string;
  source_title: string;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
}

interface AdminBlogProps {
  onToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}

interface FormData {
  title_fr: string;
  title_en: string;
  slug: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  category: 'tech' | 'growtech' | 'africa' | 'other';
  image_url: string;
  article_url: string;
  source_title: string;
  is_published: boolean;
  display_order: number;
}

const categoryLabels: Record<string, string> = {
  tech: 'Technologie',
  growtech: 'GROW TECH',
  africa: 'Afrique',
  other: 'Autre',
};

const AdminBlog: React.FC<AdminBlogProps> = ({ onToast }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title_fr: '',
    title_en: '',
    slug: '',
    excerpt_fr: '',
    excerpt_en: '',
    content_fr: '',
    content_en: '',
    category: 'other',
    image_url: '',
    article_url: '',
    source_title: '',
    is_published: false,
    display_order: 0,
  });

  const fetchPosts = async () => {
    if (!isSupabaseConfigured()) {
      setPosts([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      onToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_en: '',
      slug: '',
      excerpt_fr: '',
      excerpt_en: '',
      content_fr: '',
      content_en: '',
      category: 'other',
      image_url: '',
      article_url: '',
      source_title: '',
      is_published: false,
      display_order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.title_fr);
      const data = { ...formData, slug, published_at: formData.is_published ? new Date().toISOString() : null };

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
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
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
      article_url: post.article_url || '',
      source_title: post.source_title || '',
      is_published: post.is_published,
      display_order: post.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article "${title}" ?`)) return;
    if (!isSupabaseConfigured()) {
      onToast('error', 'Supabase non configuré');
      return;
    }
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      onToast('success', 'Article supprimé !');
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !current, 
          published_at: !current ? new Date().toISOString() : null 
        })
        .eq('id', id);
      if (error) throw error;
      fetchPosts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      onToast('error', message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">Blog ({posts.length})</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4"
        >
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (FR)</label>
                    <input type="text" value={formData.title_fr} onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })} required placeholder="Titre de l'article" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Titre (EN)</label>
                    <input type="text" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} required placeholder="Article title" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-white">Slug (URL)</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="mon-article-blog" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Extrait (FR)</label>
                    <textarea value={formData.excerpt_fr} onChange={(e) => setFormData({ ...formData, excerpt_fr: e.target.value })} rows={2} placeholder="Résumé de l'article" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Extrait (EN)</label>
                    <textarea value={formData.excerpt_en} onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })} rows={2} placeholder="Article summary" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Contenu (FR)</label>
                    <textarea value={formData.content_fr} onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })} rows={6} placeholder="Contenu complet de l'article" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Contenu (EN)</label>
                    <textarea value={formData.content_en} onChange={(e) => setFormData({ ...formData, content_en: e.target.value })} rows={6} placeholder="Full article content" className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>

                {/* ARTICLE LIÉ */}
                <div className="p-4 bg-[#141430] bg-opacity-50 rounded-lg border border-[rgba(0,191,255,0.15)]">
                  <h4 className="text-[#00BFFF] font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Article lié (optionnel)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#A8B4C8]">Titre de la source</label>
                      <input 
                        type="text" 
                        value={formData.source_title} 
                        onChange={(e) => setFormData({ ...formData, source_title: e.target.value })} 
                        placeholder="Ex: React Documentation" 
                        className="w-full px-3 py-2 bg-[#0A0A1E] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#A8B4C8]">URL de l'article</label>
                      <input 
                        type="url" 
                        value={formData.article_url} 
                        onChange={(e) => setFormData({ ...formData, article_url: e.target.value })} 
                        placeholder="https://..." 
                        className="w-full px-3 py-2 bg-[#0A0A1E] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" 
                      />
                    </div>
                  </div>
                  <p className="text-[#4A5568] text-xs mt-2">
                    Liez cet article à une ressource existante (documentation, article externe, etc.)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Catégorie</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as FormData['category'] })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]">
                      <option value="tech">Technologie</option>
                      <option value="growtech">GROW TECH</option>
                      <option value="africa">Afrique</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Image URL</label>
                    <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-white">Ordre</label>
                    <input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-[#141430] border border-[rgba(0,191,255,0.15)] rounded-lg text-white text-sm focus:outline-none focus:border-[#00BFFF]" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="w-4 h-4 accent-[#00BFFF]" />
                  <span className="text-white text-sm">Publié</span>
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

      {posts.length === 0 ? (
        <EmptyState icon="📝" title="Aucun article" description="Commencez par créer votre premier article de blog." action={{ label: 'Créer un article', onClick: () => setShowForm(true) }} />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass-card border border-[rgba(0,191,255,0.15)]">
              <div className="flex items-start gap-4">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title_fr} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
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
                      {categoryLabels[post.category]}
                    </span>
                  </div>
                  <p className="text-[#A8B4C8] text-sm truncate">{post.excerpt_fr}</p>
                  {post.article_url && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      <a href={post.article_url} target="_blank" rel="noopener noreferrer" className="text-[#00BFFF] text-xs hover:underline">
                        {post.source_title || 'Article lié'}
                      </a>
                    </div>
                  )}
                  <p className="text-[#4A5568] text-xs mt-1">{post.slug}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => togglePublished(post.id, post.is_published)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" aria-label={post.is_published ? 'Dépublier' : 'Publier'}>
                    {post.is_published ? '✅' : '📄'}
                  </button>
                  <button onClick={() => handleEdit(post)} className="p-1.5 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors" aria-label="Modifier">✏️</button>
                  <button onClick={() => handleDelete(post.id, post.title_fr)} className="p-1.5 text-[#A8B4C8] hover:text-red-400 transition-colors" aria-label="Supprimer">🗑</button>
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