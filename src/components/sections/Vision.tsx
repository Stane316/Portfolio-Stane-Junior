/**
 * Vision Section Component
 * 
 * Shows future projects and ideas:
 * - FacturaPro (OHADA invoicing SaaS)
 * - BeninPro (professional marketplace)
 * 
 * Demonstrates product thinking and market research.
 * 
 * @see /src/contexts/LanguageContext.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionNumber from '../../components/ui/SectionNumber';

interface VisionProject {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  status: 'concept' | 'development' | 'beta';
  icon: string;
}

const Vision: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const projects: VisionProject[] = [
    {
      title: 'FacturaPro',
      subtitle: isFr ? 'Facturation OHADA' : 'OHADA Invoicing',
      description: isFr 
        ? 'SaaS de facturation conçu pour les entrepreneurs d\'Afrique francophone. Résout le problème de gestion des factures observé dans les agences Mobile Money.'
        : 'Invoicing SaaS designed for entrepreneurs in French-speaking Africa. Solves the invoicing management problem observed in Mobile Money agencies.',
      features: ['Conformité OHADA', 'Multi-devises', 'Facture PDF', 'Suivi paiements'],
      status: 'concept',
      icon: '📄',
    },
    {
      title: 'BeninPro',
      subtitle: isFr ? 'Marketplace Pro' : 'Pro Marketplace',
      description: isFr
        ? 'Marketplace dédiée aux professionnels et services béninois. Connecte clients et prestataires sur une plateforme adaptée au contexte local.'
        : 'Marketplace dedicated to Beninese professionals and services. Connects clients and providers on a platform adapted to the local context.',
      features: ['Paiement Mobile Money', 'Géolocalisation', 'Avis vérifiés', 'Chat intégré'],
      status: 'development',
      icon: '🌍',
    },
    {
      title: 'EduConnect',
      subtitle: isFr ? 'Éducation Numérique' : 'Digital Education',
      description: isFr
        ? 'Plateforme de mentorat et de partage de ressources pour les étudiants en informatique de l\'UAC. Facilite l\'entraide et l\'apprentissage collaboratif.'
        : 'Mentorship and resource sharing platform for UAC computer science students. Facilitates peer support and collaborative learning.',
      features: ['Forum étudiant', 'Ressources cours', 'Mentorat', 'Projets open source'],
      status: 'concept',
      icon: '🎓',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'development': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'beta': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'development': return isFr ? 'En développement' : 'In Development';
      case 'beta': return 'Beta';
      default: return isFr ? 'Concept' : 'Concept';
    }
  };

  return (
    <section id="vision" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="04" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              VISION
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Les projets qui façonneront demain.' : 'Projects that will shape tomorrow.'}
            </p>
          </div>
        </div>

        {/* Grille des Projets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group relative bg-[#141430] border border-[#1A1A2E] rounded-3xl p-8 lg:p-10 overflow-hidden hover:border-[#00BFFF] transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,191,255,0.15)]"
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00BFFF] rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 -mr-16 -mt-16" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Header Carte */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{project.icon}</span>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-heading text-white">{project.title}</h3>
                      <p className="text-[#00BFFF] text-sm font-medium uppercase tracking-widest">{project.subtitle}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[#A8B4C8] leading-relaxed mb-8 flex-1">
                  {project.description}
                </p>

                {/* Features List */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#0A0A1E] border border-[#1A1A2E] rounded-lg text-[#A8B4C8] text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vision;