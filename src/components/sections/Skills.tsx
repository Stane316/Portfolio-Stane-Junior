import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

interface SkillItem {
  name: string;
  level: 'mastered' | 'learning' | 'basics';
  context: string;
}

const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const levelConfig = {
    mastered: { 
      label: isFr ? 'Maîtrisé' : 'Mastered', 
      color: 'text-[#00BFFF]', 
      dot: 'bg-[#00BFFF]' 
    },
    learning: { 
      label: isFr ? 'En apprentissage actif' : 'Actively Learning', 
      color: 'text-yellow-400', 
      dot: 'bg-yellow-400' 
    },
    basics: { 
      label: isFr ? 'Notion' : 'Basics', 
      color: 'text-[#4A5568]', 
      dot: 'bg-[#4A5568]' 
    },
  };

  const categories = [
    {
      title: isFr ? 'Frontend' : 'Frontend',
      skills: [
        { name: 'HTML5 / CSS3', level: 'mastered' as const, context: isFr ? 'Tous les projets' : 'All projects' },
        { name: 'React / Next.js', level: 'mastered' as const, context: isFr ? 'Portfolio, CRM, Projets clients' : 'Portfolio, CRM, Client projects' },
        { name: 'TypeScript', level: 'mastered' as const, context: isFr ? 'Architecture type-safe' : 'Type-safe architecture' },
        { name: 'TailwindCSS', level: 'mastered' as const, context: isFr ? 'Design system complet' : 'Complete design system' },
        { name: 'Three.js', level: 'learning' as const, context: isFr ? 'Scènes 3D basiques' : 'Basic 3D scenes' },
        { name: 'Framer Motion', level: 'mastered' as const, context: isFr ? 'Animations fluides' : 'Smooth animations' },
      ],
    },
    {
      title: isFr ? 'Backend & Data' : 'Backend & Data',
      skills: [
        { name: 'Node.js', level: 'learning' as const, context: isFr ? 'APIs REST en cours' : 'REST APIs in progress' },
        { name: 'Supabase', level: 'mastered' as const, context: isFr ? 'Auth, DB, Storage, Realtime' : 'Auth, DB, Storage, Realtime' },
        { name: 'PostgreSQL', level: 'learning' as const, context: isFr ? 'Requêtes avancées' : 'Advanced queries' },
        { name: 'API REST', level: 'mastered' as const, context: isFr ? 'Intégration complète' : 'Full integration' },
      ],
    },
    {
      title: isFr ? 'Outils & Workflow' : 'Tools & Workflow',
      skills: [
        { name: 'Git / GitHub', level: 'mastered' as const, context: isFr ? 'Versionning & collaboration' : 'Versioning & collaboration' },
        { name: 'Figma', level: 'learning' as const, context: isFr ? 'Maquettes & prototypes' : 'Mockups & prototypes' },
        { name: 'Vercel / Netlify', level: 'mastered' as const, context: isFr ? 'Déploiement continu' : 'Continuous deployment' },
        { name: 'IA / Prompting', level: 'mastered' as const, context: isFr ? 'Accélération dev' : 'Dev acceleration' },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="02" />
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
              className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 hover:border-[#00BFFF] transition-colors duration-300"
            >
              <h3 className="text-xl text-white font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#00BFFF] rounded-full" />
                {category.title}
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
                      transition={{ delay: (catIndex * 0.15) + (skillIndex * 0.1), duration: 0.4 }}
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

        {/* Note honnêteté */}
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