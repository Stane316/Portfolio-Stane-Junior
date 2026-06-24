import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';

/**
 * HERO — CINEMATIC IMMERSIVE SCENE (Creative Direction Master Prompt)
 * Supports IMAGE or VIDEO dynamically
 */

const Hero: React.FC = () => {
  const { lang, t } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  const getStat = (key: string, field: 'value' | 'label') => {
    const config = siteConfig[`hero_stat_${key}`];
    if (!config) return field === 'value' ? '0' : '';
    return field === 'value' ? config.value_generic || '0' : (isFr ? config.value_fr : config.value_en);
  };

  const badge = siteConfig['hero_badge'] ? (isFr ? siteConfig['hero_badge'].value_fr : siteConfig['hero_badge'].value_en) : t('hero.badge');
  const tagline = siteConfig['hero_tagline'] ? (isFr ? siteConfig['hero_tagline'].value_fr : siteConfig['hero_tagline'].value_en) : t('hero.tagline');
  const ctaProjects = t('hero.cta.projects');
  const ctaContact = t('hero.cta.contact');
  const cvUrl = siteConfig['cv_url']?.value_generic || '#';

  const heroImageUrl = siteConfig['hero_image_url']?.value_generic || '';
  const heroVideoUrl = siteConfig['hero_video_url']?.value_generic || '';
  const useVideo = !!heroVideoUrl;

  const stats = [
    { value: getStat('1', 'value'), label: getStat('1', 'label') },
    { value: getStat('2', 'value'), label: getStat('2', 'label') },
    { value: getStat('3', 'value'), label: getStat('3', 'label') },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 lg:pt-16 overflow-hidden bg-[#0A0A1E]">
      {/* Cinematic layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#1A1A2E_0.7px,transparent_1px)] bg-[length:3.5px_3.5px] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#00BFFF]/8 rounded-full blur-[180px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
              <div className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full animate-pulse" />
              <span className="text-[#00BFFF] text-xs sm:text-sm font-medium tracking-[3px] uppercase">{badge}</span>
            </div>

            <h1 className="text-[52px] sm:text-[68px] md:text-[82px] lg:text-[92px] xl:text-[102px] font-display font-bold leading-[0.86] tracking-[-4.5px] mb-7">
              <span className="text-white">{t('hero.headline.line1')}</span><br />
              <span className="text-[#00BFFF]">{t('hero.headline.line2')}</span>
            </h1>

            <p className="text-[17px] sm:text-xl text-[#A8B4C8] max-w-[580px] mx-auto lg:mx-0 mb-9 leading-relaxed">
              {tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <a href="#projects" className="inline-flex items-center justify-center gap-3 px-10 py-[17px] rounded-2xl bg-white text-black font-semibold text-base hover:bg-[#00BFFF] hover:text-white active:scale-[0.985] transition-all">
                {ctaProjects}
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-3 px-10 py-[17px] rounded-2xl border border-white/30 hover:bg-white/5 font-medium text-base transition-all">
                {ctaContact}
              </a>
            </div>

            {cvUrl && cvUrl !== '#' && (
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[#A8B4C8] hover:text-white mb-10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {t('about.cv.download')}
              </a>
            )}

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#141430]/80 border border-[#1A1A2E] rounded-2xl py-3.5 text-center">
                  <div className="text-3xl font-display font-bold text-[#00BFFF] tracking-tighter">{stat.value}</div>
                  <div className="text-[#A8B4C8] text-[10px] mt-1 tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cinematic visual (image OR video) */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#00BFFF]/5 rounded-[3.5rem] blur-3xl" />
              <div className="relative rounded-[3rem] overflow-hidden border border-[#1A1A2E] shadow-2xl bg-black">
                {useVideo ? (
                  <video src={heroVideoUrl} autoPlay muted loop playsInline className="w-full h-auto object-cover aspect-[4/4.65]" />
                ) : heroImageUrl ? (
                  <img src={heroImageUrl} alt="Stane-Junior Aniambossou" className="w-full h-auto object-cover aspect-[4/4.65]" />
                ) : (
                  <div className="w-full aspect-[4/4.65] bg-gradient-to-br from-[#141430] to-black flex items-center justify-center">
                    <span className="text-[110px] font-display text-white/20 tracking-[-8px]">SJ</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.55px,transparent_1px)] bg-[length:3px_3px] opacity-[0.04] pointer-events-none" />
              </div>
              <div className="absolute -bottom-5 -right-5 w-36 h-36 border border-[#00BFFF]/15 rounded-[2.5rem] -z-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center text-[#A8B4C8]/50 text-xs tracking-[3px]">
        SCROLL
        <div className="w-px h-9 mt-2 bg-gradient-to-b from-[#00BFFF]/40 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;