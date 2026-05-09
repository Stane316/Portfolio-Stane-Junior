import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';

interface ProjectItem {
  id: number;
  title: string;
  imageUrl: string;
  status: string;
  stack: string[];
}

const ProjectsStrip: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { projects: rawProjects, loading } = useSupabaseData();
  const [activeId, setActiveId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transformation des données
  const projects: ProjectItem[] = rawProjects.map((p) => ({
    id: parseInt(p.id) || 0,
    title: isFr ? p.title_fr : p.title_en,
    imageUrl: p.image_url || '',
    status: p.status,
    stack: p.stack || [],
  }));

  // Scroll horizontal avec la molette
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY * 1.5;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleProjectClick = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-[#0A0A1E]">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="bg-[#0A0A1E] py-24 lg:py-32 overflow-hidden">
      <div className="container-custom max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-heading text-white tracking-tighter">
              PROJETS
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 font-light">
              {isFr ? 'Sélection de travaux récents.' : 'Selection of recent works.'}
            </p>
          </div>
          <div className="text-right hidden lg:block">
            <span className="text-[#00BFFF] text-xs uppercase tracking-[0.3em] font-mono">
              {projects.length} {isFr ? 'PROJETS' : 'PROJECTS'}
            </span>
          </div>
        </div>

        {/* Bande horizontale interactive */}
        <div 
          ref={containerRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project) => {
            const isActive = activeId === project.id;
            
            return (
              <motion.div
                key={project.id}
                layout
                onClick={() => handleProjectClick(project.id)}
                className={`relative flex-shrink-0 cursor-pointer group overflow-hidden rounded-lg snap-center transition-all duration-500 ease-out ${
                  isActive ? 'w-[80vw] lg:w-[60vw] h-[60vh] lg:h-[70vh]' : 'w-[200px] sm:w-[250px] h-[300px] sm:h-[400px]'
                }`}
              >
                {/* Image */}
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#141430] to-[#1A1A2E] flex items-center justify-center">
                    <span className="text-6xl opacity-20">🚀</span>
                  </div>
                )}

                {/* Overlay sombre au hover/active */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#0A0A1E] via-[#0A0A1E]/50 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                {/* Infos projet */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#00BFFF] text-xs uppercase tracking-widest font-mono">
                      {project.status === 'delivered' ? '✅ Livré' : project.status === 'in_progress' ? '🔄 En cours' : '💭 Concept'}
                    </span>
                  </div>
                  <h3 className={`font-heading text-white leading-none transition-all duration-300 ${isActive ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-xl sm:text-2xl'}`}>
                    {project.title}
                  </h3>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-4"
                    >
                      <p className="text-[#A8B4C8] text-sm sm:text-base max-w-2xl line-clamp-3">
                        {project.stack.join(' · ')}
                      </p>
                      <button className="mt-4 px-6 py-2 bg-[#00BFFF] text-black text-sm font-semibold rounded hover:bg-opacity-80 transition-colors">
                        {isFr ? 'Voir le projet' : 'View project'} →
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Indicateur actif */}
                {isActive && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-[#00BFFF] rounded-full animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bouton vers détails */}
        <div className="mt-16 text-center">
          <a 
            href="#projects-details" 
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-[#00BFFF] text-[#00BFFF] font-semibold rounded hover:bg-[#00BFFF] hover:text-black transition-all duration-300 group"
          >
            <span>{isFr ? 'Voir mes projets détaillés' : 'View detailed projects'}</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsStrip;