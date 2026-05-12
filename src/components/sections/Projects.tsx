import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData, type Project as SupabaseProject } from '../../hooks/useSupabaseData';
import SocialShare from '../../components/ui/SocialShare';
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

const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { projects: rawProjects, loading, error } = useSupabaseData();
  const [selectedProject, setSelectedProject] = useState<ConvertedProject | null>(null);

  const projects = useMemo((): ConvertedProject[] => {
    return rawProjects.map((p) => {
      const parseCaseStudy = (data: any, icons: string[], titles: string[]) => {
        if (!data) return [];
        try {
          const cs = typeof data === 'string' ? JSON.parse(data) : data;
          return Object.values(cs).map((value: any, index: number) => ({
            title: value?.title || titles[index] || `Step ${index + 1}`,
            content: value?.content || '',
            icon: icons[index] || '📋',
          }));
        } catch {
          return icons.map((icon, i) => ({ title: titles[i], content: '', icon }));
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
          fr: parseCaseStudy(p.case_study_fr, CASE_STUDY_ICONS.fr, defaultTitles.fr),
          en: parseCaseStudy(p.case_study_en, CASE_STUDY_ICONS.en, defaultTitles.en),
        },
      };
    });
  }, [rawProjects]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { text: string; color: string; icon: string }> = {
      delivered: { text: isFr ? 'Livré' : 'Delivered', color: 'bg-green-500', icon: '✅' },
      in_progress: { text: isFr ? 'En cours' : 'In Progress', color: 'bg-yellow-500', icon: '🔄' },
      concept: { text: isFr ? 'Concept' : 'Concept', color: 'bg-gray-500', icon: '💭' },
    };
    return config[status] || config.concept;
  };

  if (loading) {
    return (
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="w-16 h-1 bg-[#00BFFF] mb-12" />
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-[#141430] rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-[#141430] rounded"></div>
                  <div className="h-4 bg-[#141430] rounded col-span-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 lg:py-32 relative overflow-hidden bg-[#0A0A1E]">
      <div className="container-custom relative z-10">
        
        {/* HEADER DE SECTION NOUVEAU STYLE */}
        <div className="mb-20 relative">
          <SectionNumber number="02" />
          <div className="heading-mixed relative z-10">
            <span className="label">PROJETS</span>
            <span className="subtitle">
              {isFr ? 'Des problèmes réels, des solutions concrètes.' : 'Real problems, concrete solutions.'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-center mb-8">
            {isFr ? 'Erreur de chargement des projets' : 'Error loading projects'}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="glass-card text-center py-12 border-l-4 border-l-[#00BFFF]">
            <span className="text-4xl mb-4 block">🚀</span>
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
                          <span className="text-6xl opacity-20">🚀</span>
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
                        <span className="text-2xl">{status.icon}</span>
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
                            <span className="w-8 h-8 rounded-full bg-[#141430] flex items-center justify-center text-sm">📖</span>
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

      {/* MODAL (Inchangée pour garder la fonctionnalité) */}
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
                  <p className="text-[#00BFFF] text-sm uppercase tracking-widest">📖 {isFr ? 'Étude de cas détaillée' : 'Detailed case study'}</p>
                </div>

                <div className="space-y-8">
                  {(isFr ? selectedProject.caseStudy.fr : selectedProject.caseStudy.en).map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0A0A1E] border border-[#1A1A2E] flex items-center justify-center text-xl">
                        {step.icon}
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