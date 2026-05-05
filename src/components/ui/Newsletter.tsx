import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const Newsletter: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulation d'envoi (remplacer par vrai appel API)
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1000);
  };

  return (
    <section className="py-16 sm:py-20 relative" aria-labelledby="newsletter-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card max-w-2xl mx-auto text-center p-6 sm:p-10 border border-[var(--accent-cyan)] border-opacity-20"
        >
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[var(--accent-cyan)] bg-opacity-10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h2 id="newsletter-title" className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white mb-2 sm:mb-3">
            {isFr ? 'Restez informé' : 'Stay Updated'}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
            {isFr 
              ? 'Recevez les dernières nouvelles sur mes projets, articles et opportunités de collaboration.'
              : 'Get the latest news about my projects, articles and collaboration opportunities.'}
          </p>

          {/* Form */}
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 sm:p-6 bg-green-500 bg-opacity-10 border border-green-500 rounded-xl"
            >
              <span className="text-2xl mb-2 block">✅</span>
              <p className="text-green-400 font-medium">
                {isFr ? 'Merci pour votre inscription !' : 'Thank you for subscribing!'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFr ? 'votre@email.com' : 'your@email.com'}
                  required
                  className="w-full px-4 py-3 glass rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-white placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                  aria-label={isFr ? 'Adresse email' : 'Email address'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary inline-flex items-center justify-center gap-2 min-h-[48px] whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isFr ? 'Inscription...' : 'Subscribing...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    {isFr ? 'S\'inscrire' : 'Subscribe'}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy note */}
          <p className="text-[var(--text-muted)] text-xs mt-4">
            {isFr 
              ? 'Pas de spam. Désabonnement en un clic.'
              : 'No spam. Unsubscribe anytime.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;