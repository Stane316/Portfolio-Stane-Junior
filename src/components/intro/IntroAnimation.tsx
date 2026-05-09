import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onFinish: () => void;
}

// Composant pour animer le texte avec effet courbe/arc
const CurvedText: React.FC<{ text: string; className?: string; delayStart?: number }> = ({ 
  text, 
  className, 
  delayStart = 0 
}) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: delayStart },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 120,
        mass: 1.2,
      },
    },
    hidden: {
      opacity: 0,
      y: 60,
      rotateX: -45,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 120,
        mass: 1.2,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ display: 'inline-flex' }}
    >
      {letters.map((letter, index) => (
        <motion.span 
          key={index} 
          variants={child}
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Séquence d'animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),       // "Welcome" apparaît avec effet courbe
      setTimeout(() => setStep(2), 2800),      // "Welcome" part, Nom apparaît
      setTimeout(() => setStep(3), 4200),      // Sous-titre apparaît
      setTimeout(() => {                         // Barre de progression
        let p = 0;
        const interval = setInterval(() => {
          p += 2;
          setProgress(p);
          if (p >= 100) clearInterval(interval);
        }, 15);
      }, 4800),
      setTimeout(() => onFinish(), 6200),      // Fin
    ];

    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-[#0A0A1E] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 text-center flex flex-col items-center justify-center min-h-[300px]">
        
        {/* ÉTAPE 1 : WELCOME AVEC EFFET COURBE */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute flex flex-col items-center"
            >
              <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-6">
                <CurvedText text="WELCOME" delayStart={0} />
              </h1>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8, ease: 'easeInOut' }}
                className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mb-4"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="text-[#A8B4C8] text-xs uppercase tracking-[0.5em]"
              >
                Bienvenue dans mon univers
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ÉTAPE 2 : NOM COMPLET AVEC EFFET COURBE */}
        <AnimatePresence>
          {step >= 2 && (
            <div className="flex flex-col items-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-heading text-2xl sm:text-4xl md:text-5xl text-[#00BFFF] tracking-widest mb-3"
              >
                <CurvedText text="STANE-JUNIOR ANIAMBOSSOU" delayStart={0} />
              </motion.h2>
              
              {/* ÉTAPE 3 : SOUS-TITRE */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <p className="text-[#A8B4C8] text-xs sm:text-sm uppercase tracking-[0.4em] font-mono">
                    Développeur · Fondateur · Bénin
                  </p>
                  <div className="flex gap-1.5">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                      className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                      className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full"
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                      className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* BARRE DE PROGRESSION */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#141430] overflow-hidden">
        <motion.div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-[#0A0A1E] via-[#00BFFF] to-[#00BFFF]"
        />
      </div>

      {/* Effet de fond subtil */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00BFFF] rounded-full blur-[150px]" 
        />
      </div>
    </motion.div>
  );
};

export default IntroAnimation;