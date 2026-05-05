/**
 * Testimonials Section Component
 * 
 * Displays testimonials loaded from Supabase.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const Testimonials: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { testimonials, loading } = useSupabaseData();

  if (loading) {
    return (
      <section id="testimonials" className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-8 h-8 border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">{isFr ? 'Chargement...' : 'Loading...'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 lg:py-32 relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
              <span className="text-gradient">
                {isFr ? "Ce que disent ceux qui m'ont fait confiance" : "What those who trusted me say"}
              </span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent-cyan)] mx-auto rounded-full" />
          </div>

          {testimonials.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card max-w-2xl mx-auto text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--accent-cyan)]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] text-base sm:text-lg italic">
                {isFr 
                  ? "Les témoignages arrivent bientôt — les projets, eux, sont déjà là."
                  : "Testimonials coming soon — the projects are already there."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="project-card"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {testimonial.photo_url ? (
                      <img
                        src={testimonial.photo_url}
                        alt={testimonial.person_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-cyan)] flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {testimonial.person_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{testimonial.person_name}</h4>
                      <p className="text-[var(--accent-cyan)] text-sm">{testimonial.person_role}</p>
                      {testimonial.company && (
                        <p className="text-[var(--text-secondary)] text-sm">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] italic">
                    "{isFr ? testimonial.content_fr : testimonial.content_en}"
                  </p>
                  {testimonial.video_url && (
                    <div className="mt-4">
                      <a
                        href={testimonial.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent-cyan)] text-sm hover:underline"
                      >
                        {isFr ? 'Voir la vidéo' : 'Watch video'} →
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
