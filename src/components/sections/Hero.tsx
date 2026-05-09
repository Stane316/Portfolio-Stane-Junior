import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const Hero: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  const getStat = (key: string, field: 'value' | 'label') => {
    const config = siteConfig[`hero_stat_${key}`];
    if (!config) return field === 'value' ? '0' : '';
    return field === 'value' ? config.value_generic || '0' : (isFr ? config.value_fr : config.value_en);
  };

  const badge = siteConfig['hero_badge'] 
    ? (isFr ? siteConfig['hero_badge'].value_fr : siteConfig['hero_badge'].value_en)
    : (isFr ? 'Disponible pour missions freelance' : 'Available for freelance missions');

  const tagline = siteConfig['hero_tagline']
    ? (isFr ? siteConfig['hero_tagline'].value_fr : siteConfig['hero_tagline'].value_en)
    : (isFr 
        ? "Je ne construis pas juste des sites web. Je code des solutions à des problèmes que j'ai observés, vécus, compris."
        : "I don't just build websites. I code solutions to problems I've observed, lived, and understood.");

  const ctaProjects = isFr ? 'Voir mes projets' : 'See my projects';
  const ctaContact = isFr ? 'Me contacter' : 'Get in touch';
  const cvUrl = siteConfig['cv_url']?.value_generic || '#';

  const heroImageUrl = siteConfig['hero_image_url']?.value_generic || '';

  const stats = [
    { value: getStat('1', 'value'), label: getStat('1', 'label') },
    { value: getStat('2', 'value'), label: getStat('2', 'label') },
    { value: getStat('3', 'value'), label: getStat('3', 'label') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-32 lg:pt-20 overflow-hidden">
      <div className="gradient-mesh" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-full">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-xs sm:text-sm font-semibold whitespace-nowrap">{badge}</span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-gradient">{isFr ? 'Étudiant Développeur' : 'Developer Student'}</span>
              <br className="sm:hidden" />
              <span className="text-white">{isFr ? "& Fondateur d'Agence" : '& Agency Founder'}</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 px-2">
              {tagline}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              <a href="#projects" className="btn-primary inline-flex items-center justify-center gap-2 min-h-[48px] px-5 sm:px-6 md:px-8">
                <span className="text-sm sm:text-base">{ctaProjects}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              <a href="#contact" className="btn-secondary inline-flex items-center justify-center min-h-[48px] px-5 sm:px-6 md:px-8">
                <span className="text-sm sm:text-base">{ctaContact}</span>
              </a>
            </motion.div>

            {cvUrl && cvUrl !== '#' && (
              <motion.a variants={itemVariants} href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm px-2 mb-6 sm:mb-8">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {isFr ? 'Télécharger mon CV' : 'Download my CV'}
              </motion.a>
            )}

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-2xl mx-auto lg:mx-0">
              {stats.map((stat, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="glass-card text-center py-2 sm:py-3 md:py-4">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-cyan-400 mb-0 sm:mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm px-1 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            {/* Photo Hero Adaptée */}
            <div className="flex justify-center items-center relative">
               {/* Halo derrière */}
               <div className="absolute w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-cyan-400 rounded-full blur-[80px] sm:blur-[100px] opacity-20 sm:opacity-30 animate-pulse" />
    
               {/* Container de l'image - S'adapte au contenu */}
               <div className="relative w-auto h-auto max-w-[400px] max-h-[600px] animate-float">
                   {/* Cadres décoratifs */}
                   <div className="absolute inset-0 glass rounded-2xl sm:rounded-3xl rotate-3 sm:rotate-6 opacity-60" />
                   <div className="absolute inset-0 glass rounded-2xl sm:rounded-3xl -rotate-3 sm:-rotate-6 opacity-60" />
        
                   <div className="relative bg-[#141430] border border-[#1A1A2E] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                       {heroImageUrl ? (
                          // object-contain garantit que la photo entière est visible
                           <img 
                              src={heroImageUrl} 
                              alt="Stane-Junior Aniambossou" 
                              className="w-full h-auto max-h-[600px] object-contain" 
                            />
                     ) : (
                          // Fallback si pas de photo
                          <div className="w-[350px] h-[450px] flex items-center justify-center">
                             <span className="text-8xl font-heading text-white opacity-50">SJ</span>
                          </div>
                      )}
                   </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-cyan-400 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;