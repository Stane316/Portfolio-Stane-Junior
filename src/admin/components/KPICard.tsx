import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KPICardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: 'cyan' | 'blue' | 'green' | 'red' | 'yellow';
  delay?: number;
}

const KPICard: React.FC<KPICardProps> = ({ icon, value, label, color, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorMap = {
    cyan: { bg: 'from-[#00BFFF] to-[#0088CC]', text: 'text-[#00BFFF]', border: 'border-[#00BFFF]' },
    blue: { bg: 'from-[#1A6FC4] to-[#0D4A8A]', text: 'text-[#1A6FC4]', border: 'border-[#1A6FC4]' },
    green: { bg: 'from-green-500 to-green-700', text: 'text-green-400', border: 'border-green-500' },
    red: { bg: 'from-red-500 to-red-700', text: 'text-red-400', border: 'border-red-500' },
    yellow: { bg: 'from-yellow-500 to-yellow-700', text: 'text-yellow-400', border: 'border-yellow-500' },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-xl border border-[rgba(0,191,255,0.15)] bg-[#141430] bg-opacity-50 backdrop-blur-sm p-5 group hover:border-[rgba(0,191,255,0.3)] transition-all duration-300"
    >
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.bg} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-3`}>
          <span className="text-white">{icon}</span>
        </div>
        
        {/* Value */}
        <div className={`${colors.text} text-3xl font-display font-bold mb-1`}>
          {count}
        </div>
        
        {/* Label */}
        <p className="text-[#A8B4C8] text-sm">{label}</p>
      </div>
    </motion.div>
  );
};

export default KPICard;