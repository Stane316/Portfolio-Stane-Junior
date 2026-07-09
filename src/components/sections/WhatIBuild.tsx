import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * What I Build Section — PORTFOLIO 2026
 * 
 * Title: "What I build today."
 * 3 cards: Digital Products / Intelligent Systems / African Solutions
 */

const WhatIBuild: React.FC = () => {
  const { lang, t } = useLanguage();
  const isFr = lang === 'fr';

  const cards = [
    {
      titleKey: 'build.digital.title',
      itemsKey: 'build.digital.items',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      accent: 'border-[#00BFFF]/40 hover:border-[#00BFFF]',
      iconBg: 'bg-[#00BFFF]/10',
      iconColor: 'text-[#00BFFF]',
      glowColor: 'bg-[#00BFFF]',
    },
    {
      titleKey: 'build.intelligent.title',
      itemsKey: 'build.intelligent.items',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      accent: 'border-purple-500/40 hover:border-purple-400',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      glowColor: 'bg-purple-400',
    },
    {
      titleKey: 'build.african.title',
      itemsKey: 'build.african.items',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'border-emerald-500/40 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      glowColor: 'bg-emerald-400',
    },
  ];

  return (
    <section id="build" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="04" />
            <h2 className="text-5xl sm:text-7xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {t('build.title')}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {t('build.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 lg:p-10 ${card.accent} transition-all duration-300 group relative overflow-hidden hover:shadow-[0_0_40px_rgba(0,191,255,0.1)]`}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${card.glowColor}`} />
              
              <div className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl text-white font-bold mb-4">{t(card.titleKey)}</h3>
              
              <div className="space-y-2">
                {t(card.itemsKey).split(' · ').map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${card.iconColor}`} />
                    <span className="text-[#A8B4C8] text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIBuild;
