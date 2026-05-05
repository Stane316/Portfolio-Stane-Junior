/**
 * GrowTech Section Component
 * 
 * Showcases the agency with:
 * - Configurable logo (image or fallback monogram)
 * - Agency description
 * - Team members
 * - Services
 * - CTAs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const GrowTech: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  // Get logo URL from config
  const logoUrl = siteConfig['growtech_logo_url']?.value_generic || '';
  const logoAlt = siteConfig['growtech_logo_alt']?.value_en || 'GROW TECH Logo';

  const team = [
    { name: 'Stane-Junior Aniambossou', role: isFr ? 'Fondateur · Tech Lead' : 'Founder · Tech Lead', initial: 'SJ' },
    { name: 'Godo Landron', role: isFr ? 'Co-fondateur · Directeur Commercial' : 'Co-founder · Sales Director', initial: 'GL' },
    { name: 'Huriel DENAKPO', role: isFr ? 'Développeur Backend' : 'Backend Developer', initial: 'HD' },
    { name: 'Espanedi', role: isFr ? 'Développeur Front & Back' : 'Front & Back Developer', initial: 'ES' },
    { name: 'Expedy', role: isFr ? 'Agent Commercial' : 'Sales Agent', initial: 'EX' },
    { name: 'OLAFA Mauricia', role: isFr ? 'Agente Commerciale' : 'Sales Agent', initial: 'OM' },
  ];

  const services = [
    isFr ? 'Sites vitrines professionnels' : 'Professional showcase websites',
    isFr ? 'Applications web sur mesure' : 'Custom web applications',
    isFr ? 'Solutions SaaS pour le marché africain' : 'SaaS solutions for African market',
    isFr ? 'Accompagnement digital PME' : 'SME digital accompaniment',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Render logo (image or fallback monogram)
  const renderLogo = () => {
    if (logoUrl && logoUrl.trim() !== '') {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 sm:mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 glass rounded-2xl overflow-hidden flex items-center justify-center border-2 border-[var(--accent-cyan)]">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                // Fallback to monogram if image fails
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.parentElement;
                if (fallback) {
                  fallback.innerHTML = '<span class="font-heading text-4xl text-white">GT</span>';
                }
              }}
            />
          </div>
        </motion.div>
      );
    }

    // Fallback: Monogram "GT"
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="inline-block mb-4 sm:mb-6"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 glass rounded-2xl flex items-center justify-center border-2 border-[var(--accent-cyan)]">
          <span className="font-heading text-4xl sm:text-5xl text-white">GT</span>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="growtech" className="py-16 sm:py-20 md:py-24 lg:py-32 relative bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Logo (image or monogram) */}
            {renderLogo()}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4 px-2">
              <span className="text-gradient">
                {isFr
                  ? "GROW TECH — L'agence que j'ai fondée"
                  : 'GROW TECH — The agency I co-founded'}
              </span>
            </h2>
            <p className="text-[var(--accent-cyan)] font-heading text-lg sm:text-xl mb-1 sm:mb-2">
              {isFr ? 'Votre Vision, Notre Technologie.' : 'Your Vision, Our Technology.'}
            </p>
            <p className="text-[var(--text-muted)] font-heading text-base sm:text-lg px-4">
              {isFr ? 'Innover • Développer • Faire Grandir.' : 'Innovate • Develop • Grow.'}
            </p>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent-cyan)] mx-auto rounded-full mt-4" />
          </div>

          {/* Description */}
          <motion.div
            variants={itemVariants}
            className="glass-card max-w-3xl mx-auto mb-12 sm:mb-16 text-center px-3"
          >
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              {isFr
                ? "GROW TECH est une agence digitale estudiantine que j'ai co-fondée avec Godo Landron. Six personnes. Trois squads : Front-End, Back-End, Commercial. On développe des sites vitrines, des applications sur mesure et des solutions digitales pour les entreprises du Bénin et de la sous-région OHADA. Ce n'est pas un projet académique. C'est une structure réelle, avec des clients réels, des contrats signés, des projets livrés."
                : "GROW TECH is a student digital agency I co-founded with Godo Landron. Six people. Three squads: Front-End, Back-End, Sales. We build websites, custom applications, and digital solutions for businesses in Benin and the OHADA sub-region. This is not an academic project. It's a real structure, with real clients, signed contracts, and delivered projects."}
            </p>
          </motion.div>

          {/* Team Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 sm:mb-16"
          >
            <h3 className="text-xl sm:text-2xl font-display font-bold text-center mb-6 sm:mb-8">
              {isFr ? "L'équipe" : 'The team'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="team-card group py-2 sm:py-3 px-1"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-cyan)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="font-heading text-sm sm:text-base md:text-lg text-white">{member.initial}</span>
                  </div>
                  <h4 className="text-white font-semibold text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 leading-tight px-0.5 line-clamp-2">{member.name}</h4>
                  <p className="text-[var(--text-secondary)] text-[9px] sm:text-xs leading-tight px-0.5">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 sm:mb-16"
          >
            <h3 className="text-xl sm:text-2xl font-display font-bold text-center mb-6 sm:mb-8">
              {isFr ? 'Nos services' : 'Our services'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="team-card group py-3 sm:py-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent-cyan)] transition-colors">
                    <span className="text-[var(--accent-cyan)] text-lg sm:text-xl">✓</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs sm:text-sm px-2">{service}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <button
              className="btn-primary inline-flex items-center justify-center gap-2 min-h-[48px] opacity-50 cursor-not-allowed"
              disabled
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm sm:text-base">{isFr ? 'Bientôt disponible' : 'Coming soon'}</span>
            </button>
            <a href="#contact" className="btn-secondary inline-flex items-center justify-center gap-2 min-h-[48px]">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm sm:text-base">{isFr ? 'Nous contacter' : 'Contact us'}</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default GrowTech;
