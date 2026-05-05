/**
 * Portfolio Main Route
 * 
 * Contains all portfolio sections with loading states.
 */

import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/layout/CustomCursor';
import ParticlesBackground from '../components/ui/ParticlesBackground';
import { SkeletonHero } from '../components/ui/Skeleton';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import GrowTech from '../components/sections/GrowTech';
import Vision from '../components/sections/Vision';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

const Portfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[var(--bg-primary)]">
        <ParticlesBackground />
        <div className="noise-overlay" />
        <div className="grid-bg" />
        <Navbar />
        <main className="relative z-10 pt-20">
          <div className="container-custom py-12">
            <SkeletonHero />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)]">
      <ParticlesBackground />
      <div className="noise-overlay" />
      <div className="grid-bg" />
      
      <CustomCursor />
      <Navbar />
      
      <main className="relative z-10">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="skills">
          <Skills />
        </section>
        
        <section id="projects">
          <Projects />
        </section>
        
        <section id="growtech">
          <GrowTech />
        </section>
        
        <section id="vision">
          <Vision />
        </section>
        
        <section id="testimonials">
          <Testimonials />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Portfolio;
