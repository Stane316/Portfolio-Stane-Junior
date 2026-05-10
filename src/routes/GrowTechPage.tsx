import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionNumber from '../components/ui/SectionNumber';

// Composant Animation Intro GROW TECH
const GrowTechIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  const text = "GROW TECH";
  const slogan = "Votre Vision, Notre Technologie";

  useEffect(() => {
    const timer = setTimeout(onComplete, 3500); // Durée totale de l'intro
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] bg-[#0A0A1E] flex flex-col items-center justify-center"
    >
      <div className="text-center">
        {/* Titre Principal Lettre par Lettre */}
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter mb-6"
        >
          {text.split('').map((char, i) => (
            <motion.span key={i} variants={letterVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Slogan avec effet de brillance */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-[#00BFFF] text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase"
        >
          {slogan}
        </motion.p>

        {/* Barre de progression */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3, ease: 'easeInOut', delay: 0.5 }}
          className="h-1 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto mt-12 w-64"
        />
      </div>
    </motion.div>
  );
};

const GrowTechPage: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: config, error } = await supabase.from('site_config').select('*').eq('key', 'growtech_data').single();
        if (!error && config?.value_generic) setData(JSON.parse(config.value_generic));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center text-[#A8B4C8]">Données non disponibles</div>;

  const members = data.members || [];
  const visibleMembers = showAllMembers ? members : members.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      {/* Animation Intro */}
      <AnimatePresence>
        {showIntro && <GrowTechIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <Navbar />
      <main className={`pt-32 pb-24 transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 space-y-32">
          
          {/* Header Agence */}
          <section>
            <div className="relative mb-12">
              <SectionNumber number="AG" />
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">GROW TECH</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Description (Gauche) */}
              <div className="lg:col-span-7 space-y-6">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#A8B4C8] text-lg lg:text-xl leading-relaxed"
                >
                  {isFr ? data.description_fr : data.description_en}
                </motion.p>
                {data.vision.title_fr && (
                  <div className="bg-[#141430] border-l-4 border-[#00BFFF] p-6 rounded-r-xl mt-8">
                    <h3 className="text-white font-bold text-xl mb-2">{isFr ? data.vision.title_fr : data.vision.title_en}</h3>
                    <p className="text-[#A8B4C8]">{isFr ? data.vision.content_fr : data.vision.content_en}</p>
                  </div>
                )}
              </div>

              {/* Logo (Droite) */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full max-w-sm aspect-square bg-[#141430] rounded-3xl border border-[#1A1A2E] flex items-center justify-center p-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] opacity-10" />
                  {data.logo_url ? (
                    <img src={data.logo_url} alt="Logo GROW TECH" className="w-full h-full object-contain relative z-10" />
                  ) : (
                    <span className="text-8xl font-heading text-white opacity-20 relative z-10">GT</span>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Projets : Scroll Horizontal + Détails */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="mb-12">
                <h2 className="text-4xl lg:text-5xl font-heading text-white mb-4">{isFr ? 'Nos Réalisations' : 'Our Projects'}</h2>
                <p className="text-[#A8B4C8]">{isFr ? 'Des solutions concrètes pour des problèmes réels.' : 'Concrete solutions for real problems.'}</p>
              </div>

              {/* 1. Scroll Horizontal (Aperçu) */}
              <div className="flex gap-6 overflow-x-auto pb-8 mb-16 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
                {data.projects.map((proj: any) => (
                  <div key={proj.id} className="min-w-[280px] md:min-w-[350px] snap-center bg-[#141430] border border-[#1A1A2E] rounded-2xl overflow-hidden group hover:border-[#00BFFF] transition-colors">
                    <div className="h-48 overflow-hidden bg-[#0A0A1E]">
                      {proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🚀</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1">{isFr ? proj.title_fr : proj.title_en}</h3>
                      <p className="text-[#A8B4C8] text-xs line-clamp-2">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Détails Alternés */}
              <div className="space-y-24">
                {data.projects.map((proj: any, index: number) => (
                  <motion.div 
                    key={`detail-${proj.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  >
                    <div className="w-full lg:w-3/5 aspect-video rounded-2xl overflow-hidden border border-[#1A1A2E]">
                      {proj.image_url ? (
                        <img src={proj.image_url} alt={proj.title_fr} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#141430] flex items-center justify-center text-6xl">🚀</div>
                      )}
                    </div>
                    <div className="w-full lg:w-2/5 space-y-4">
                      <span className="text-[#00BFFF] text-xs font-bold uppercase tracking-widest">{proj.status === 'delivered' ? (isFr ? 'Livré' : 'Delivered') : (isFr ? 'En cours' : 'In Progress')}</span>
                      <h3 className="text-3xl font-heading text-white">{isFr ? proj.title_fr : proj.title_en}</h3>
                      <p className="text-[#A8B4C8] leading-relaxed">{proj.description}</p>
                      
                      {/* Stack */}
                      {proj.stack && proj.stack.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.stack.map((tech: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-[#141430] border border-[#1A1A2E] rounded-full text-[#A8B4C8] text-xs">{tech}</span>
                          ))}
                        </div>
                      )}

                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" className="inline-flex items-center gap-2 text-white font-semibold hover:text-[#00BFFF] transition-colors mt-4">
                          {isFr ? 'Voir le projet' : 'View Project'}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                      )}

                      {/* Case Study Preview */}
                      {proj.case_study_fr && (
                        <div className="pt-4 border-t border-[#1A1A2E] mt-4">
                          <h4 className="text-white text-sm font-bold mb-2">{isFr ? 'Étude de cas' : 'Case Study'}</h4>
                          <div className="space-y-3">
                            {Object.values(isFr ? proj.case_study_fr : proj.case_study_en).map((step: any, i: number) => (
                              <div key={i} className="flex gap-3 text-sm">
                                <span className="text-[#00BFFF] font-bold">{i + 1}.</span>
                                <div>
                                  <span className="text-white font-semibold block">{step.title}</span>
                                  <span className="text-[#A8B4C8] text-xs">{step.content}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Équipe : Limité à 3 + Bouton */}
          {members.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-heading text-white mb-4">{isFr ? 'L\'Équipe' : 'The Team'}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {visibleMembers.map((member: any, i: number) => (
                  <motion.div 
                    key={member.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 text-center hover:border-[#00BFFF] transition-all group"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#1A1A2E] group-hover:border-[#00BFFF] transition-colors">
                      {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#0A0A1E] flex items-center justify-center text-3xl font-heading text-[#00BFFF]">{member.initial}</div>
                      )}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{member.name}</h3>
                    <p className="text-[#00BFFF] font-medium">{isFr ? member.role_fr : member.role_en}</p>
                  </motion.div>
                ))}
              </div>

              {members.length > 3 && (
                <div className="text-center">
                  <button 
                    onClick={() => setShowAllMembers(!showAllMembers)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#141430] border border-[#1A1A2E] text-white rounded-full hover:border-[#00BFFF] hover:text-[#00BFFF] transition-all"
                  >
                    {showAllMembers ? (isFr ? 'Voir moins' : 'See less') : (isFr ? `Voir les ${members.length} membres` : `See all ${members.length} members`)}
                    <svg className={`w-4 h-4 transition-transform ${showAllMembers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              )}

              {/* Membres supplémentaires (Cachés par défaut) */}
              <AnimatePresence>
                {showAllMembers && members.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pt-8 border-t border-[#1A1A2E]">
                      {members.slice(3).map((member: any, i: number) => (
                        <motion.div 
                          key={member.id} 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 text-center hover:border-[#00BFFF] transition-all group"
                        >
                          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#1A1A2E] group-hover:border-[#00BFFF] transition-colors">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#0A0A1E] flex items-center justify-center text-3xl font-heading text-[#00BFFF]">{member.initial}</div>
                            )}
                          </div>
                          <h3 className="text-white font-bold text-xl mb-2">{member.name}</h3>
                          <p className="text-[#00BFFF] font-medium">{isFr ? member.role_fr : member.role_en}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GrowTechPage;