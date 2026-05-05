/**
 * About Section Component
 * 
 * Personal introduction with:
 * - Photo on the left
 * - Text content on the right
 * - Quick facts list
 * - CV download button
 * 
 * @see /src/contexts/LanguageContext.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const About: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const facts = [
    { icon: '📍', text: isFr ? 'Abomey-Calavi, Bénin' : 'Abomey-Calavi, Benin' },
    { icon: '🎓', text: isFr ? 'IFRI-UAC — Licence 1 Dev Logiciel' : 'IFRI-UAC — Software Dev Licence 1' },
    { icon: '🏢', text: isFr ? 'Fondateur & Tech Lead — GROW TECH' : 'Founder & Tech Lead — GROW TECH' },
    { icon: '🌍', text: isFr ? 'Zone OHADA — 17 pays cibles' : 'OHADA Zone — 17 target countries' },
    { icon: '⚡', text: isFr ? 'Disponible pour missions freelance' : 'Available for freelance missions' },
  ];

  const paragraphs = [
    isFr
      ? "J'ai 18 ans, je suis en Licence 1 à l'IFRI-UAC à Abomey-Calavi, et je code depuis que j'ai compris qu'on pouvait transformer une idée en quelque chose de réel avec juste un clavier."
      : "I'm 18, studying Software Development (Licence 1) at IFRI-UAC in Abomey-Calavi, and I've been coding since I realized you can turn an idea into something real with just a keyboard.",
    isFr
      ? "Ce qui me motive n'est pas l'outil. C'est le problème à résoudre. J'ai travaillé dans une agence Mobile Money, j'ai vu comment les petits commerçants béninois gèrent — ou plutôt ne gèrent pas — leurs factures. C'est de là qu'est né FacturaPro. J'ai voulu faire plaisir à quelqu'un d'une façon que personne d'autre ne pouvait faire. C'est de là qu'est né Capsule."
      : "What drives me isn't the tool. It's the problem to solve. I worked at a Mobile Money agency and watched how small Beninese merchants handle — or rather don't handle — their invoicing. That's where FacturaPro came from. I wanted to create something special for someone in a way nobody else could. That's where Capsule came from.",
    isFr
      ? "Aujourd'hui, j'ai fondé GROW TECH avec un collaborateur. Six personnes. Une vraie agence. On développe des solutions digitales pour les entreprises du Bénin et de la sous-région."
      : "Today, I co-founded GROW TECH with a business partner. Six people. A real agency. We build digital solutions for businesses in Benin and the West African sub-region.",
    isFr
      ? "Je suis développeur. Mais surtout, je suis quelqu'un qui observe, qui comprend, et qui code pour résoudre."
      : "I'm a developer. But above all, I'm someone who observes, understands, and codes to solve.",
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 lg:py-32 relative" aria-labelledby="about-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="about-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              <span className="text-gradient">{isFr ? 'À propos de moi' : 'About me'}</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[#00BFFF] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute w-56 h-56 md:w-72 md:h-72 bg-[#1A6FC4] rounded-full blur-[80px] opacity-20" />
                <div className="relative w-56 h-56 md:w-72 md:h-72 glass rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] opacity-30" />
                  <span className="absolute text-4xl md:text-6xl font-display font-bold text-white opacity-50">SJ</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[#A8B4C8] leading-relaxed text-sm sm:text-base">{paragraph}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {facts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <span className="text-xl sm:text-2xl flex-shrink-0">{fact.icon}</span>
                    <span className="text-[#A8B4C8] text-xs sm:text-sm">{fact.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                href="#"
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isFr ? 'Télécharger mon CV' : 'Download my CV'}
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
