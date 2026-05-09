import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SectionNumber from '../../components/ui/SectionNumber';

const Contact: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  // Schema de validation (Conservé)
  const schema = yup.object({
    name: yup.string()
      .required(isFr ? 'Nom requis' : 'Name required')
      .min(2, isFr ? 'Nom trop court' : 'Name too short'),
    email: yup.string()
      .email(isFr ? 'Email invalide' : 'Invalid email')
      .required(isFr ? 'Email requis' : 'Email required'),
    subject: yup.string()
      .oneOf(['freelance', 'growtech', 'other'], 'Invalid subject'),
    message: yup.string()
      .required(isFr ? 'Message requis' : 'Message required')
      .min(10, isFr ? 'Message trop court' : 'Message too short'),
  }).required();

  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('idle');
    
    try {
      const isConfigured = supabase && typeof supabase.from === 'function';

      if (isConfigured) {
        const { error } = await supabase
          .from('messages')
          .insert([{
            full_name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          }]);

        if (error) throw error;
      }

      setSubmitStatus('success');
      reset();

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const socialLinks = [
    {
      href: 'https://wa.me/2290199218112',
      label: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
    },
    {
      href: 'https://www.linkedin.com/in/stane-aniambossou-2a412b3b8/',
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      href: 'https://github.com/Stane316/',
      label: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Colonne Gauche : Info & Liens */}
          <div className="relative">
            <SectionNumber number="05" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10 mb-6">
              CONTACT
            </h2>
            <p className="text-[#A8B4C8] text-xl font-light leading-relaxed mb-12 relative z-10">
              {isFr 
                ? 'Un projet en tête ? Une idée à concrétiser ? Discutons-en.' 
                : 'Have a project in mind? An idea to make reality? Let\'s talk.'}
            </p>

            {/* Social Links */}
            <div className="mb-12 relative z-10">
              <h3 className="text-white font-semibold mb-4 uppercase tracking-widest text-sm">
                {isFr ? 'Réseaux sociaux' : 'Social Networks'}
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[#141430] border border-[#1A1A2E] rounded-lg text-[#A8B4C8] hover:text-white hover:border-[#00BFFF] transition-all duration-300"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#141430] flex items-center justify-center text-[#00BFFF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-[#4A5568] text-xs uppercase tracking-widest">Email</p>
                  <a href="mailto:contact@stanejunior.com" className="text-white hover:text-[#00BFFF] transition-colors">contact@stanejunior.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#141430] flex items-center justify-center text-[#00BFFF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-[#4A5568] text-xs uppercase tracking-widest">WhatsApp</p>
                  <p className="text-white">+229 01 99 21 81 12</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#141430] flex items-center justify-center text-[#00BFFF]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-[#4A5568] text-xs uppercase tracking-widest">Localisation</p>
                  <p className="text-white">{isFr ? 'Abomey-Calavi, Bénin' : 'Abomey-Calavi, Benin'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#141430] p-8 lg:p-12 rounded-2xl border border-[#1A1A2E] shadow-2xl"
          >
            <h3 className="text-2xl text-white font-bold mb-8">
              {isFr ? 'Envoyez un message' : 'Send a message'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#4A5568] mb-2">
                  {isFr ? 'Nom complet' : 'Full name'}
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full bg-[#0A0A1E] border ${errors.name ? 'border-red-500' : 'border-[#1A1A2E]'} rounded-lg px-4 py-3 text-white focus:border-[#00BFFF] focus:outline-none transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#4A5568] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full bg-[#0A0A1E] border ${errors.email ? 'border-red-500' : 'border-[#1A1A2E]'} rounded-lg px-4 py-3 text-white focus:border-[#00BFFF] focus:outline-none transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#4A5568] mb-2">
                  {isFr ? 'Sujet' : 'Subject'}
                </label>
                <select
                  {...register('subject')}
                  className="w-full bg-[#0A0A1E] border border-[#1A1A2E] rounded-lg px-4 py-3 text-white focus:border-[#00BFFF] focus:outline-none transition-colors"
                >
                  <option value="freelance">{isFr ? 'Mission freelance' : 'Freelance mission'}</option>
                  <option value="growtech">{isFr ? 'Collaboration GROW TECH' : 'GROW TECH collaboration'}</option>
                  <option value="other">{isFr ? 'Autre' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#4A5568] mb-2">
                  {isFr ? 'Message' : 'Message'}
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className={`w-full bg-[#0A0A1E] border ${errors.message ? 'border-red-500' : 'border-[#1A1A2E]'} rounded-lg px-4 py-3 text-white focus:border-[#00BFFF] focus:outline-none transition-colors resize-none`}
                  placeholder="..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#00BFFF] text-black font-bold py-4 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    {isFr ? 'Envoi...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {isFr ? 'Envoyer le message' : 'Send message'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>

              {submitStatus === 'success' && <p className="text-green-400 text-sm text-center">✅ {isFr ? 'Message envoyé !' : 'Message sent!'}</p>}
              {submitStatus === 'error' && <p className="text-red-400 text-sm text-center">❌ {isFr ? 'Erreur lors de l\'envoi.' : 'Error sending.'}</p>}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;