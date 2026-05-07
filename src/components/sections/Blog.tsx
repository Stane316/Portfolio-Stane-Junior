import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

interface BlogPost {
  id: number;
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  article_url?: string;
  source_title?: string;
}

const Blog: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isFr ? 'Tous' : 'All' },
    { id: 'tech', label: isFr ? 'Technologie' : 'Technology' },
    { id: 'growtech', label: isFr ? 'GROW TECH' : 'GROW TECH' },
    { id: 'africa', label: isFr ? 'Afrique' : 'Africa' },
  ];

  const posts: BlogPost[] = [
    {
      id: 1,
      title_fr: "Pourquoi le Mobile Money est l'avenir du paiement en Afrique",
      title_en: 'Why Mobile Money is the Future of Payment in Africa',
      excerpt_fr: "Le Mobile Money transforme l'économie africaine.",
      excerpt_en: 'Mobile Money is transforming the African economy.',
      category: 'africa',
      date: '2025-01-15',
      readTime: '5 min',
      image: '',
      slug: 'mobile-money-avenir-afrique',
    },
    {
      id: 2,
      title_fr: 'Comment GROW TECH développe des solutions pour le marché OHADA',
      title_en: 'How GROW TECH Builds Solutions for the OHADA Market',
      excerpt_fr: 'Notre approche unique pour créer des logiciels conformes aux standards OHADA.',
      excerpt_en: 'Our unique approach to creating OHADA-compliant software.',
      category: 'growtech',
      date: '2025-01-10',
      readTime: '7 min',
      image: '',
      slug: 'growtech-solutions-ohada',
    },
    {
      id: 3,
      title_fr: 'React vs Vanilla JS : Quand utiliser quoi ?',
      title_en: 'React vs Vanilla JS: When to Use What?',
      excerpt_fr: "En tant que développeur, il est crucial de savoir quand utiliser un framework.",
      excerpt_en: "As a developer, it's crucial to know when to use a framework.",
      category: 'tech',
      date: '2025-01-05',
      readTime: '6 min',
      image: '',
      slug: 'react-vs-vanilla-js',
    },
    {
      id: 4,
      title_fr: 'FacturaPro : Résoudre le problème de facturation en Afrique',
      title_en: 'FacturaPro: Solving the Invoicing Problem in Africa',
      excerpt_fr: "Comment j'ai observé un problème réel dans une agence Mobile Money.",
      excerpt_en: 'How I observed a real problem at a Mobile Money agency.',
      category: 'growtech',
      date: '2024-12-20',
      readTime: '8 min',
      image: '',
      slug: 'facturapro-facturation-afrique',
      article_url: 'https://www.fedapay.com/blog/',
      source_title: 'FedaPay Blog',
    },
  ];

  // CORRECTION: Filtrage corrigé avec dépendances stables
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') {
      return [...posts];
    }
    return posts.filter((post) => post.category === activeCategory);
  }, [activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section id="blog" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-[var(--bg-secondary)]" aria-labelledby="blog-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="blog-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              <span className="text-gradient">{isFr ? 'Blog & Réflexions' : 'Blog & Thoughts'}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto px-2">
              {isFr 
                ? 'Partages techniques, retours d\'expérience et réflexions sur le développement en Afrique.'
                : 'Technical insights, experience sharing and thoughts on development in Africa.'}
            </p>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent-cyan)] mx-auto rounded-full mt-4" />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--accent-cyan)] text-black'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]'
                }`}
                aria-pressed={activeCategory === cat.id ? 'true' : 'false'}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <span className="text-4xl mb-4 block">📭</span>
                <p className="text-[var(--text-secondary)]">
                  {isFr ? 'Aucun article dans cette catégorie.' : 'No articles in this category.'}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <motion.article key={post.id} variants={itemVariants} className="project-card group cursor-pointer">
                  <div className="w-full h-40 sm:h-48 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-cyan)] opacity-20 mb-4 sm:mb-5 flex items-center justify-center group-hover:opacity-30 transition-opacity">
                    <span className="text-4xl sm:text-5xl">📝</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="px-2 sm:px-3 py-1 bg-[var(--accent-cyan)] bg-opacity-20 text-[var(--accent-cyan)] text-xs font-semibold rounded-full">
                      {categories.find((c) => c.id === post.category)?.label || post.category}
                    </span>
                    <span className="text-[var(--text-muted)] text-xs">{post.date}</span>
                    <span className="text-[var(--text-muted)] text-xs">· {post.readTime}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-2 sm:mb-3 group-hover:text-[var(--accent-cyan)] transition-colors">
                    {isFr ? post.title_fr : post.title_en}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-4 line-clamp-3">
                    {isFr ? post.excerpt_fr : post.excerpt_en}
                  </p>
                  {post.article_url && (
                    <div className="flex items-center gap-2 mb-4 p-2 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                      <svg className="w-4 h-4 text-[var(--accent-cyan)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a href={post.article_url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-cyan)] text-xs hover:underline truncate" onClick={(e) => e.stopPropagation()}>
                        {isFr ? 'Basé sur : ' : 'Based on: '}{post.source_title || post.article_url}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[var(--accent-cyan)] text-sm font-medium group-hover:gap-3 transition-all">
                    <span>{isFr ? "Lire l'article" : 'Read article'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;