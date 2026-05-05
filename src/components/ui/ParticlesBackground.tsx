/**
 * Particles Background Component
 * 
 * Interactive particle system using @tsparticles/react
 */

import React from 'react';
// @ts-ignore
import Particles from '@tsparticles/react';

const ParticlesBackground: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* @ts-ignore */}
      <Particles
        id="tsparticles"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'grab' },
            },
            modes: {
              grab: {
                distance: 140,
                links: { opacity: 0.5 },
              },
            },
          },
          particles: {
            color: { value: '#00BFFF' },
            links: {
              color: '#00BFFF',
              distance: isMobile ? 100 : 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: isMobile ? 0.5 : 1,
              straight: false,
            },
            number: {
              density: { enable: true, width: 800, height: 800 },
              value: isMobile ? 30 : 80,
            },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
