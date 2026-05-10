import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase'; // Importation corrigée
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionNumber from '../components/ui/SectionNumber';

interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  category: string;
  image_url: string;
  slug: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

const BlogList: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false });
        
        if (error) throw error;
        setPosts((data as BlogPost[]) || []);
      } catch (err) {
        console.error('Erreur fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = [
    { id: 'all', label: isFr ? 'Tous' : 'All' },
    { id: 'tech', label: isFr ? 'Technologie' : 'Technology' },
    { id: 'growtech', label: isFr ? 'GROW TECH' : 'GROW TECH' },
    { id: 'africa', label: isFr ? 'Afrique' : 'Africa' },
  ];

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      <Navbar />
      
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <div className="mb-16 lg:mb-24">
            <div className="relative">
              <SectionNumber number="07" />
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
                BLOG
              </h1>
              <p className="text-[#A8B4C8] text-lg lg:text-xl font-light mt-4 max-w-lg relative z-10">
                {isFr ? 'Réflexions, tutoriels et retours d\'expérience.' : 'Thoughts, tutorials and experience feedback.'}
              </p>
            </div>
          </div>

          {/* Filtres Catégories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#00BFFF] text-black'
                    : 'bg-[#141430] text-[#A8B4C8] hover:text-white border border-[#1A1A2E]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grille Articles */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A8B4C8] text-xl">{isFr ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#141430] border border-[#1A1A2E] rounded-2xl overflow-hidden hover:border-[#00BFFF] transition-colors duration-300 h-full flex flex-col"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-[#0A0A1E]">
                      {post.image_url ? (
                        <img src={post.image_url} alt={isFr ? post.title_fr : post.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-20">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#00BFFF] bg-opacity-20 text-[#00BFFF] text-xs font-semibold rounded-full uppercase">
                          {post.category}
                        </span>
                        <span className="text-[#4A5568] text-xs">
                          {new Date(post.published_at || post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00BFFF] transition-colors line-clamp-2">
                        {isFr ? post.title_fr : post.title_en}
                      </h3>
                      
                      <p className="text-[#A8B4C8] text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {isFr ? post.excerpt_fr : post.excerpt_en}
                      </p>

                      <div className="flex items-center gap-2 text-[#00BFFF] text-sm font-medium mt-auto">
                        <span>{isFr ? 'Lire l\'article' : 'Read article'}</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogList;