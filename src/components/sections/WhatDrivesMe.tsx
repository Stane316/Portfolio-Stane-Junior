import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * What Drives Me Section — PORTFOLIO 2026
 * 
 * Title: "Why I build."
 * 3 cards: Solving Real Problems / Building Useful Products / Learning Through Creation
 */

interface DriveCard {
  titleKey: string;
  textKey: string;
  icon: React.ReactNode;
  accent: string;
}

const WhatDrivesMe: React.FC = () => {
  const { lang, t } = useLanguage();
  const isFr = lang === 'fr';

  const cards: DriveCard[] = [
    {
      titleKey: 'drives.problems.title',
      textKey: 'drives.problems.text',
      accent: 'border-[#00BFFF] hover:border-[#00BFFF]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-2.332 9-7.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      titleKey: 'drives.products.title',
      textKey: 'drives.products.text',
      accent: 'border-purple-500/40 hover:border-purple-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      titleKey: 'drives.learning.title',
      textKey: 'drives.learning.text',
      accent: 'border-emerald-500/40 hover:border-emerald-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const iconColors = ['text-[#00BFFF]', 'text-purple-400', 'text-emerald-400'];
  const bgColors = ['bg-[#00BFFF]/10', 'bg-purple-500/10', 'bg-emerald-500/10'];

  return (
    <section id="drives" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="03" />
            <h2 className="text-5xl sm:text-7xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {t('drives.title')}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {t('drives.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className={`bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 lg:p-10 ${card.accent} transition-colors duration-300 group relative overflow-hidden`}
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[#00BFFF]" />
              
              <div className={`w-14 h-14 rounded-xl ${bgColors[index]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${iconColors[index]}`}>
                {card.icon}
              </div>
              <h3 className="text-xl text-white font-bold mb-3">{t(card.titleKey)}</h3>
              <p className="text-[#A8B4C8] leading-relaxed">{t(card.textKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatDrivesMe;
