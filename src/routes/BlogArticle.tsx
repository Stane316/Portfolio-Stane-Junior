import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  category: string;
  image_url: string;
  slug: string;
  published_at: string;
  created_at: string;
}

const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (error) throw error;
        setPost(data as BlogPost);
      } catch (err) {
        console.error('Erreur fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl text-white font-bold">Article non trouvé</h1>
        <Link to="/blog" className="text-[#00BFFF] hover:underline">← Retour au blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      <Navbar />
      
      <article className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-custom max-w-[900px] mx-auto px-6 lg:px-12">
          
          {/* Bouton Retour */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-[#A8B4C8] hover:text-[#00BFFF] transition-colors mb-12 group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm uppercase tracking-widest">{isFr ? 'Retour au blog' : 'Back to blog'}</span>
          </Link>

          {/* Header Article */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-[#00BFFF] bg-opacity-20 text-[#00BFFF] text-xs font-semibold rounded-full uppercase">
                {post.category}
              </span>
              <span className="text-[#4A5568] text-sm">
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white tracking-tight leading-[1.1] mb-8">
              {isFr ? post.title_fr : post.title_en}
            </h1>

            {/* Image Principale */}
            {post.image_url && (
              <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 bg-[#141430]">
                <img src={post.image_url} alt={isFr ? post.title_fr : post.title_en} className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>

          {/* Contenu */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="text-[#A8B4C8] leading-relaxed whitespace-pre-line">
              {isFr ? post.content_fr : post.content_en}
            </div>
          </motion.div>

          {/* Footer Article */}
          <div className="mt-16 pt-8 border-t border-[#141430] flex justify-between items-center">
            <Link to="/blog" className="text-[#00BFFF] hover:underline">← {isFr ? 'Autres articles' : 'Other articles'}</Link>
            <div className="flex gap-4">
              {/* Partage Social (à implémenter si besoin) */}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogArticle;