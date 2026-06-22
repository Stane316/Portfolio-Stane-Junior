import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const GrowTechIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A1E] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl md:text-7xl font-heading text-white tracking-tighter mb-3">GROW TECH</div>
        <div className="text-[#00BFFF] text-sm tracking-[4px] uppercase">Votre Vision • Notre Technologie</div>
      </div>
    </div>
  );
};

const GrowTechPage: React.FC = () => {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: config } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', 'growtech_data')
          .single();

        if (config?.value_generic) {
          setData(JSON.parse(config.value_generic));
        } else {
          setData({
            logo_url: '',
            description_fr: "GROW TECH est une agence digitale estudiantine co-fondée avec Godo Landron. Six personnes. Trois squads : Front-End, Back-End, Commercial.",
            description_en: "GROW TECH is a student digital agency co-founded with Godo Landron. Six people. Three squads: Front-End, Back-End, Commercial.",
            members: [],
            projects: [],
            vision: {
              title_fr: "Notre Vision",
              title_en: "Our Vision",
              content_fr: "Accélérer la transformation digitale des entreprises africaines.",
              content_en: "Accelerating digital transformation for African businesses."
            }
          });
        }
      } catch (e) {
        setData({
          description_fr: "GROW TECH est une agence digitale estudiantine.",
          description_en: "GROW TECH is a student digital agency.",
          members: [],
          projects: [],
          vision: { title_fr: 'Notre Vision', title_en: 'Our Vision', content_fr: '', content_en: '' }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleIntroComplete = () => setShowIntro(false);

  if (loading) {
    return <div className="min-h-screen bg-[#0A0A1E] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00BFFF] animate-spin rounded-full" /></div>;
  }

  const safeData = data || {};
  const members = Array.isArray(safeData.members) ? safeData.members : [];
  const projects = Array.isArray(safeData.projects) ? safeData.projects : [];
  const description = isFr ? safeData.description_fr : safeData.description_en;
  const vision = safeData.vision || { title_fr: '', title_en: '', content_fr: '', content_en: '' };

  return (
    <div className="min-h-screen bg-[#0A0A1E]">
      <AnimatePresence>
        {showIntro && <GrowTechIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <motion.div className={`transition-opacity duration-700 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <Navbar />

        <main className="pt-20">
          <div className="container-custom max-w-[1280px] mx-auto px-6 space-y-24 pb-20">

            {/* HERO */}
            <section className="pt-16 text-center">
              <h1 className="text-6xl sm:text-7xl lg:text-[92px] font-heading tracking-tighter mb-6">GROW TECH</h1>
              <p className="max-w-2xl mx-auto text-xl text-[#A8B4C8]">
                {description || (isFr ? "Votre vision, notre technologie." : "Your vision, our technology.")}
              </p>
            </section>

            {/* VISION */}
            {(vision.title_fr || vision.title_en) && (
              <section className="max-w-3xl mx-auto">
                <div className="bg-[#141430] border-l-4 border-[#00BFFF] p-8 rounded-r-2xl">
                  <h3 className="text-2xl font-semibold mb-3 text-white">{isFr ? vision.title_fr : vision.title_en}</h3>
                  <p className="text-[#A8B4C8] text-lg">{isFr ? vision.content_fr : vision.content_en}</p>
                </div>
              </section>
            )}

            {/* SERVICES */}
            <section>
              <h2 className="text-4xl font-heading text-center mb-12">Nos Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: isFr ? 'Sites vitrines professionnels' : 'Professional Websites' },
                  { title: isFr ? 'Applications web sur mesure' : 'Custom Web Apps' },
                  { title: isFr ? 'Intégration IA & Automatisation' : 'AI & Automation' },
                  { title: isFr ? 'Solutions SaaS' : 'SaaS Solutions' },
                  { title: isFr ? 'Accompagnement PME' : 'SME Support' },
                ].map((s, i) => (
                  <div key={i} className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-8 hover:border-[#00BFFF] transition-colors">
                    <div className="text-[#00BFFF] text-3xl mb-4">•</div>
                    <div className="text-xl font-semibold">{s.title}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJETS */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-4xl font-heading text-center mb-10">Projets Récents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 6).map((proj: any, idx: number) => (
                    <div key={idx} className="bg-[#141430] border border-[#1A1A2E] rounded-2xl overflow-hidden">
                      {proj.image_url && <img src={proj.image_url} alt="" className="w-full h-48 object-cover" />}
                      <div className="p-6">
                        <h3 className="font-semibold mb-2">{isFr ? proj.title_fr : proj.title_en}</h3>
                        <p className="text-sm text-[#A8B4C8] line-clamp-2">{proj.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ÉQUIPE */}
            {members.length > 0 && (
              <section>
                <h2 className="text-4xl font-heading text-center mb-10">L'Équipe</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {members.map((member: any, i: number) => (
                    <div key={i} className="bg-[#141430] border border-[#1A1A2E] rounded-2xl p-6 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#1A1A2E]">
                        {member.image_url ? (
                          <img src={member.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-[#0A0A1E] text-[#00BFFF]">{member.initial}</div>
                        )}
                      </div>
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-[#00BFFF]">{isFr ? member.role_fr : member.role_en}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </main>
        <Footer />
      </motion.div>
    </div>
  );
};

export default GrowTechPage;