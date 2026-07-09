import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * About Section — PORTFOLIO 2026
 * 
 * Title: "More than a developer."
 * 5 short paragraphs per brief, building the narrative:
 * Name → Identity → Journey → Philosophy → Ambition
 * + Info badges + Photo + Quote
 */
const About: React.FC = () => {
  const { lang, t } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  const aboutImageUrl = siteConfig['about_image_url']?.value_generic || '';
  const heroImageUrl = siteConfig['hero_image_url']?.value_generic || '';
  const displayImage = aboutImageUrl || heroImageUrl;

  const paragraphs = [
    t('about.text.p1'),
    t('about.text.p2'),
    t('about.text.p3'),
    t('about.text.p4'),
    t('about.text.p5'),
  ];

  const stats = [
    { number: '5+', label: isFr ? 'Projets construits' : 'Projects Built' },
    { number: '1', label: isFr ? 'Agence fondée' : 'Agency Founded' },
    { number: '18', label: isFr ? 'Ans' : 'Years Old' },
  ];

  const infoBadges = [
    { icon: '📍', text: isFr ? 'Abomey-Calavi, Bénin' : 'Abomey-Calavi, Benin' },
    { icon: '🎓', text: isFr ? 'IFRI-UAC — Licence 1 Dev Logiciel' : 'IFRI-UAC — Software Engineering' },
    { icon: '🏢', text: isFr ? 'Fondateur & Tech Lead — GROW TECH' : 'Founder & Tech Lead — GROW TECH' },
    { icon: '🌍', text: isFr ? 'Zone OHADA — 17 pays cibles' : 'OHADA Zone — 17 target countries' },
    { icon: '🤖', text: isFr ? 'Spécialisation IA & Systèmes Agents' : 'AI & Agent Systems Specialization' },
  ];

  const conclusion = isFr
    ? "Je suis un ingénieur logiciel en devenir. J'observe, je comprends, je construis. Et aujourd'hui, je construis des systèmes intelligents."
    : "I'm a software engineer in the making. I observe, I understand, I build. And today, I build intelligent systems.";

  return (
    <section id="about" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="01" />
            <h2 className="text-5xl sm:text-7xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {t('about.title')}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Qui je suis. Ce qui me définit.' : 'Who I am. What defines me.'}
            </p>
          </div>
        </div>

        {/* Layout Asymétrique */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Colonne Gauche: Texte (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            {paragraphs.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                className={`leading-relaxed font-light ${
                  index === 0 ? 'text-white text-2xl lg:text-3xl font-medium' 
                  : index === 4 ? 'text-[#A8B4C8] text-lg lg:text-xl border-l-2 border-[#00BFFF] pl-4 sm:pl-6' 
                  : 'text-[#A8B4C8] text-lg lg:text-xl'
                }`}
              >
                {text}
              </motion.p>
            ))}

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex gap-12 pt-8 border-t border-[#141430]"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <span className="block text-4xl lg:text-5xl font-heading text-[#00BFFF]">{stat.number}</span>
                  <span className="text-[#4A5568] text-sm uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Info badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {infoBadges.map((badge, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-colors duration-200 ${
                    i >= 4
                      ? 'bg-[#00BFFF]/10 border-[#00BFFF]/30 text-[#00BFFF]'
                      : 'bg-[#141430] border-[#1A1A2E] text-[#A8B4C8]'
                  }`}
                >
                  {badge.icon} {badge.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Colonne Droite: Photo & Citation (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center"
            >
              <div className="w-auto h-auto max-w-[350px] lg:max-w-[400px]">
                <div className="aspect-auto rounded-2xl overflow-hidden bg-[#141430] border border-[#1A1A2E]">
                  {displayImage ? (
                    <img src={displayImage} alt="Stane-Junior" className="w-full h-auto object-contain" />
                  ) : (
                    <div className="w-[350px] h-[450px] flex items-center justify-center">
                      <span className="text-8xl font-heading text-white opacity-50">SJ</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#00BFFF] rounded-2xl -z-10" />
              </div>
            </motion.div>

            {/* Citation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-[#141430] p-6 rounded-xl border-l-4 border-[#00BFFF]"
            >
              <p className="text-white text-lg italic font-light leading-relaxed">
                "{conclusion}"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-px bg-[#00BFFF]" />
                <span className="text-[#00BFFF] text-sm uppercase tracking-widest">Stane-Junior</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
