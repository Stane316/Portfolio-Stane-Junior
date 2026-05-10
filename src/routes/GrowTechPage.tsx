import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionNumber from '../components/ui/SectionNumber';

const GrowTechPage: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: config, error } = await supabase.from('site_config').select('*').eq('key', 'growtech_data').single();
        if (!error && config?.value_generic) setData(JSON.parse(config.value_generic));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00BFFF] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center text-[#A8B4C8]">Données non disponibles</div>;

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container-custom max-w-[1400px] mx-auto px-6 lg:px-12 space-y-32">
          
          {/* Header Agence */}
          <section>
            <div className="relative mb-16">
              <SectionNumber number="AG" />
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-heading text-white tracking-tighter relative z-10">GROW TECH</h1>
              <p className="text-[#A8B4C8] text-xl mt-4 max-w-2xl relative z-10">{isFr ? data.description_fr : data.description_en}</p>
            </div>
            {data.logo_url && <img src={data.logo_url} alt="Logo GROW TECH" className="w-48 h-auto object-contain mb-12" />}
          </section>

          {/* Vision */}
          {data.vision.title_fr && (
            <motion.section initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#141430] border border-[#1A1A2E] rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl font-heading text-white mb-4">{isFr ? data.vision.title_fr : data.vision.title_en}</h2>
              <p className="text-[#A8B4C8] text-lg leading-relaxed">{isFr ? data.vision.content_fr : data.vision.content_en}</p>
            </motion.section>
          )}

          {/* Projets Agence */}
          {data.projects.length > 0 && (
            <section>
              <h2 className="text-4xl font-heading text-white mb-8">{isFr ? 'Nos Réalisations' : 'Our Projects'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.projects.map((proj: any, i: number) => (
                  <motion.div key={proj.id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="bg-[#141430] border border-[#1A1A2E] rounded-2xl overflow-hidden hover:border-[#00BFFF] transition-colors">
                    {proj.image_url && <div className="h-48 overflow-hidden"><img src={proj.image_url} alt={proj.title_fr} className="w-full h-full object-cover" /></div>}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{isFr ? proj.title_fr : proj.title_en}</h3>
                      <p className="text-[#A8B4C8] text-sm">{proj.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Équipe */}
          {data.members.length > 0 && (
            <section>
              <h2 className="text-4xl font-heading text-white mb-8">{isFr ? 'L\'Équipe' : 'The Team'}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.members.map((member: any, i: number) => (
                  <motion.div key={member.id} initial={{opacity:0, scale:0.9}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{delay:i*0.1}} className="group text-center bg-[#141430] border border-[#1A1A2E] rounded-2xl p-6 hover:border-[#00BFFF] transition-all">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#1A1A2E] group-hover:border-[#00BFFF] transition-colors">
                      {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0A0A1E] flex items-center justify-center text-3xl font-heading text-[#00BFFF]">{member.initial}</div>}
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-[#00BFFF] text-sm">{isFr ? member.role_fr : member.role_en}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GrowTechPage;