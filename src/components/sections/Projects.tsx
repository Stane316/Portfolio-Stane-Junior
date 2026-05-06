import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData, type Project as SupabaseProject } from '../../hooks/useSupabaseData';
import SocialShare from '../../components/ui/SocialShare';

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

  // Conversion simple sans filtrage/recherche
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
      delivered: { text: isFr ? 'Livré · En production' : 'Delivered · In production', color: 'bg-green-500', icon: '✅' },
      in_progress: { text: isFr ? 'En cours d\'évolution' : 'In development', color: 'bg-yellow-500', icon: '🔄' },
      concept: { text: isFr ? 'Concept' : 'Concept', color: 'bg-gray-500', icon: '💭' },
    };
    return config[status] || config.concept;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{isFr ? 'Chargement des projets...' : 'Loading projects...'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              <span className="text-gradient">{isFr ? 'Projets réels' : 'Real projects'}</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-2">
              {isFr ? 'Des problèmes observés. Des solutions livrées.' : 'Problems observed. Solutions delivered.'}
            </p>
            <div className="w-16 sm:w-20 h-1 bg-cyan-400 mx-auto rounded-full mt-4" />
          </div>

          {error && (
            <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-center mb-8">
              {isFr ? 'Erreur de chargement des projets' : 'Error loading projects'}
            </div>
          )}

          {projects.length === 0 ? (
            <div className="glass-card text-center py-12">
              <span className="text-4xl mb-4 block">🚀</span>
              <p className="text-[var(--text-secondary)]">
                {isFr ? 'Aucun projet disponible pour le moment.' : 'No projects available at the moment.'}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              {projects.map((project) => {
                const status = getStatusBadge(project.status);

                return (
                  <motion.div key={project.id} variants={itemVariants}>
                    <div className="project-card">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
                        {project.imageUrl ? (
                          <div className="w-full sm:w-48 md:w-56 h-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                            <img
                              src={project.imageUrl}
                              alt={isFr ? project.title.fr : project.title.en}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-full sm:w-48 md:w-56 h-32 sm:h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                            <span className="text-4xl opacity-50">🚀</span>
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{status.icon}</span>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                {isFr ? project.title.fr : project.title.en}
                              </h3>
                            </div>
                            <span className={`px-2 sm:px-3 py-1 ${status.color} text-white text-xs font-semibold rounded-full whitespace-nowrap self-start`}>
                              {status.text}
                            </span>
                          </div>
                          <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                            {isFr ? project.description.fr : project.description.en}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.stack.map((tech, index) => (
                              <span key={index} className="px-2 sm:px-3 py-1 bg-gray-800 border border-gray-700 text-cyan-400 text-xs font-mono rounded-full">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <SocialShare
                        title={isFr ? project.title.fr : project.title.en}
                        url={project.liveUrl || window.location.href}
                        description={isFr ? project.description.fr : project.description.en}
                        className="mb-4"
                      />

                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-2 min-h-[48px]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="text-sm sm:text-base">{isFr ? 'Voir le projet' : 'View project'}</span>
                          </a>
                        )}
                        {project.caseStudy.fr.length > 0 && (
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="btn-secondary inline-flex items-center justify-center gap-2 min-h-[48px]"
                          >
                            <span className="text-sm sm:text-base">📖 {isFr ? 'Étude de cas' : 'Case study'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative glass-card w-full max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-white transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="pb-4 sm:pb-6 border-b border-gray-800 mb-4 sm:mb-6 pr-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {isFr ? selectedProject.title.fr : selectedProject.title.en}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  📖 {isFr ? 'Étude de cas détaillée' : 'Detailed case study'}
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8 px-1 sm:px-0 pb-4">
                {(isFr ? selectedProject.caseStudy.fr : selectedProject.caseStudy.en).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {index > 0 && (
                      <div className="absolute left-6 top-0 w-0.5 h-4 bg-gray-700 -mt-6" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">
                          {index + 1}. {step.title}
                        </h4>
                        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700">
                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                            {step.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-800 text-center">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-2"
                  >
                    🔗 {isFr ? 'Voir le projet en ligne' : 'View project live'} →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;