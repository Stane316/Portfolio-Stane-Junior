/**
 * Testimonials Section Component
 * 
 * Displays testimonials loaded from Supabase.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import SectionNumber from '../../components/ui/SectionNumber';

// Composant Modal Vidéo
const VideoModal: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => {
  const getEmbedUrl = (link: string) => {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      const videoId = link.split('v=')[1] || link.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (link.includes('vimeo.com')) {
      const videoId = link.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return link;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[#141430]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-colors">
          ✕
        </button>
        <iframe 
          src={getEmbedUrl(url)} 
          className="w-full h-full" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen 
        />
      </div>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { testimonials, loading } = useSupabaseData();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-[#0A0A1E]">
        <div className="container-custom text-center">
          <div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 bg-[#0A0A1E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="04" />
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-heading text-white tracking-tighter relative z-10">
              TÉMOIGNAGES
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Ce que disent ceux qui m\'ont fait confiance.' : 'What those who trusted me say.'}
            </p>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-20 border-t border-[#141430]">
            <p className="text-[#A8B4C8] text-xl italic">
              {isFr ? 'Les témoignages arrivent bientôt...' : 'Testimonials coming soon...'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#141430] border border-[#1A1A2E] rounded-xl overflow-hidden hover:border-[#00BFFF] transition-colors duration-300"
              >
                {/* Carte Vidéo ou Citation */}
                {t.video_url ? (
                  <div 
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden"
                    onClick={() => setActiveVideo(t.video_url)}
                  >
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.person_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1A1A2E] to-[#0A0A1E] flex items-center justify-center">
                        <span className="text-4xl opacity-30">🎥</span>
                      </div>
                    )}
                    {/* Overlay Play */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#00BFFF] bg-opacity-90 flex items-center justify-center text-black pl-1 shadow-lg transform group-hover:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex items-center gap-4 border-b border-[#1A1A2E]">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.person_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#0A0A1E] flex items-center justify-center text-lg font-bold text-[#00BFFF]">
                        {t.person_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-semibold">{t.person_name}</h4>
                      <p className="text-[#4A5568] text-xs">{t.person_role}</p>
                    </div>
                  </div>
                )}

                {/* Contenu Texte */}
                <div className="p-6">
                  <p className="text-[#A8B4C8] text-sm leading-relaxed line-clamp-4 mb-4">
                    "{isFr ? t.content_fr : t.content_en}"
                  </p>
                  {!t.video_url && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-px bg-[#00BFFF]" />
                      <span className="text-[#00BFFF] text-xs uppercase tracking-widest">
                        {t.company || 'Client'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Vidéo */}
      <AnimatePresence>
        {activeVideo && <VideoModal url={activeVideo} onClose={() => setActiveVideo(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;