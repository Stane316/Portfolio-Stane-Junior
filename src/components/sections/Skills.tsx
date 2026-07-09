import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

/**
 * Skills Section — PORTFOLIO 2026
 * 
 * Restructured per brief: 4 categories
 * 1. Software Engineering (Python, Java, JavaScript, Software design, Problem solving)
 * 2. Web Development (Frontend, Backend, APIs, Databases)
 * 3. Artificial Intelligence (Prompt engineering, LLM systems, AI agents, RAG)
 * 4. Tools (Git, GitHub, Figma, VS Code, Claude, ChatGPT)
 * 
 * Section number: 05 (after WhatIBuild)
 */

interface SkillItem {
  name: string;
  level: 'mastered' | 'learning' | 'basics';
  context: string;
}

interface SkillCategory {
  titleKey: string;
  accent: string;
  icon: React.ReactNode;
  iconColor: string;
  skills: SkillItem[];
}

const Skills: React.FC = () => {
  const { lang, t } = useLanguage();
  const isFr = lang === 'fr';

  const levelConfig = {
    mastered: {
      label: t('skills.mastered'),
      color: 'text-[#00BFFF]',
      dot: 'bg-[#00BFFF]',
    },
    learning: {
      label: t('skills.learning'),
      color: 'text-yellow-400',
      dot: 'bg-yellow-400',
    },
    basics: {
      label: t('skills.basics'),
      color: 'text-[#4A5568]',
      dot: 'bg-[#4A5568]',
    },
  };

  const categories: SkillCategory[] = [
    {
      titleKey: isFr ? 'Ingénierie Logicielle' : 'Software Engineering',
      accent: 'bg-[#00BFFF]',
      iconColor: 'text-[#00BFFF]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      skills: [
        { name: 'Python', level: 'learning' as const, context: isFr ? 'Scripts, automatisation, data' : 'Scripts, automation, data' },
        { name: 'Java', level: 'learning' as const, context: isFr ? 'Programmation orientée objet, algorithmique' : 'Object-oriented programming, algorithms' },
        { name: 'JavaScript / TypeScript', level: 'mastered' as const, context: isFr ? 'Portfolio, CRM, projets clients' : 'Portfolio, CRM, client projects' },
        { name: isFr ? 'Software Design' : 'Software Design', level: 'learning' as const, context: isFr ? 'Patterns, architecture modulaire, scalable' : 'Patterns, modular architecture, scalable' },
        { name: isFr ? 'Problem Solving' : 'Problem Solving', level: 'mastered' as const, context: isFr ? "De l'observation au produit" : 'From observation to product' },
      ],
    },
    {
      titleKey: isFr ? 'Développement Web' : 'Web Development',
      accent: 'bg-purple-400',
      iconColor: 'text-purple-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      skills: [
        { name: 'React / Next.js / TailwindCSS', level: 'mastered' as const, context: isFr ? 'Portfolio, CRM, design systems' : 'Portfolio, CRM, design systems' },
        { name: isFr ? 'Backend & APIs REST' : 'Backend & REST APIs', level: 'learning' as const, context: isFr ? 'Node.js, Express, APIs en cours' : 'Node.js, Express, APIs in progress' },
        { name: isFr ? 'Bases de données' : 'Databases', level: 'learning' as const, context: isFr ? 'Supabase / PostgreSQL, Auth, Storage' : 'Supabase / PostgreSQL, Auth, Storage' },
        { name: 'Framer Motion / Animations', level: 'mastered' as const, context: isFr ? 'Animations fluides et interactives' : 'Smooth and interactive animations' },
      ],
    },
    {
      titleKey: isFr ? 'Intelligence Artificielle' : 'Artificial Intelligence',
      accent: 'bg-cyan-400',
      iconColor: 'text-cyan-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      skills: [
        { name: 'Prompt Engineering', level: 'mastered' as const, context: isFr ? 'Conception de prompts complexes, chaînes de raisonnement' : 'Complex prompt design, chain-of-thought' },
        { name: 'LLM Systems & Orchestration', level: 'learning' as const, context: isFr ? 'Chaînes, pipelines, intégration multi-modèles' : 'Chains, pipelines, multi-model integration' },
        { name: 'AI Agents & Multi-Agent Systems', level: 'basics' as const, context: isFr ? 'Agents autonomes, orchestration, tool use' : 'Autonomous agents, orchestration, tool use' },
        { name: 'RAG Systems', level: 'learning' as const, context: isFr ? 'Retrieval-Augmented Generation, embeddings, vector DB' : 'Retrieval-Augmented Generation, embeddings, vector DB' },
      ],
    },
    {
      titleKey: isFr ? 'Outils' : 'Tools',
      accent: 'bg-emerald-400',
      iconColor: 'text-emerald-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      skills: [
        { name: 'Git / GitHub', level: 'mastered' as const, context: isFr ? 'Versionning & collaboration' : 'Versioning & collaboration' },
        { name: 'Figma / UI Design', level: 'learning' as const, context: isFr ? 'Maquettes & prototypes' : 'Mockups & prototypes' },
        { name: 'VS Code', level: 'mastered' as const, context: isFr ? 'Environnement de développement principal' : 'Primary development environment' },
        { name: 'Claude / ChatGPT', level: 'mastered' as const, context: isFr ? 'Collaboration IA, ingénierie de prompts, productivité' : 'AI collaboration, prompt engineering, productivity' },
        { name: 'Vercel / Netlify / CI/CD', level: 'mastered' as const, context: isFr ? 'Déploiement continu' : 'Continuous deployment' },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="05" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {t('skills.title')}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {t('skills.subtitle')}
            </p>
          </div>
        </div>

        {/* Category Grid — 2x2 on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.12, duration: 0.6 }}
              className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 hover:border-[#00BFFF]/40 transition-colors duration-300"
            >
              <h3 className="text-xl text-white font-bold mb-8 flex items-center gap-3">
                <span className={`w-2 h-8 ${category.accent} rounded-full`} />
                <span className={category.iconColor}>{category.icon}</span>
                {category.titleKey}
              </h3>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => {
                  const level = levelConfig[skill.level];
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (catIndex * 0.12) + (skillIndex * 0.08), duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#A8B4C8] font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${level.dot}`} />
                          <span className={`text-xs ${level.color} uppercase tracking-wider`}>
                            {level.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#4A5568] text-xs">{skill.context}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Honesty note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#4A5568] text-sm italic max-w-2xl mx-auto">
            {t('skills.honesty')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
