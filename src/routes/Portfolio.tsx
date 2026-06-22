import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/layout/CustomCursor';
import HeroScene from '../components/three/HeroScene';
import ScrollProgress from '../components/layout/ScrollProgress';
import { SkeletonHero } from '../components/ui/Skeleton';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Journey from '../components/sections/Journey';
import Skills from '../components/sections/Skills';
import ProjectsStrip from '../components/sections/ProjectsStrip';
import ProjectsDetails from '../components/sections/ProjectsDetails';
import Vision from '../components/sections/Vision';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

const Portfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll); };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#0A0A1E]">
        <div className="absolute inset-0 z-0 bg-[#0A0A1E]" />
        <Navbar />
        <main className="relative z-10 pt-20">
          <div className="container-custom py-12"><SkeletonHero /></div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A1E]">
      <ScrollProgress />
      <HeroScene />
      <div className="noise-overlay" />
      <div className="grid-bg" />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">
        <section id="hero" aria-label="Section d'accueil"><Hero /></section>
        <section id="about" aria-label="À propos"><About /></section>
        <section id="journey" aria-label="Parcours"><Journey /></section>
        <section id="skills" aria-label="Compétences"><Skills /></section>
        <section id="projects" aria-label="Projets"><ProjectsStrip /></section>
        <section id="projects-details" aria-label="Détails des projets"><ProjectsDetails /></section>
        <section id="vision" aria-label="Vision"><Vision /></section>
        <section id="testimonials" aria-label="Témoignages"><Testimonials /></section>
        <section id="contact" aria-label="Contact"><Contact /></section>
      </main>
      <Footer />
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#00BFFF] text-black rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A1E]" aria-label="Retour en haut de la page">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
        </button>
      )}
    </div>
  );
};

export default Portfolio;