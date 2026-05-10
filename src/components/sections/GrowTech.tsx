import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const GrowTech: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <section id="growtech" className="py-24 bg-[#0F0F2E]">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#141430] border border-[#1A1A2E] rounded-3xl p-8 lg:p-16 overflow-hidden group hover:border-[#00BFFF] transition-colors duration-500"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFFF] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-5xl lg:text-7xl font-heading text-white tracking-tight mb-4">GROW TECH</h2>
              <p className="text-[#A8B4C8] text-lg max-w-xl mb-8">
                {isFr ? 'Votre vision, notre technologie. Découvrez l\'agence qui innove pour l\'Afrique.' : 'Your vision, our technology. Discover the agency innovating for Africa.'}
              </p>
              <Link to="/growtech" className="inline-flex items-center gap-3 px-8 py-4 bg-[#00BFFF] text-black font-bold rounded-full hover:bg-opacity-90 transition-all hover:scale-105">
                {isFr ? 'Découvrir l\'agence' : 'Discover the agency'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="text-9xl font-heading text-white opacity-10 select-none">GT</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GrowTech;