import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onFinish: () => void;
}

// Composant pour animer le texte lettre par lettre
const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onFinish }) => {
  const [step, setStep] = useState<number>(0);

  // Séquence d'animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 300),       // "Welcome" apparaît lettre par lettre
      setTimeout(() => setStep(2), 2500),      // "Welcome" part, Nom apparaît
      setTimeout(() => setStep(3), 3800),      // Sous-titre apparaît
      setTimeout(() => setStep(4), 4800),      // Barre de progression
      setTimeout(() => onFinish(), 5800),      // Fin
    ];

    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-[#0A0A1E] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 text-center flex flex-col items-center justify-center min-h-[300px]">
        
        {/* ÉTAPE 1 : WELCOME */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl text-[#00BFFF] tracking-tight mb-6">
                <AnimatedText text="WELCOME" />
              </h1>
              <div className="flex justify-center gap-2 mb-8">
                <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse delay-150" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ÉTAPE 2 : NOM COMPLET */}
        <AnimatePresence>
          {step >= 2 && (
            <div className="flex flex-col items-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-heading text-3xl sm:text-5xl md:text-6xl text-white tracking-wider mb-4"
              >
                STANE-JUNIOR ANIAMBOSSOU
              </motion.h2>
              
              {/* ÉTAPE 3 : SOUS-TITRE */}
              {step >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-[#A8B4C8] text-xs sm:text-sm uppercase tracking-[0.4em] font-mono"
                >
                  Développeur · Fondateur · Bénin
                </motion.p>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* BARRE DE PROGRESSION */}
      {step >= 4 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#141430] overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full bg-[#00BFFF]"
          />
        </div>
      )}

      {/* Effet de fond subtil */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00BFFF] rounded-full blur-[120px]" />
      </div>
    </motion.div>
  );
};

export default IntroAnimation;