import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface MetaConfig {
  title: string;
  description: string;
}

const getMetaForPath = (pathname: string, lang: 'fr' | 'en'): MetaConfig => {
  const isFr = lang === 'fr';
  if (pathname === '/' || pathname === '') {
    return {
      title: isFr ? "Stane Aniambossou | Ingénierie Logicielle & Systèmes Intelligents" : "Stane Aniambossou | Software Engineering & Intelligent Systems",
      description: isFr ? "Étudiant en Ingénierie Logicielle. Fondateur de GROW TECH. Je construis des systèmes intelligents pour l'Afrique." : "Software Engineering student. Founder of GROW TECH. Building intelligent systems for Africa."
    };
  }
  if (pathname.startsWith('/projects')) {
    return { title: isFr ? "Projets | Stane Aniambossou" : "Projects | Stane Aniambossou", description: isFr ? "Découvrez mes projets réels : applications web, solutions digitales et systèmes intelligents." : "Explore my real projects: web applications, digital solutions and intelligent systems." };
  }
  if (pathname.startsWith('/blog')) {
    return { title: isFr ? "Blog | Stane Aniambossou" : "Blog | Stane Aniambossou", description: isFr ? "Articles et réflexions sur l'ingénierie logicielle, l'IA et le développement en Afrique." : "Articles and thoughts on software engineering, AI and development in Africa." };
  }
  if (pathname.startsWith('/growtech')) {
    return { title: "GROW TECH | Stane Aniambossou", description: isFr ? "L'agence digitale estudiantine que j'ai fondée. Votre Vision, Notre Technologie." : "The student digital agency I co-founded. Your Vision, Our Technology." };
  }
  return {
    title: isFr ? "Stane Aniambossou | Ingénierie Logicielle & Systèmes Intelligents" : "Stane Aniambossou | Software Engineering & Intelligent Systems",
    description: isFr ? "Portfolio professionnel — Ingénierie Logicielle, IA & Systèmes Intelligents." : "Professional portfolio — Software Engineering, AI & Intelligent Systems."
  };
};

const DynamicMeta: React.FC = () => {
  const { lang } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const { title, description } = getMetaForPath(location.pathname, lang);
    document.title = title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.setAttribute('name', 'description'); document.head.appendChild(metaDesc); }
    metaDesc.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]'); if (ogTitle) ogTitle.setAttribute('content', title);
    const twitterTitle = document.querySelector('meta[property="twitter:title"]'); if (twitterTitle) twitterTitle.setAttribute('content', title);
  }, [location.pathname, lang]);
  return null;
};

export default DynamicMeta;
