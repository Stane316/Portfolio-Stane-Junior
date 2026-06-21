import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // P-12 FIX: If slug is missing or Supabase not configured, show 404
        if (!slug) {
          setNotFound(true);
          return;
        }

        if (!isSupabaseConfigured()) {
          setNotFound(true);
          return;
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (error) {
          // PGRST116 = no rows returned (not found)
          if (error.code === 'PGRST116' || error.message?.includes('0 rows')) {
            setNotFound(true);
          } else {
            console.error('Erreur fetch post:', error);
            setNotFound(true);
          }
          return;
        }

        if (!data) {
          setNotFound(true);
          return;
        }

        setPost(data as BlogPost);
      } catch (err) {
        console.error('Erreur fetch post:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // P-12 FIX: Redirect to NotFound route instead of inline fallback
  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#0A0A1E]">
        <Navbar />
        <div className="flex flex-col items-center justify-center gap-8 pt-32 pb-24">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-8xl font-heading text-[#00BFFF] block mb-4">404</span>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto rounded-full mb-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-white font-display"
          >
            {isFr ? 'Article non trouvé' : 'Article not found'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#A8B4C8] text-lg text-center max-w-md"
          >
            {isFr
              ? "L'article que vous recherchez n'existe pas ou a été supprimé."
              : "The article you're looking for doesn't exist or has been removed."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/blog"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isFr ? 'Retour au blog' : 'Back to blog'}
            </Link>
            <Link
              to="/"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {isFr ? "Retour à l'accueil" : 'Back to home'}
            </Link>
          </motion.div>
        </div>
        <Footer />
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
