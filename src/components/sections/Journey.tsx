import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * Journey Section — Timeline of Stane's evolution
 * 
 * EVOLUTION 2026: New section showing the natural progression
 * from math olympiad → software engineering → AI systems
 * 
 * Position: Between About and Skills (after the story, before the skills)
 */

interface JourneyStep {
  year: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  icon: 'math' | 'graduation' | 'agency' | 'ai' | 'rocket' | 'flag';
  highlight?: boolean;
}

const Journey: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const steps: JourneyStep[] = [
    {
      year: '2023',
      title_fr: 'Olympiades de Mathématiques',
      title_en: 'Mathematics Olympiad',
      description_fr: "Première reconnaissance académique. Les mathématiques m'ont appris la rigueur, la logique et la persévérance — des fondations qui servent encore aujourd'hui dans la conception de systèmes.",
      description_en: "First academic recognition. Mathematics taught me rigor, logic and perseverance — foundations that still serve me today in system design.",
      icon: 'math',
    },
    {
      year: '2024',
      title_fr: 'Bac Série C — Mention Très Bien',
      title_en: 'Bac Série C — Highest Honors',
      description_fr: '17.72/20. Le baccalauréat scientifique le plus exigeant du système francophone. Une confirmation que la résolution de problèmes est mon langage naturel.',
      description_en: '17.72/20. The most demanding scientific baccalaureate in the French-speaking system. A confirmation that problem-solving is my natural language.',
      icon: 'graduation',
    },
    {
      year: '2025',
      title_fr: 'IFRI-UAC + GROW TECH + Découverte de l\'IA',
      title_en: 'IFRI-UAC + GROW TECH + AI Discovery',
      description_fr: "Entrée en Licence 1 Développement Logiciel. Fondation de GROW TECH. Et surtout : la découverte de l'intelligence artificielle comme prolongement naturel de ma façon de penser. Pas une mode — une évidence.",
      description_en: "Started Software Development at IFRI-UAC. Founded GROW TECH. And most importantly: the discovery of artificial intelligence as the natural extension of how I think. Not a trend — an evidence.",
      icon: 'agency',
      highlight: true,
    },
    {
      year: '2026',
      title_fr: 'Spécialisation IA & Systèmes Agents',
      title_en: 'AI & Agent Systems Specialization',
      description_fr: "Apprentissage actif : Prompt Engineering, LLM Orchestration, RAG, AI Agents. Conception de concepts comme AgentFactura et l'Assistant Juridique OHADA. L'ingénierie logicielle rencontre l'intelligence.",
      description_en: "Active learning: Prompt Engineering, LLM Orchestration, RAG, AI Agents. Designing concepts like AgentFactura and OHADA Legal Assistant. Software engineering meets intelligence.",
      icon: 'ai',
      highlight: true,
    },
    {
      year: 'Future',
      title_fr: 'Ingénieur Systèmes Intelligents',
      title_en: 'AI Systems Engineer',
      description_fr: "Mon ambition : devenir un ingénieur capable de combiner génie logiciel et intelligence artificielle pour construire des systèmes intelligents utiles pour l'Afrique. Le chemin continue.",
      description_en: "My ambition: become an engineer capable of combining software engineering and AI to build useful intelligent systems for Africa. The journey continues.",
      icon: 'flag',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'math':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'graduation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        );
      case 'agency':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'ai':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'flag':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  return (
    <section id="journey" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="01.5" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {isFr ? 'PARCOURS' : 'JOURNEY'}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr 
                ? "De la rigueur mathématique à l'ingénierie des systèmes intelligents. Une progression naturelle."
                : "From mathematical rigor to intelligent systems engineering. A natural progression."}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00BFFF]/50 via-[#00BFFF]/20 to-transparent" />

          {steps.map((step, index) => {
            const isHighlight = step.highlight;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`relative pl-14 sm:pl-20 pb-12 ${isLast ? 'pb-0' : ''}`}
              >
                {/* Dot on timeline */}
                <div className={`absolute left-2 sm:left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isHighlight
                    ? 'bg-[#00BFFF] border-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.5)]'
                    : 'bg-[#0A0A1E] border-[#1A1A2E]'
                }`}>
                  {isHighlight && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                {/* Year Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-mono font-bold tracking-wider ${
                    isHighlight ? 'text-[#00BFFF]' : 'text-[#4A5568]'
                  }`}>
                    {step.year}
                  </span>
                  {isHighlight && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00BFFF]/10 text-[#00BFFF] border border-[#00BFFF]/30">
                      {isFr ? 'Maintenant' : 'Now'}
                    </span>
                  )}
                </div>

                {/* Content Card */}
                <div className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 ${
                  isHighlight
                    ? 'bg-[#00BFFF]/5 border-[#00BFFF]/30 hover:border-[#00BFFF]/60'
                    : 'bg-[#141430]/50 border-[#1A1A2E] hover:border-[#00BFFF]/30'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 mt-0.5 ${
                      isHighlight ? 'text-[#00BFFF]' : 'text-[#4A5568]'
                    }`}>
                      {getIcon(step.icon)}
                    </div>
                    <h3 className={`text-lg font-bold ${
                      isHighlight ? 'text-white' : 'text-[#A8B4C8]'
                    }`}>
                      {isFr ? step.title_fr : step.title_en}
                    </h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isHighlight ? 'text-[#A8B4C8]' : 'text-[#4A5568]'
                  }`}>
                    {isFr ? step.description_fr : step.description_en}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#A8B4C8] text-sm italic max-w-xl mx-auto">
            {isFr
              ? "Je ne veux pas devenir juste un autre développeur full-stack. Mon ambition est de devenir un ingénieur capable de construire des systèmes intelligents."
              : "I do not want to become just another full-stack developer. My ambition is to become an engineer capable of building intelligent systems."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
