// === FICHIER COMPLET : src/components/sections/Skills.tsx ===
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

  // EVOLUTION 2026: Positionnement technique clair
  // De la rigueur mathématique (2023-2024) → génie logiciel (2025) → systèmes intelligents (2026+)
  // IA & Systèmes Intelligents = prolongement naturel, pas un pivot
  const categories = [
    {
      title: isFr ? 'Ingénierie Logicielle' : 'Software Engineering',
      accent: 'bg-[#00BFFF]',
      skills: [
        { name: 'React / TypeScript / Next.js', level: 'mastered' as const, context: isFr ? 'Portfolio, CRM, Projets clients réels (GROW TECH)' : 'Portfolio, CRM, Real client projects (GROW TECH)' },
        { name: 'TailwindCSS / Design Systems', level: 'mastered' as const, context: isFr ? 'Système de design complet et maintenable' : 'Complete and maintainable design systems' },
        { name: 'Supabase / PostgreSQL', level: 'mastered' as const, context: isFr ? 'Auth, DB, Storage, Realtime — fondation de produits scalables' : 'Auth, DB, Storage, Realtime — foundation for scalable products' },
        { name: 'Node.js / APIs REST', level: 'learning' as const, context: isFr ? 'APIs REST modernes et performantes' : 'Modern and performant REST APIs' },
        { name: 'Software Design & Architecture', level: 'learning' as const, context: isFr ? 'Patterns, modularité, systèmes scalables' : 'Patterns, modularity, scalable systems' },
        { name: 'Framer Motion / Animations', level: 'mastered' as const, context: isFr ? 'Expériences utilisateur fluides et professionnelles' : 'Smooth and professional user experiences' },
      ],
    },
    {
      title: isFr ? 'IA & Systèmes Intelligents' : 'AI & Intelligent Systems',
      accent: 'bg-purple-400',
      skills: [
        { name: 'Prompt Engineering', level: 'mastered' as const, context: isFr ? 'Conception de prompts complexes et chaînes de raisonnement. Utilisé dans AgentFactura et Assistant OHADA.' : 'Complex prompt design and chain-of-thought. Used in AgentFactura and OHADA Legal Assistant concepts.' },
        { name: 'LLM Orchestration & Workflows', level: 'learning' as const, context: isFr ? 'Chaînes, pipelines et intégration multi-modèles' : 'Chains, pipelines and multi-model integration' },
        { name: 'RAG Systems', level: 'learning' as const, context: isFr ? 'Retrieval-Augmented Generation, embeddings, vector databases' : 'Retrieval-Augmented Generation, embeddings, vector databases' },
        { name: 'AI Agents & Multi-Agent Systems', level: 'learning' as const, context: isFr ? 'Agents autonomes, orchestration, tool use — spécialisation 2026 en cours' : 'Autonomous agents, orchestration, tool use — 2026 specialization in progress' },
        { name: 'Human-AI Collaboration', level: 'learning' as const, context: isFr ? 'Conception de workflows où l\'humain et l\'IA collaborent efficacement' : 'Designing workflows where humans and AI collaborate effectively' },
      ],
    },
    {
      title: isFr ? 'Outils & Méthodes' : 'Tools & Methods',
      accent: 'bg-emerald-400',
      skills: [
        { name: 'Git / GitHub', level: 'mastered' as const, context: isFr ? 'Versioning, collaboration et contribution open-source' : 'Versioning, collaboration and open-source contribution' },
        { name: 'Problem Framing & Product Thinking', level: 'mastered' as const, context: isFr ? 'De l\'observation d\'un problème réel à la conception d\'un produit' : 'From observing a real problem to designing a product' },
        { name: 'Figma / UI Design', level: 'learning' as const, context: isFr ? 'Maquettes, prototypes et systèmes de design' : 'Mockups, prototypes and design systems' },
        { name: 'Vercel / Netlify / CI/CD', level: 'mastered' as const, context: isFr ? 'Déploiement continu et mise en production rapide' : 'Continuous deployment and fast production releases' },
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
            {/* EVOLUTION 2026: Subtitle aligné avec Journey */}
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'De la construction logicielle à la conception de systèmes intelligents.' : 'From software engineering to intelligent systems design.'}
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
                <span className={`w-2 h-8 ${category.accent} rounded-full`} />
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

        {/* EVOLUTION 2026: Note honnêteté — alignée avec Journey */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#4A5568] text-sm italic max-w-2xl mx-auto">
            {isFr 
              ? 'Je ne veux pas devenir juste un autre développeur full-stack. Je travaille avec une approche honnête : je ne liste que ce que je peux défendre et expliquer. L\'IA est mon domaine d\'apprentissage le plus actif. Ma capacité à utiliser intelligemment les outils IA pour mener des projets à terme est une compétence à part entière. J\'investis délibérément dans cette direction pour devenir un ingénieur de systèmes intelligents.' 
              : 'I do not want to become just another full-stack developer. I work with an honest approach: I only list what I can defend and explain. AI is my most active area of learning. My ability to intelligently use AI tools to complete projects is a skill in its own right. I am deliberately investing in this direction to become an intelligent systems engineer.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;