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

  const paragraphs = isFr
    ? [
        "J'ai 18 ans, étudiant en Licence 1 Développement Logiciel à l'IFRI-UAC. Je code depuis que j'ai compris qu'on pouvait transformer une idée en quelque chose de réel avec juste un clavier.",
        "Ce qui me motive n'est pas l'outil. C'est le problème à résoudre. J'ai travaillé dans une agence Mobile Money, j'ai vu comment les petits commerçants béninois gèrent — ou plutôt ne gèrent pas — leurs factures. C'est de là qu'est né FacturaPro.",
        "Aujourd'hui, j'ai co-fondé GROW TECH. Six personnes. Une vraie agence. On développe des solutions digitales pour les entreprises du Bénin et de la sous-région OHADA.",
      ]
    : [
        "I'm 18, studying Software Development at IFRI-UAC. I've been coding since I realized you can turn an idea into something real with just a keyboard.",
        "What drives me isn't the tool. It's the problem to solve. I worked at a Mobile Money agency and saw how small Beninese merchants struggle with invoicing. That's where FacturaPro was born.",
        "Today, I co-founded GROW TECH. Six people. A real agency. We build digital solutions for businesses in Benin and the OHADA sub-region.",
      ];

  const stats = [
    { number: '3+', label: isFr ? 'Projets livrés' : 'Projects Delivered' },
    { number: '6', label: isFr ? 'Membres GROW TECH' : 'GROW TECH Members' },
    { number: '18', label: isFr ? 'Ans' : 'Years Old' },
  ];

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
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Développeur passionné & Fondateur d\'agence.' : 'Passionate developer & Agency founder.'}
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
                className="text-[#A8B4C8] text-lg lg:text-xl leading-relaxed font-light"
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
          </div>

          {/* Colonne Droite: Photo & Citation (5/12) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Photo - Utilise about_image_url si disponible, sinon hero_image_url */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#141430] border border-[#1A1A2E]">
                {displayImage ? (
                  <img src={displayImage} alt="Stane-Junior" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1A6FC4] to-[#00BFFF] flex items-center justify-center">
                    <span className="text-8xl font-heading text-white opacity-50">SJ</span>
                  </div>
                )}
              </div>
              {/* Élément décoratif */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-[#00BFFF] rounded-2xl -z-10" />
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
                "{isFr 
                  ? 'Je suis développeur. Mais surtout, je suis quelqu\'un qui observe, qui comprend, et qui code pour résoudre.' 
                  : 'I\'m a developer. But above all, I\'m someone who observes, understands, and codes to solve.'}"
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