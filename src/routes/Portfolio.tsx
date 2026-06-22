import React, { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/layout/CustomCursor';
import ScrollProgress from '../components/layout/ScrollProgress';
import { SkeletonHero } from '../components/ui/Skeleton';
import SectionSkeleton from '../components/ui/SectionSkeleton';

// Lazy load heavy sections for P1 Performance
const Hero = lazy(() => import('../components/sections/Hero'));
const About = lazy(() => import('../components/sections/About'));
const Journey = lazy(() => import('../components/sections/Journey'));
const Skills = lazy(() => import('../components/sections/Skills'));
const ProjectsStrip = lazy(() => import('../components/sections/ProjectsStrip'));
const ProjectsDetails = lazy(() => import('../components/sections/ProjectsDetails'));
const Vision = lazy(() => import('../components/sections/Vision'));
const Testimonials = lazy(() => import('../components/sections/Testimonials'));
const Contact = lazy(() => import('../components/sections/Contact'));

// Lazy load Three.js scene (heavy) - P1 optimization
const HeroScene = lazy(() => import('../components/three/HeroScene'));

const SectionLoader = () => <SectionSkeleton height="h-[420px]" />;

const Portfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 650);
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

      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
      
      <div className="noise-overlay" />
      <div className="grid-bg" />
      
      <CustomCursor />
      <Navbar />
      
      <main className="relative z-10">
        <section id="hero" aria-label="Section d'accueil">
          <Suspense fallback={<SkeletonHero />}>
            <Hero />
          </Suspense>
        </section>
        
        <section id="about" aria-label="À propos">
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
        </section>
        
        <section id="journey" aria-label="Parcours">
          <Suspense fallback={<SectionLoader />}>
            <Journey />
          </Suspense>
        </section>
        
        <section id="skills" aria-label="Compétences">
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
        </section>
        
        <section id="projects" aria-label="Projets">
          <Suspense fallback={<SectionLoader />}>
            <ProjectsStrip />
          </Suspense>
        </section>

        <section id="projects-details" aria-label="Détails des projets">
          <Suspense fallback={<SectionLoader />}>
            <ProjectsDetails />
          </Suspense>
        </section>
        
        <section id="vision" aria-label="Vision">
          <Suspense fallback={<SectionLoader />}>
            <Vision />
          </Suspense>
        </section>
        
        <section id="testimonials" aria-label="Témoignages">
          <Suspense fallback={<SectionLoader />}>
            <Testimonials />
          </Suspense>
        </section>
        
        <section id="contact" aria-label="Contact">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </section>
      </main>
      
      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#00BFFF] text-black rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-80 transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A1E]"
          aria-label="Retour en haut de la page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Portfolio;