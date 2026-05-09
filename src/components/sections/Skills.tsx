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

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

interface SkillCategory {
  title: string;
  skills: { name: string; level: number; icon: string }[];
}

const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const categories: SkillCategory[] = [
    {
      title: isFr ? 'Frontend' : 'Frontend',
      skills: [
        { name: 'React / Next.js', level: 90, icon: '⚛️' },
        { name: 'TypeScript', level: 85, icon: '🔷' },
        { name: 'TailwindCSS', level: 95, icon: '🎨' },
        { name: 'Framer Motion', level: 80, icon: '✨' },
      ],
    },
    {
      title: isFr ? 'Backend & DB' : 'Backend & DB',
      skills: [
        { name: 'Node.js', level: 75, icon: '🟢' },
        { name: 'Supabase', level: 85, icon: '🟣' },
        { name: 'PostgreSQL', level: 70, icon: '🐘' },
        { name: 'API REST', level: 80, icon: '🔗' },
      ],
    },
    {
      title: isFr ? 'Outils & Design' : 'Tools & Design',
      skills: [
        { name: 'Git / GitHub', level: 90, icon: '🐙' },
        { name: 'Figma', level: 75, icon: '🎯' },
        { name: 'Vercel / Netlify', level: 85, icon: '▲' },
        { name: 'Three.js', level: 60, icon: '' },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="03" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {isFr ? 'COMPÉTENCES' : 'SKILLS'}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Technologies que je maîtrise au quotidien.' : 'Technologies I master daily.'}
            </p>
          </div>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.15, duration: 0.6 }}
              className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 hover:border-[#00BFFF] transition-colors duration-300 group"
            >
              <h3 className="text-xl text-white font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#00BFFF] rounded-full" />
                {category.title}
              </h3>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (catIndex * 0.15) + (skillIndex * 0.1), duration: 0.4 }}
                    className="group/skill"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="text-[#A8B4C8] font-medium group-hover/skill:text-white transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[#00BFFF] font-mono text-sm">{skill.level}%</span>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="h-2 bg-[#0A0A1E] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: (catIndex * 0.15) + (skillIndex * 0.1) + 0.3, duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#1A6FC4] to-[#00BFFF] rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note en bas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#4A5568] text-sm italic max-w-2xl mx-auto">
            {isFr 
              ? 'Je travaille avec une approche honnête : je ne liste que ce que je peux défendre et expliquer. Ma capacité à utiliser intelligemment les outils IA pour mener des projets à terme est une compétence à part entière.' 
              : 'I work with an honest approach: I only list what I can defend and explain. My ability to intelligently use AI tools to complete projects is a skill in its own right.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;