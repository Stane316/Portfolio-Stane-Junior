import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import SectionNumber from '../../components/ui/SectionNumber';

const About: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  // Photo spécifique pour About (différente de Hero)
  const aboutImageUrl = siteConfig['about_image_url']?.value_generic || '';
  const heroImageUrl = siteConfig['hero_image_url']?.value_generic || '';
  const displayImage = aboutImageUrl || heroImageUrl;

  // EVOLUTION 2026: 4 paragraphs with AI as natural prolongement
  const paragraphs = isFr
    ? [
        "J'ai 18 ans, étudiant en Licence 1 Développement Logiciel à l'IFRI-UAC. Je code depuis que j'ai compris qu'on pouvait transformer une idée en quelque chose de réel avec juste un clavier.",
        "Ce qui me motive n'est pas l'outil. C'est le problème à résoudre. J'ai travaillé dans une agence Mobile Money, j'ai vu comment les petits commerçants béninois gèrent — ou plutôt ne gèrent pas — leurs factures. C'est de là qu'est né FacturaPro.",
        "Aujourd'hui, j'ai co-fondé GROW TECH. Six personnes. Une vraie agence. On développe des solutions digitales pour les entreprises du Bénin et de la sous-région OHADA.",
        "Récemment, mon parcours a pris une nouvelle direction. L'intelligence artificielle n'est pas pour moi une mode — c'est le prolongement naturel de ma façon de penser. Observer un système, comprendre sa logique, puis concevoir des solutions qui apprennent et s'adaptent. C'est la suite logique de tout ce que j'ai construit jusqu'ici. Mon objectif : devenir un AI Systems Engineer capable de combiner génie logiciel et intelligence artificielle pour l'Afrique.",
      ]
    : [
        "I'm 18, studying Software Development at IFRI-UAC. I've been coding since I realized you can turn an idea into something real with just a keyboard.",
        "What drives me isn't the tool. It's the problem to solve. I worked at a Mobile Money agency and saw how small Beninese merchants struggle with invoicing. That's where FacturaPro was born.",
        "Today, I co-founded GROW TECH. Six people. A real agency. We build digital solutions for businesses in Benin and the OHADA sub-region.",
        "Recently, my journey has taken a new direction. Artificial intelligence isn't a trend for me — it's the natural extension of how I think. Observe a system, understand its logic, then design solutions that learn and adapt. That's the logical next step from everything I've built so far. My goal: become an AI Systems Engineer capable of combining software engineering and artificial intelligence for Africa.",
      ];

  // EVOLUTION 2026: Stats updated — Projects, Agency, Age
  const stats = [
    { number: '5+', label: isFr ? 'Projets construits' : 'Projects Built' },
    { number: '1', label: isFr ? 'Agence fondée' : 'Agency Founded' },
    { number: '18', label: isFr ? 'Ans' : 'Years Old' },
  ];

  // EVOLUTION 2026: Info badges with AI specialization
  const infoBadges = [
    { icon: '📍', text: isFr ? 'Abomey-Calavi, Bénin' : 'Abomey-Calavi, Benin' },
    { icon: '🎓', text: isFr ? 'IFRI-UAC — Licence 1 Dev Logiciel' : 'IFRI-UAC — Software Development Licence 1' },
    { icon: '🏢', text: isFr ? 'Fondateur & Tech Lead — GROW TECH' : 'Founder & Tech Lead — GROW TECH' },
    { icon: '🌍', text: isFr ? 'Zone OHADA — 17 pays cibles' : 'OHADA Zone — 17 target countries' },
    { icon: '🤖', text: isFr ? 'Spécialisation IA & Systèmes Agents' : 'AI & Agent Systems Specialization' },
  ];

  // EVOLUTION 2026: Updated conclusion — from "développeur" to "ingénieur logiciel en devenir"
  const conclusion = isFr
    ? "Je suis un ingénieur logiciel en devenir. J'observe, je comprends, je construis. Et aujourd'hui, je construis des systèmes intelligents."
    : "I'm a software engineer in the making. I observe, I understand, I build. And today, I build intelligent systems.";

  return (
    <section id="about" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header avec SectionNumber */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="01" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {isFr ? 'À PROPOS' : 'ABOUT'}
            </h2>
            {/* EVOLUTION 2026: Subtitle updated */}
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? "Plus qu'un développeur. Un ingénieur en devenir." : 'More than a developer. An engineer in the making.'}
            </p>
          </div>
        </div>

        {/* Layout Asymétrique */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Colonne Gauche: Texte (7/12) */}
          <div className="lg:col-span-7 space-y-8">
            {paragraphs.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`text-[#A8B4C8] text-lg lg:text-xl leading-relaxed font-light ${index === 3 ? 'border-l-2 border-[#00BFFF] pl-4 sm:pl-6' : ''}`}
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

            {/* EVOLUTION 2026: Info badges including AI + MEXT */}
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
            {/* Photo - Utilise about_image_url si disponible, sinon hero_image_url */}
            {/* Photo About Adaptée */}
<motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="relative flex justify-center"
>
    <div className="w-auto h-auto max-w-[350px] lg:max-w-[400px]">
        {/* Cadre principal */}
        <div className="aspect-auto rounded-2xl overflow-hidden bg-[#141430] border border-[#1A1A2E]">
            {displayImage ? (
                // object-contain garantit que la photo entière est visible
                <img 
                    src={displayImage} 
                    alt="Stane-Junior" 
                    className="w-full h-auto object-contain" 
                />
            ) : (
                // Fallback
                <div className="w-[350px] h-[450px] flex items-center justify-center">
                    <span className="text-8xl font-heading text-white opacity-50">SJ</span>
                </div>
            )}
        </div>
        {/* Élément décoratif */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#00BFFF] rounded-2xl -z-10" />
    </div>
</motion.div>

            {/* EVOLUTION 2026: Citation mise à jour */}
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
