import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData, type Project as SupabaseProject } from '../../hooks/useSupabaseData';
import SocialShare from '../../components/ui/SocialShare';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * Projects Section — Public display of portfolio projects
 *
 * EVOLUTION 2026: 
 * - "Ce que je construis aujourd'hui"
 * - Shows concrete delivered work as the foundation for intelligent systems
 * - Links naturally to Vision (FacturaPro → AgentFactura, etc.)
 * - Preserves all existing functionality (Supabase, modal, lazy loading)
 */

import { SkeletonProjects } from '../../components/ui/Skeleton';

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

const defaultTitles = {
  fr: ['Le problème', 'La solution', 'Fonctionnalités', 'Les obstacles', 'Le résultat'],
  en: ['The problem', 'The solution', 'Features', 'Obstacles', 'The result'],
};

// P-13 FIX: SVG icon components instead of emoji
const StatusIconDelivered: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const StatusIconProgress: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);

const StatusIconConcept: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
);

const CaseStudyIcons = [
  <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
];

const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { projects: rawProjects, loading, error } = useSupabaseData();
  const [selectedProject, setSelectedProject] = useState<ConvertedProject | null>(null);

  const projects = useMemo((): ConvertedProject[] => {
    return rawProjects.map((p) => {
      const parseCaseStudy = (data: any, titles: string[]) => {
        if (!data) return [];
        try {
          const cs = typeof data === 'string' ? JSON.parse(data) : data;
          return Object.values(cs).map((value: any, index: number) => ({
            title: value?.title || titles[index] || `Step ${index + 1}`,
            content: value?.content || '',
            icon: '', // Icons rendered from CaseStudyIcons array by index
          }));
        } catch {
          return titles.map((title, i) => ({ title, content: '', icon: '' }));
        }
      };

      return {
        id: parseInt(p.id) || 0,
        title: { fr: p.title_fr, en: p.title_en },
        status: p.status,
        description: { fr: p.description_fr, en: p.description_en },
        stack: p.stack || [],
        liveUrl: p.live_url || '',
        imageUrl: p.image_url || '',
        isFeatured: p.is_featured,
        caseStudy: {
          fr: parseCaseStudy(p.case_study_fr, defaultTitles.fr),
          en: parseCaseStudy(p.case_study_en, defaultTitles.en),
        },
      };
    });
  }, [rawProjects]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { text: string; color: string; icon: React.ReactNode }> = {
      delivered: { text: isFr ? 'Livré' : 'Delivered', color: 'bg-green-500', icon: <StatusIconDelivered /> },
      in_progress: { text: isFr ? 'En cours' : 'In Progress', color: 'bg-yellow-500', icon: <StatusIconProgress /> },
      concept: { text: isFr ? 'Concept' : 'Concept', color: 'bg-gray-500', icon: <StatusIconConcept /> },
    };
    return config[status] || config.concept;
  };

  if (loading) {
    return (
      <section id="projects" className="py-24 lg:py-32 relative overflow-hidden bg-[#0A0A1E]">
        <div className="container-custom relative z-10">
          <div className="mb-20 relative">
            <SectionNumber number="02" />
            <div className="heading-mixed relative z-10">
              <span className="label">PROJETS</span>
              <span className="subtitle">
                {isFr ? 'Des problèmes réels, des solutions concrètes.' : 'Real problems, concrete solutions.'}
              </span>
            </div>
          </div>
          <SkeletonProjects />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 lg:py-32 relative overflow-hidden bg-[#0A0A1E]">
      <div className="container-custom relative z-10">
        
        {/* HEADER — EVOLUTION 2026 */}
        <div className="mb-20 relative">
          <SectionNumber number="02" />
          <div className="heading-mixed relative z-10">
            <span className="label">PROJETS</span>
            <span className="subtitle">
              {isFr ? 'Des problèmes observés. Des solutions livrées. Les fondations de systèmes intelligents.' : 'Problems observed. Solutions delivered. The foundations of intelligent systems.'}
            </span>
          </div>
        </div>

        {/* EVOLUTION 2026: Intro paragraph — shows progression */}
        <div className="max-w-3xl mb-16">
          <p className="text-[#A8B4C8] text-lg leading-relaxed">
            {isFr 
              ? "Chaque projet que j'ai livré est né d'un problème réel observé sur le terrain. Ces réalisations concrètes constituent les fondations solides sur lesquelles je construis aujourd'hui des systèmes intelligents. FacturaPro, par exemple, a posé les bases de ce qui deviendra AgentFactura."
              : "Every project I have delivered was born from a real problem observed in the field. These concrete realizations form the solid foundation on which I am now building intelligent systems. FacturaPro, for example, laid the groundwork for what will become AgentFactura."}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-center mb-8">
            {isFr ? 'Erreur de chargement des projets' : 'Error loading projects'}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="glass-card text-center py-12 border-l-4 border-l-[#00BFFF]">
            <svg className="w-12 h-12 mx-auto mb-4 text-[#00BFFF] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <p className="text-[var(--text-secondary)] text-lg">
              {isFr ? 'Aucun projet disponible pour le moment.' : 'No projects available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {projects.map((project) => {
              const status = getStatusBadge(project.status);
              return (
                <motion.div 
                  key={project.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  className="group relative pl-6 border-l-2 border-[#141430] hover:border-[#00BFFF] transition-colors duration-300"
                >
                  {/* Card Container */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Image */}
                    <div className="lg:col-span-5 relative overflow-hidden rounded-lg aspect-video">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={isFr ? project.title.fr : project.title.en} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#141430] to-[#1A1A2E] flex items-center justify-center">
                          <svg className="w-16 h-16 text-[#4A5568] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                      )}
                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-[#0A0A1E] bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                         <div className="text-center">
                            <span className={`inline-block px-3 py-1 ${status.color} text-white text-xs font-bold rounded-full mb-2`}>
                              {status.text}
                            </span>
                         </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[#00BFFF]">{status.icon}</span>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                          {isFr ? project.title.fr : project.title.en}
                        </h3>
                      </div>
                      
                      <p className="text-[#A8B4C8] text-lg mb-6 leading-relaxed">
                        {isFr ? project.description.fr : project.description.en}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.stack.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-[#141430] border border-[#1A1A2E] text-[#A8B4C8] text-xs font-mono rounded hover:border-[#00BFFF] hover:text-[#00BFFF] transition-colors cursor-default">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#00BFFF] font-semibold hover:gap-3 transition-all"
                          >
                            {isFr ? 'Voir le projet' : 'View project'}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                          </a>
                        )}
                        {project.caseStudy.fr.length > 0 && (
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#00BFFF] transition-colors"
                          >
                            <span className="w-8 h-8 rounded-full bg-[#141430] flex items-center justify-center text-sm">
                              <svg className="w-4 h-4 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </span>
                            {isFr ? 'Étude de cas' : 'Case study'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
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
              <button type="button" aria-label="Close" onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 text-[#A8B4C8] hover:text-white z-20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-3xl font-display font-bold text-white mb-2">{isFr ? selectedProject.title.fr : selectedProject.title.en}</h3>
                  <div className="flex items-center gap-2 text-[#00BFFF] text-sm uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    {isFr ? 'Étude de cas détaillée' : 'Detailed case study'}
                  </div>
                </div>

                <div className="space-y-8">
                  {(isFr ? selectedProject.caseStudy.fr : selectedProject.caseStudy.en).map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0A0A1E] border border-[#1A1A2E] flex items-center justify-center text-[#00BFFF]">
                        {CaseStudyIcons[index] || <span className="text-sm font-bold">{index + 1}</span>}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">{index + 1}. {step.title}</h4>
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

export default Projects;