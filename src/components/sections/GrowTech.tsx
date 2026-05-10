import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import SectionNumber from '../../components/ui/SectionNumber';

interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string;
  initial: string;
  image_url: string;
}

const GrowTech: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { siteConfig } = useSupabaseData();

  // Récupération des données GrowTech depuis site_config
  const growtechData = siteConfig['growtech_data']?.value_generic ? JSON.parse(siteConfig['growtech_data'].value_generic) : null;
  
  const description = isFr ? growtechData?.description_fr : growtechData?.description_en;
  const members: TeamMember[] = growtechData?.members || [];
  const services: string[] = growtechData?.services || [];

  // Données par défaut si vide
  const defaultDesc = isFr 
    ? "GROW TECH est une agence digitale estudiantine. Six personnes. Trois squads. On développe des solutions pour le Bénin et la sous-région."
    : "GROW TECH is a student digital agency. Six people. Three squads. We build solutions for Benin and the sub-region.";
  
  const defaultServices = isFr 
    ? ['Développement Web', 'Applications Mobiles', 'Design UI/UX', 'Consulting']
    : ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Consulting'];

  const displayDesc = description || defaultDesc;
  const displayServices = services.length > 0 ? services : defaultServices;
  const displayMembers = members.length > 0 ? members : [];

  return (
    <section id="growtech" className="py-24 lg:py-32 bg-[#0F0F2E] relative overflow-hidden">
      <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="mb-16 lg:mb-24">
          <div className="relative">
            <SectionNumber number="04" />
            <h2 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">
              GROW TECH
            </h2>
            <p className="text-[#A8B4C8] text-lg mt-4 max-w-lg relative z-10">
              {isFr ? 'Votre vision, notre technologie.' : 'Your vision, our technology.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          <div className="lg:col-span-7 space-y-6">
            <motion.h3 initial={{opacity:0}} whileInView={{opacity:1}} className="text-2xl text-white font-bold">
              {isFr ? 'Une agence née de l\'observation.' : 'An agency born from observation.'}
            </motion.h3>
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:0.1}} className="text-[#A8B4C8] text-lg leading-relaxed">
              {displayDesc}
            </motion.p>
          </div>

          <div className="lg:col-span-5">
            <motion.h4 initial={{opacity:0}} whileInView={{opacity:1}} className="text-white font-bold mb-6 uppercase tracking-widest text-sm">
              {isFr ? 'Nos Services' : 'Our Services'}
            </motion.h4>
            <div className="space-y-3">
              {displayServices.map((service, index) => (
                <motion.div key={service} initial={{opacity:0, x:20}} whileInView={{opacity:1, x:0}} transition={{delay:index*0.05}} className="flex items-center gap-4 p-4 bg-[#141430] border border-[#1A1A2E] rounded-xl hover:border-[#00BFFF] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#00BFFF]" />
                  <span className="text-[#A8B4C8] font-medium">{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {displayMembers.length > 0 && (
          <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} className="mt-16">
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm text-center">
              {isFr ? 'L\'Équipe' : 'The Team'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {displayMembers.map((member, index) => (
                <motion.div key={member.id} initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} transition={{delay:index*0.1}} className="group text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#141430] border border-[#1A1A2E] overflow-hidden flex items-center justify-center group-hover:border-[#00BFFF] transition-all">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-heading text-[#A8B4C8] group-hover:text-[#00BFFF]">{member.initial}</span>
                    )}
                  </div>
                  <h5 className="text-white font-semibold text-sm mb-1 truncate">{member.name}</h5>
                  <p className="text-[#4A5568] text-xs">{isFr ? member.role_fr : member.role_en}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default GrowTech;