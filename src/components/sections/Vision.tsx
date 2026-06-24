import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import SectionNumber from '../../components/ui/SectionNumber';
import { SkeletonVision } from '../../components/ui/Skeleton';

/**
 * Vision Section — Public display of future projects/concepts
 *
 * EVOLUTION 2026: "Ce que je construis pour demain"
 * - Stronger storytelling: observer problème → documenter solution → valider
 * - AI concepts are the natural prolongation of delivered projects (FacturaPro → AgentFactura)
 * - Position as concrete evidence of the journey toward intelligent systems
 */

interface VisionItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  status: 'concept' | 'in_progress' | 'paused';
  image_url: string;
  order: number;
  created_at: string;
}

// ============================================================
// Fallback data — EVOLUTION 2026: Aligned with Journey + Skills
// From mathematics rigor → software foundations → intelligent systems
// ============================================================

const FALLBACK_VISIONS: VisionItem[] = [
  {
    id: '1',
    title_fr: 'FacturaPro',
    title_en: 'FacturaPro',
    description_fr: "SaaS de facturation conçu pour les entrepreneurs d'Afrique francophone. Résout le problème de gestion des factures observé dans les agences Mobile Money. Premier produit livré qui a posé les bases d'une automatisation intelligente.",
    description_en: 'Invoicing SaaS designed for entrepreneurs in French-speaking Africa. Solves the invoicing management problem observed in Mobile Money agencies. First delivered product that laid the foundations for intelligent automation.',
    status: 'concept',
    image_url: '',
    order: 1,
    created_at: '',
  },
  {
    id: '2',
    title_fr: 'AgentFactura',
    title_en: 'AgentFactura',
    description_fr: "Un agent IA de facturation intelligente pour la zone OHADA. Comprend le contexte réglementaire, génère des factures conformes, prédit les flux de trésorerie et automatise le suivi. FacturaPro évolue naturellement vers un système intelligent.",
    description_en: 'An AI invoicing agent for the OHADA zone. Understands regulatory context, generates compliant invoices, predicts cash flows and automates follow-up. FacturaPro evolves naturally into an intelligent system.',
    status: 'concept',
    image_url: '',
    order: 2,
    created_at: '',
  },
  {
    id: '3',
    title_fr: 'MentorLink',
    title_en: 'MentorLink',
    description_fr: "Plateforme de mentorat académique avec système de recommandation intelligent. Connecte étudiants et mentors via un accompagnement adaptatif. Pas juste un réseau — un système qui apprend des parcours de réussite pour construire des trajectoires plus efficaces.",
    description_en: 'Academic mentorship platform with intelligent recommendation system. Connects students and mentors through adaptive accompaniment. Not just a network — a system that learns from success paths to build more effective trajectories.',
    status: 'concept',
    image_url: '',
    order: 3,
    created_at: '',
  },
  {
    id: '4',
    title_fr: 'Assistant Juridique OHADA',
    title_en: 'OHADA Legal Assistant',
    description_fr: "Un système RAG alimenté par la documentation juridique OHADA qui aide les entrepreneurs à naviguer les obligations légales. L'IA au service de l'accessibilité juridique en Afrique francophone. Un exemple concret de système intelligent utile.",
    description_en: 'A RAG system powered by OHADA legal documentation that helps entrepreneurs navigate legal obligations. AI serving legal accessibility in French-speaking Africa. A concrete example of a useful intelligent system.',
    status: 'concept',
    image_url: '',
    order: 4,
    created_at: '',
  },
];

// ============================================================
// Component
// ============================================================

