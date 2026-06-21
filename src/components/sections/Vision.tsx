import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import SectionNumber from '../../components/ui/SectionNumber';
import { SkeletonVision } from '../../components/ui/Skeleton';

/**
 * Vision Section — Public display of future projects/concepts
 *
 * P-15 FIX: Uses SkeletonVision instead of simple spinner
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
// Fallback data — when Supabase is unavailable
// ============================================================

const FALLBACK_VISIONS: VisionItem[] = [
  {
    id: '1',
    title_fr: 'FacturaPro',
    title_en: 'FacturaPro',
    description_fr: "SaaS de facturation conçu pour les entrepreneurs d'Afrique francophone. Résout le problème de gestion des factures observé dans les agences Mobile Money.",
    description_en: 'Invoicing SaaS designed for entrepreneurs in French-speaking Africa. Solves the invoicing management problem observed in Mobile Money agencies.',
    status: 'concept',
    image_url: '',
    order: 1,
    created_at: '',
  },
  {
    id: '2',
    title_fr: 'BeninPro',
    title_en: 'BeninPro',
    description_fr: 'Marketplace dédiée aux professionnels et services béninois. Connecte clients et prestataires sur une plateforme adaptée au contexte local.',
    description_en: 'Marketplace dedicated to Beninese professionals and services. Connects clients and providers on a platform adapted to the local context.',
    status: 'in_progress',
    image_url: '',
    order: 2,
    created_at: '',
  },
  {
    id: '3',
    title_fr: 'EduConnect',
    title_en: 'EduConnect',
    description_fr: "Plateforme de mentorat et de partage de ressources pour les étudiants en informatique de l'UAC. Facilite l'entraide et l'apprentissage collaboratif.",
    description_en: 'Mentorship and resource sharing platform for UAC computer science students. Facilitates peer support and collaborative learning.',
    status: 'concept',
    image_url: '',
    order: 3,
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

        {/* P-15 FIX: Skeleton loading */}
        {loading ? (
          <SkeletonVision />
        ) : (
          /* Grille des Projets */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visions.map((item, index) => (
              <motion.div
                key={item.id}
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
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={isFr ? item.title_fr : item.title_en}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#0A0A1E] border border-[#1A1A2E] flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#00BFFF] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
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
      </div>
    </section>
  );
};

export default Vision;
