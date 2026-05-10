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
import SectionNumber from '../../components/ui/SectionNumber';

interface TeamMember {
  name: string;
  role: string;
  initial: string;
}

const GrowTech: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const team: TeamMember[] = [
    { name: 'Stane-Junior Aniambossou', role: isFr ? 'Fondateur & Tech Lead' : 'Founder & Tech Lead', initial: 'SJ' },
    { name: 'Godo Landron', role: isFr ? 'Co-fondateur & Biz Dev' : 'Co-founder & Biz Dev', initial: 'GL' },
    { name: 'Huriel DENAKPO', role: isFr ? 'Lead Backend' : 'Lead Backend', initial: 'HD' },
    { name: 'Espendi', role: isFr ? 'Lead Frontend' : 'Lead Frontend', initial: 'ES' },
    { name: 'Expedy', role: isFr ? 'Sales Manager' : 'Sales Manager', initial: 'EX' },
    { name: 'OLAFA Mauricia', role: isFr ? 'Sales Manager' : 'Sales Manager', initial: 'OM' },
  ];

  const services = isFr 
    ? ['Développement Web & Mobile', 'Design UI/UX', 'Solutions SaaS', 'Consulting Digital', 'Intégration API', 'Maintenance & Support']
    : ['Web & Mobile Dev', 'UI/UX Design', 'SaaS Solutions', 'Digital Consulting', 'API Integration', 'Maintenance & Support'];

  return (
    <section id="growtech" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="04" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              GROW TECH
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Votre vision, notre technologie.' : 'Your vision, our technology.'}
            </p>
          </div>
        </div>

        {/* Layout 2 Colonnes : Intro + Services */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          
          {/* Colonne Gauche: Description (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl text-white font-bold"
            >
              {isFr ? 'Une agence digitale née de l\'observation.' : 'A digital agency born from observation.'}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#A8B4C8] text-lg leading-relaxed"
            >
              {isFr 
                ? 'GROW TECH n\'est pas qu\'une entreprise, c\'est une réponse aux défis numériques de l\'Afrique. Nous combinons expertise technique et compréhension locale pour créer des outils qui ont un impact réel sur le terrain.'
                : 'GROW TECH is more than a company; it\'s a response to Africa\'s digital challenges. We combine technical expertise with local understanding to create tools that have a real impact on the ground.'}
            </motion.p>

            {/* Stats Rapides */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[#1A1A2E]"
            >
              <div>
                <span className="block text-3xl font-heading text-[#00BFFF]">6</span>
                <span className="text-xs text-[#4A5568] uppercase tracking-widest">{isFr ? 'Experts' : 'Experts'}</span>
              </div>
              <div>
                <span className="block text-3xl font-heading text-[#00BFFF]">3</span>
                <span className="text-xs text-[#4A5568] uppercase tracking-widest">{isFr ? 'Squads' : 'Squads'}</span>
              </div>
              <div>
                <span className="block text-3xl font-heading text-[#00BFFF]">100%</span>
                <span className="text-xs text-[#4A5568] uppercase tracking-widest">{isFr ? 'Engagés' : 'Committed'}</span>
              </div>
            </motion.div>
          </div>

          {/* Colonne Droite: Services (5/12) */}
          <div className="lg:col-span-5">
            <motion.h4 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white font-bold mb-6 uppercase tracking-widest text-sm"
            >
              {isFr ? 'Nos Services' : 'Our Services'}
            </motion.h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <motion.div 
                  key={service}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-[#141430] border border-[#1A1A2E] rounded-xl hover:border-[#00BFFF] transition-colors duration-300 group"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00BFFF] group-hover:scale-150 transition-transform duration-300" />
                  <span className="text-[#A8B4C8] font-medium">{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Équipe */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm text-center">
            {isFr ? 'L\'Équipe' : 'The Team'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.map((member, index) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#141430] border border-[#1A1A2E] flex items-center justify-center text-2xl font-heading text-[#A8B4C8] group-hover:border-[#00BFFF] group-hover:text-[#00BFFF] group-hover:scale-110 transition-all duration-300">
                  {member.initial}
                </div>
                <h5 className="text-white font-semibold text-sm mb-1 truncate">{member.name}</h5>
                <p className="text-[#4A5568] text-xs">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <a 
            href="https://growtech.bj" // Remplace par la vraie URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#00BFFF] text-black font-bold text-lg rounded-full hover:bg-opacity-90 transition-all duration-300 hover:scale-105"
          >
            {isFr ? 'Visiter le site de GROW TECH' : 'Visit GROW TECH Website'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GrowTech;