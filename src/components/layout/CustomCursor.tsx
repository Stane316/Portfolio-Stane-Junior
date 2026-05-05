/**
 * Custom Cursor Component
 * 
 * Desktop-only custom cursor with:
 * - Cyan ring that follows the pointer with lag effect
 * - Expands and fills on hover over interactive elements
 * - Disabled on mobile/touch devices
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      const button = target.closest('button');
      const isInteractive = !!(anchor || button || target.tagName === 'A' || target.tagName === 'BUTTON');
      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', () => setIsVisible(false));

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', () => setIsVisible(false));
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[var(--accent-cyan)] 
                   rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 2 : 1,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--accent-cyan)] rounded-full 
                   pointer-events-none z-[101] mix-blend-difference"
        style={{
          x: smoothMouseX,
          y: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 1.5 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
