import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionNumber from '../components/ui/SectionNumber';
import SocialShare from '../components/ui/SocialShare';

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

const ProjectsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { projects: rawProjects, loading, error } = useSupabaseData();
  const [selectedProject, setSelectedProject] = useState<ConvertedProject | null>(null);

  const projects: ConvertedProject[] = rawProjects.map((p) => ({
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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { text: string; color: string; icon: string }> = {
      delivered: { text: isFr ? 'Livré' : 'Delivered', color: 'bg-green-500', icon: '✅' },
      in_progress: { text: isFr ? 'En cours' : 'In Progress', color: 'bg-yellow-500', icon: '🔄' },
      concept: { text: isFr ? 'Concept' : 'Concept', color: 'bg-gray-500', icon: '💭' },
    };
    return config[status] || config.concept;
  };

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      <Navbar />
      
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <div className="mb-24 lg:mb-32">
            <div className="relative">
              <SectionNumber number="02" />
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
                TOUS LES PROJETS
              </h1>
              <p className="text-[#A8B4C8] text-lg lg:text-xl font-light mt-4 max-w-md relative z-10">
                {isFr ? 'L\'intégralité de mes réalisations.' : 'All my achievements.'}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-[#00BFFF] text-sm font-mono">{rawProjects.length} {isFr ? 'PROJETS' : 'PROJECTS'}</span>
                <div className="h-px bg-[#141430] flex-1" />
              </div>
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
              {projects.map((project, index) => {
                const status = getStatusBadge(project.status);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="group"
                  >
                    <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
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
                      </div>

                      <div className="w-full lg:w-2/5 flex flex-col justify-center">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{status.icon}</span>
                            <span className={`px-3 py-1 ${status.color} text-white text-xs font-semibold rounded-full`}>
                              {status.text}
                            </span>
                          </div>
                          
                          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white leading-[0.9] group-hover:text-[#00BFFF] transition-colors duration-300">
                            {isFr ? project.title.fr : project.title.en}
                          </h3>
                          
                          <p className="text-[#A8B4C8] text-lg font-light leading-relaxed">
                            {isFr ? project.description.fr : project.description.en}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {project.stack.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-[#141430] border border-[#1A1A2E] text-[#A8B4C8] text-xs font-mono rounded">
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-4 pt-6">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00BFFF] text-black font-semibold rounded hover:bg-opacity-80 transition-colors"
                              >
                                {isFr ? 'Voir le projet' : 'View project'}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                            )}
                            {project.caseStudy.fr.length > 0 && (
                              <button
                                onClick={() => setSelectedProject(project)}
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00BFFF] text-[#00BFFF] font-semibold rounded hover:bg-[#00BFFF] hover:text-black transition-all"
                              >
                                <span>📖</span>
                                {isFr ? 'Étude de cas' : 'Case study'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

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
    </div>
  );
};

export default ProjectsPage;