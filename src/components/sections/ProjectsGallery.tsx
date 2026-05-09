import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData, type Project as SupabaseProject } from '../../hooks/useSupabaseData';
import SectionNumber from '../../components/ui/SectionNumber';

interface ConvertedProject {
  id: number;
  title: { fr: string; en: string };
  status: 'delivered' | 'in_progress' | 'concept';
  description: { fr: string; en: string };
  stack: string[];
  liveUrl: string;
  imageUrl: string;
  isFeatured: boolean;
  caseStudy: { 
    fr: Array<{ title: string; content: string; icon: string }>; 
    en: Array<{ title: string; content: string; icon: string }>; 
  };
}

const CASE_STUDY_ICONS = {
  fr: ['🔍', '', '⚙️', '🚧', '🎯'],
  en: ['🔍', '💡', '⚙️', '🚧', ''],
};

const defaultTitles = {
  fr: ['Le problème', 'La solution', 'Fonctionnalités', 'Les obstacles', 'Le résultat'],
  en: ['The problem', 'The solution', 'Features', 'Obstacles', 'The result'],
};

const ProjectsGallery: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { projects: rawProjects, loading, error } = useSupabaseData();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ConvertedProject | null>(null);

  const projects = rawProjects.map((p) => ({
    id: parseInt(p.id) || 0,
    title: { fr: p.title_fr, en: p.title_en },
    status: p.status,
    description: { fr: p.description_fr, en: p.description_en },
    stack: p.stack || [],
    liveUrl: p.live_url || '',
    imageUrl: p.image_url || '',
    isFeatured: p.is_featured,
    caseStudy: {
      fr: (p.case_study_fr ? Object.values(p.case_study_fr).map((v: any, i) => ({ title: v?.title || CASE_STUDY_ICONS.fr[i]?.title || '', content: v?.content || '', icon: CASE_STUDY_ICONS.fr[i]?.icon || '' })) : []),
      en: (p.case_study_en ? Object.values(p.case_study_en).map((v: any, i) => ({ title: v?.title || CASE_STUDY_ICONS.en[i]?.title || '', content: v?.content || '', icon: CASE_STUDY_ICONS.en[i]?.icon || '' })) : []),
    },
  }));

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#0A0A1E]">
        <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="projects" className="bg-[#0A0A1E] min-h-screen py-20 lg:py-32">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* HEADER STYLE ARISTIDE */}
        <div className="mb-24 lg:mb-32 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="relative">
            <SectionNumber number="02" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              PROJETS
            </h2>
            <p className="text-[#A8B4C8] text-lg lg:text-xl font-light mt-4 max-w-md relative z-10">
              {isFr ? 'Des problèmes réels, des solutions concrètes.' : 'Real problems, concrete solutions.'}
            </p>
          </div>
          <div className="lg:text-right">
            <span className="text-[#00BFFF] text-sm uppercase tracking-widest font-mono">
              {projects.length} {isFr ? 'PROJETS RÉALISÉS' : 'PROJECTS DELIVERED'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-center mb-8">
            {isFr ? 'Erreur de chargement' : 'Loading error'}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-24 border-t border-[#141430]">
            <p className="text-[#A8B4C8] text-xl">
              {isFr ? 'Aucun projet disponible.' : 'No projects available.'}
            </p>
          </div>
        ) : (
          <div className="space-y-32 lg:space-y-48">
            {projects.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                isFr={isFr}
                isHovered={hoveredId === project.id}
                onHover={setHoveredId}
                onClick={() => setSelectedProject(project)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL ÉTUDE DE CAS */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div className="absolute inset-0 bg-[#0A0A1E] bg-opacity-95 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#141430] border border-[#1A1A2E] rounded-xl shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 text-[#A8B4C8] hover:text-white z-20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{isFr ? selectedProject.title.fr : selectedProject.title.en}</h3>
                  <p className="text-[#00BFFF] text-sm uppercase tracking-widest">📖 {isFr ? 'Étude de cas détaillée' : 'Detailed case study'}</p>
                </div>
                <div className="space-y-8">
                  {(isFr ? selectedProject.caseStudy.fr : selectedProject.caseStudy.en).map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0A0A1E] border border-[#1A1A2E] flex items-center justify-center text-xl">{step.icon}</div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{i + 1}. {step.title}</h4>
                        <p className="text-[#A8B4C8] whitespace-pre-line leading-relaxed">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Composant Projet Individuel (Style Aristide)
const ProjectItem: React.FC<{
  project: ConvertedProject;
  isFr: boolean;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  onClick: () => void;
  index: number;
}> = ({ project, isFr, isHovered, onHover, onClick, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative cursor-pointer"
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Layout asymétrique */}
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
        
        {/* Image Container */}
        <div className="w-full lg:w-3/5 relative overflow-hidden rounded-lg aspect-[16/10]">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={isFr ? project.title.fr : project.title.en}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#141430] to-[#1A1A2E] flex items-center justify-center">
              <span className="text-8xl opacity-20">🚀</span>
            </div>
          )}
          
          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-[#0A0A1E] bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-white text-sm uppercase tracking-widest font-mono mb-2 block">
                {project.status === 'delivered' ? '✅ Livré' : project.status === 'in_progress' ? '🔄 En cours' : '💭 Concept'}
              </span>
              <span className="text-[#00BFFF] text-2xl font-display font-bold">
                {isFr ? 'Voir le projet' : 'View project'} →
              </span>
            </div>
          </div>
        </div>

        {/* Info Container */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <div className="space-y-4">
            <span className="text-[#00BFFF] text-xs uppercase tracking-[0.3em] font-mono">
              {project.stack.slice(0, 3).join(' · ')}
            </span>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white leading-[0.9] group-hover:text-[#00BFFF] transition-colors duration-300">
              {isFr ? project.title.fr : project.title.en}
            </h3>
            <p className="text-[#A8B4C8] text-lg font-light leading-relaxed line-clamp-3">
              {isFr ? project.description.fr : project.description.en}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <span className="text-white text-sm font-semibold border-b border-[#00BFFF] pb-1">
                {isFr ? 'Étude de cas' : 'Case study'}
              </span>
              <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectsGallery;