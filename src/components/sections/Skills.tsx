/**
 * Skills Section Component
 * 
 * Displays technical skills with 3 levels:
 * - Mastered (blue) - Production ready
 * - Learning (yellow) - Actively using
 * - Basics (white) - Understanding only
 * 
 * @see /src/contexts/LanguageContext.tsx
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

interface Skill {
  name: string;
  level: 'mastered' | 'learning' | 'basics';
  context: string;
}

const Skills: React.FC = memo(() => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const skills: Skill[] = [
    { name: 'HTML5', level: 'mastered', context: isFr ? 'Tous les projets livrés' : 'All delivered projects' },
    { name: 'CSS3 / TailwindCSS', level: 'mastered', context: isFr ? 'Maquis Digital, CRM, Portfolio' : 'Maquis Digital, CRM, Portfolio' },
    { name: 'JavaScript (vanilla)', level: 'mastered', context: isFr ? 'Capsule, Portfolio ancien' : 'Capsule, Old Portfolio' },
    { name: 'React 18 + Vite', level: 'learning', context: isFr ? 'CRM Léger, Portfolio actuel' : 'CRM Léger, Current Portfolio' },
    { name: 'Supabase', level: 'mastered', context: isFr ? 'Auth, DB, Storage, Realtime' : 'Auth, DB, Storage, Realtime' },
    { name: 'Git / GitHub', level: 'mastered', context: isFr ? 'Tous les projets versionnés' : 'All versioned projects' },
    { name: 'Figma', level: 'learning', context: isFr ? 'Maquettes projets clients GROW TECH' : 'GROW TECH client mockups' },
    { name: 'Node.js', level: 'learning', context: isFr ? 'Backend API projets en cours' : 'Backend API projects in progress' },
    { name: 'Netlify', level: 'mastered', context: isFr ? 'Déploiement de tous les projets' : 'All projects deployment' },
    { name: 'Prompt Engineering / IA', level: 'mastered', context: isFr ? 'Méthode de travail assistée IA' : 'AI-assisted workflow' },
    { name: 'C (langage)', level: 'mastered', context: isFr ? '31 projets pédagogiques — IFRI-UAC' : '31 educational projects — IFRI-UAC' },
    { name: 'Algorithmique', level: 'mastered', context: isFr ? 'Cours IFRI-UAC, pseudocode FR' : 'IFRI-UAC courses, FR pseudocode' },
  ];

  const levelConfig = {
    mastered: { icon: '🔵', label: isFr ? 'Maîtrisé' : 'Mastered', color: 'text-blue-400' },
    learning: { icon: '🟡', label: isFr ? 'En apprentissage actif' : 'Actively learning', color: 'text-yellow-400' },
    basics: { icon: '⚪', label: isFr ? 'Notions' : 'Basic knowledge', color: 'text-gray-400' },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24 lg:py-32 relative" aria-labelledby="skills-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="skills-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              <span className="text-gradient">{isFr ? 'Ce que je maîtrise' : 'What I master'}</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[#00BFFF] mx-auto rounded-full" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
          >
            {skills.map((skill, index) => (
              <motion.div key={index} variants={itemVariants} className="project-card group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-[#00BFFF] transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-2xl">{levelConfig[skill.level].icon}</span>
                </div>
                <div className={`text-sm ${levelConfig[skill.level].color} font-semibold mb-2`}>
                  {levelConfig[skill.level].label}
                </div>
                <p className="text-[#A8B4C8] text-sm">{skill.context}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-card max-w-2xl mx-auto text-center"
          >
            <p className="text-[#A8B4C8] italic text-sm">
              {isFr
                ? "Je travaille avec une approche honnête : je ne liste que ce que je peux défendre et expliquer. Ma capacité à utiliser intelligemment les outils IA pour mener des projets à terme est une compétence à part entière — pas un aveu de faiblesse."
                : "I work with an honest approach: I only list what I can defend and explain. My ability to intelligently use AI tools to complete projects is a skill in its own right — not an admission of weakness."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {Object.entries(levelConfig).map(([level, config]) => (
              <div key={level} className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <span className="text-[#A8B4C8] text-sm">{config.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';

export default Skills;