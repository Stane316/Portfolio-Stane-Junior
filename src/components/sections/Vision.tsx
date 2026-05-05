/**
 * Vision Section Component
 * 
 * Shows future projects and ideas:
 * - FacturaPro (OHADA invoicing SaaS)
 * - BeninPro (professional marketplace)
 * 
 * Demonstrates product thinking and market research.
 * 
 * @see /src/contexts/LanguageContext.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const Vision: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const visions = [
    {
      id: 1,
      title: 'FacturaPro',
      badge: isFr ? 'En pause · Concept documenté' : 'On hold · Documented concept',
      target: isFr ? 'Zone OHADA — 17 pays' : 'OHADA Zone — 17 countries',
      description: {
        fr: "SaaS de facturation conforme OHADA conçu pour les entrepreneurs et PME d'Afrique francophone. Né de mon expérience comme agent Mobile Money, où j'ai observé quotidiennement des commerçants sans outil de facturation professionnel. Stack envisagée : React 18, Supabase, FedaPay, Africa's Talking. Monétisation Freemium en FCFA.",
        en: "OHADA-compliant invoicing SaaS designed for entrepreneurs and SMEs across French-speaking Africa. Born from my experience as a Mobile Money agent, where I daily observed merchants with no professional invoicing tool. Planned stack: React 18, Supabase, FedaPay, Africa's Talking. Freemium monetization in FCFA."
      },
      features: [
        isFr ? 'Facturation conforme OHADA' : 'OHADA-compliant invoicing',
        isFr ? 'Paiement Mobile Money' : 'Mobile Money payment',
        isFr ? 'Freemium en FCFA' : 'Freemium in FCFA',
        isFr ? 'Multi-devises' : 'Multi-currency',
      ],
    },
    {
      id: 2,
      title: 'BeninPro',
      badge: isFr ? 'Concept documenté' : 'Documented concept',
      target: isFr ? 'Marché béninois' : 'Beninese market',
      description: {
        fr: "Marketplace dédiée aux professionnels et services béninois. Mettre en relation clients et prestataires locaux sur une plateforme adaptée au contexte béninois : paiement Mobile Money, interface mobile-first, catégories alignées sur les secteurs actifs au Bénin.",
        en: "Marketplace dedicated to Beninese professionals and services. Connecting clients with local service providers on a platform adapted to the Beninese context: Mobile Money payment, mobile-first interface, categories aligned with active sectors in Benin."
      },
      features: [
        isFr ? 'Paiement Mobile Money' : 'Mobile Money payment',
        isFr ? 'Interface mobile-first' : 'Mobile-first interface',
        isFr ? 'Catégories locales' : 'Local categories',
        isFr ? 'Système d\'avis' : 'Review system',
      ],
    },
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

  return (
    <section id="vision" className="py-20 md:py-32 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              <span className="text-gradient">
                {isFr ? "Ce que je construis pour demain" : "What I'm building for tomorrow"}
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              {isFr
                ? 'Des idées documentées, des problèmes réels, des marchés identifiés.'
                : 'Documented ideas, real problems, identified markets.'}
            </p>
            <div className="w-20 h-1 bg-[var(--accent-cyan)] mx-auto rounded-full mt-4" />
          </div>

          {/* Explanation */}
          <motion.div
            variants={itemVariants}
            className="glass-card max-w-3xl mx-auto mb-16 text-center"
          >
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {isFr
                ? "Ces projets ne sont pas encore livrés. Ils sont en réflexion, en pause ou en construction. Je les présente ici non pas pour prétendre qu'ils existent, mais parce qu'ils témoignent d'une façon de penser : observer un problème de marché, documenter une solution, valider avant de coder."
                : "These projects are not yet delivered. They are in reflection, on hold, or under construction. I present them here not to claim they exist, but because they demonstrate a way of thinking: observe a market problem, document a solution, validate before coding."}
            </p>
          </motion.div>

          {/* Visions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {visions.map((vision) => (
              <motion.div key={vision.id} variants={itemVariants} className="project-card">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-display font-bold text-white">{vision.title}</h3>
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                    {vision.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4 text-[var(--text-muted)] text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vision.target}</span>
                </div>

                <p className="text-[var(--text-secondary)] mb-6">{vision.description[isFr ? 'fr' : 'en']}</p>

                <div className="grid grid-cols-2 gap-2">
                  {vision.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full" />
                      <span className="text-[var(--text-secondary)] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;