const Vision: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [visions, setVisions] = useState<VisionItem[]>(FALLBACK_VISIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchVisions = async () => {
      try {
        const { data, error } = await supabase
          .from('vision_items')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          setVisions(data as VisionItem[]);
        }
      } catch (err) {
        console.error('Error fetching visions:', err);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchVisions();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'paused': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return isFr ? 'En développement' : 'In Development';
      case 'paused': return isFr ? 'En pause' : 'Paused';
      default: return isFr ? 'Concept documenté' : 'Documented Concept';
    }
  };

  // EVOLUTION 2026: AI concepts get visual distinction + link to journey
  const isAIConcept = (title: string) => {
    const aiKeywords = ['Agent', 'AI', 'Assistant', 'Intelligent', 'RAG', 'MentorLink'];
    return aiKeywords.some(kw => title.includes(kw));
  };

  return (
    <section id="vision" className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header — EVOLUTION 2026: "Ce que je construis pour demain" */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="03" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              {isFr ? 'VISION' : 'VISION'}
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr 
                ? "Ce que je construis pour demain. Des idées documentées. Des problèmes réels. Des systèmes intelligents en construction."
                : "What I'm building for tomorrow. Documented ideas. Real problems. Intelligent systems in construction."}
            </p>
          </div>
        </div>

        {/* Stronger explanation per evolution plan */}
        <div className="max-w-3xl mb-16">
          <p className="text-[#A8B4C8] text-lg leading-relaxed">
            {isFr 
              ? "Ces projets ne sont pas encore livrés. Ils sont en réflexion, en pause ou en construction. Je les présente ici non pas pour prétendre qu'ils existent, mais parce qu'ils témoignent d'une façon de penser : observer un problème de marché, documenter une solution, valider avant de coder. Ils illustrent ma progression naturelle du génie logiciel vers l'ingénierie des systèmes intelligents."
              : "These projects are not yet delivered. They are in reflection, on hold, or under construction. I present them here not to claim they exist, but because they demonstrate a way of thinking: observe a market problem, document a solution, validate before coding. They illustrate my natural progression from software engineering toward intelligent systems engineering."}
          </p>
        </div>

        {/* P-15 FIX: Skeleton loading */}
        {loading ? (
          <SkeletonVision />
        ) : (
          /* Grille des Projets — EVOLUTION 2026: AI concepts highlighted */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className={`group relative bg-[#141430] border rounded-3xl p-8 lg:p-10 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,191,255,0.15)] ${
                  isAIConcept(isFr ? item.title_fr : item.title_en)
                    ? 'border-purple-500/30 hover:border-purple-400'
                    : 'border-[#1A1A2E] hover:border-[#00BFFF]'
                }`}
              >
                {/* Background Glow Effect */}
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 -mr-16 -mt-16 ${
                  isAIConcept(isFr ? item.title_fr : item.title_en)
                    ? 'bg-purple-400'
                    : 'bg-[#00BFFF]'
                }`} />

                {/* EVOLUTION 2026: AI badge for AI concepts */}
                {isAIConcept(isFr ? item.title_fr : item.title_en) && (
                  <div className="absolute top-6 right-6">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/40">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      IA
                    </span>
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header Carte */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={isFr ? item.title_fr : item.title_en}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={`w-16 h-16 rounded-xl border flex items-center justify-center ${
                          isAIConcept(isFr ? item.title_fr : item.title_en)
                            ? 'bg-purple-500/10 border-purple-500/30'
                            : 'bg-[#0A0A1E] border-[#1A1A2E]'
                        }`}>
                          <svg className={`w-8 h-8 opacity-50 ${isAIConcept(isFr ? item.title_fr : item.title_en) ? 'text-purple-400' : 'text-[#00BFFF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-heading text-white">
                          {isFr ? item.title_fr : item.title_en}
                        </h3>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#A8B4C8] leading-relaxed mb-8 flex-1">
                    {isFr ? item.description_fr : item.description_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* EVOLUTION 2026: Strong closing statement — links Vision to Journey & Future */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#A8B4C8] text-sm italic max-w-2xl mx-auto">
            {isFr
              ? "Ces concepts documentés sont la preuve que je ne construis pas seulement des logiciels. Je construis des systèmes qui apprennent, s'adaptent et créent de la valeur réelle pour l'Afrique — le prolongement naturel de mon parcours."
              : "These documented concepts prove that I don't just build software. I build systems that learn, adapt, and create real value for Africa — the natural extension of my journey."}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;