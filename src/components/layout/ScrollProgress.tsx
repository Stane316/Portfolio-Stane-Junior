import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollProgress — Professional top progress bar
 */
const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) { setProgress(0); return; }
      const percentage = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
      setProgress(percentage);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#141430] z-[60] pointer-events-none" aria-hidden="true">
      <motion.div
        className="h-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.05, ease: 'linear' }}
      />
    </div>
  );
};

export default ScrollProgress;