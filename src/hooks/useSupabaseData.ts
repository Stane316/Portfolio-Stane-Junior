/**
 * Custom Hook: useSupabaseData
 */

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const FALLBACK_STATS = {
  hero_stat_1: { value_generic: '5+', value_fr: 'Projets livrés', value_en: 'Delivered projects' },
  hero_stat_2: { value_generic: '6', value_fr: 'Membres GROW TECH', value_en: 'GROW TECH members' },
  hero_stat_3: { value_generic: '2', value_fr: 'Co-fondateurs', value_en: 'Co-founders' },
};

const FALLBACK_BADGE = { value_generic: '', value_fr: 'Disponible pour missions freelance', value_en: 'Available for freelance missions' };
const FALLBACK_TAGLINE = { value_generic: '', value_fr: "Je ne construis pas juste des sites web. Je code des solutions à des problèmes que j'ai observés, vécus, compris.", value_en: "I don't just build websites. I code solutions to problems I've observed, lived, and understood." };

const FALLBACK_PROJECTS = [
  {
    id: '1',
    title_fr: 'Maquis Digital',
    title_en: 'Maquis Digital',
    status: 'delivered' as const,
    description_fr: "Menu digital interactif pour restaurants et maquis. Le client scanne un QR code depuis son téléphone, consulte le menu et passe sa commande directement — sans attendre le serveur. La commande est transmise via WhatsApp.",
    description_en: "Interactive digital menu for restaurants. The customer scans a QR code from their phone, browses the menu and places their order directly — no need to wait for a waiter. The order is sent via WhatsApp.",
    stack: ['HTML', 'CSS', 'JavaScript', 'QR Code API'],
    live_url: 'https://maquis-digital.netlify.app/',
    image_url: '',
    case_study_fr: {
      step1: { title: 'PROBLÈME', content: "Dans les maquis et restaurants béninois, le client attend souvent plusieurs minutes juste pour qu'un serveur prenne sa commande. Aux heures de pointe, c'est une expérience frustrante qui fait perdre des clients et du chiffre." },
      step2: { title: 'SOLUTION', content: "Un menu digital accessible via QR code depuis n'importe quel smartphone. Aucune application à installer. Le client choisit, le serveur reçoit." },
      step3: { title: 'FONCTIONNALITÉS', content: "- Menu catégorisé avec photos et prix en FCFA\n- Sélection de quantité par article\n- Récapitulatif de commande avant envoi\n- Envoi de la commande formatée via WhatsApp Business" },
      step4: { title: 'OBSTACLE', content: "Le défi principal était de trouver un canal de transmission de commande accessible aux restaurateurs béninois sans infrastructure complexe. WhatsApp s'est imposé comme la solution évidente." },
      step5: { title: 'RÉSULTAT', content: "Projet livré et fonctionnel. Un restaurant a utilisé le prototype. Preuve qu'un problème local simple peut être résolu avec une technologie légère et adaptée au contexte." },
    },
    case_study_en: {
      step1: { title: 'PROBLEM', content: "In Beninese maquis and restaurants, customers often wait several minutes just for a waiter to take their order." },
      step2: { title: 'SOLUTION', content: "A digital menu accessible via QR code from any smartphone." },
      step3: { title: 'FEATURES', content: "- Categorized menu with photos and prices in FCFA\n- Quantity selection per item\n- Order summary before sending\n- Formatted order sent via WhatsApp Business" },
      step4: { title: 'OBSTACLE', content: "The main challenge was finding an order transmission channel accessible to Beninese restaurateurs without complex infrastructure." },
      step5: { title: 'RESULT', content: "Project delivered and functional. A restaurant used the prototype." },
    },
    display_order: 1,
    is_visible: true,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title_fr: 'CRM Léger',
    title_en: 'Lightweight CRM',
    status: 'in_progress' as const,
    description_fr: "CRM minimaliste pour indépendants et agences. Centralise les informations clients, le suivi des prospects, les revenus et les statistiques en un seul endroit. Conçu pour GROW TECH, ouvert à tous.",
    description_en: "Lightweight CRM for freelancers and agencies. Centralizes client information, prospect tracking, revenue, and statistics in one place.",
    stack: ['React', 'Supabase', 'TailwindCSS'],
    live_url: 'https://crm-leger.netlify.app/',
    image_url: '',
    case_study_fr: {
      step1: { title: 'PROBLÈME', content: "En gérant les prospects de GROW TECH, j'ai réalisé qu'aucun outil CRM existant n'est réellement adapté aux petites agences africaines." },
      step2: { title: 'SOLUTION', content: "Un CRM léger, en français, gratuit, déployé sur le web." },
      step3: { title: 'FONCTIONNALITÉS', content: "- Gestion des contacts clients et prospects\n- Statut des prospects\n- Suivi des revenus par client\n- Tableau de bord avec statistiques" },
      step4: { title: 'OBSTACLE', content: "Trouver la bonne balance entre simplicité et fonctionnalité." },
      step5: { title: 'RÉSULTAT', content: "Projet en production, utilisé activement pour le suivi commercial de GROW TECH." },
    },
    case_study_en: {
      step1: { title: 'PROBLEM', content: "No existing CRM tool is really suited for small African agencies." },
      step2: { title: 'SOLUTION', content: "A lightweight CRM, in French, free, deployed on the web." },
      step3: { title: 'FEATURES', content: "- Client management\n- Prospect status tracking\n- Revenue tracking\n- Statistics dashboard" },
      step4: { title: 'OBSTACLE', content: "Finding the right balance between simplicity and functionality." },
      step5: { title: 'RESULT', content: "Project in production, actively used for GROW TECH sales follow-up." },
    },
    display_order: 2,
    is_visible: true,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title_fr: 'Capsule',
    title_en: 'Capsule',
    status: 'delivered' as const,
    description_fr: "Plateforme collaborative de partage de souvenirs pour créer une surprise d'anniversaire collective. Les proches déposent des messages et photos, tout se révèle le jour J.",
    description_en: "Collaborative platform for sharing memories to create a collective birthday surprise.",
    stack: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
    live_url: 'https://capsule-anniversaire.netlify.app/',
    image_url: '',
    case_study_fr: {
      step1: { title: 'PROBLÈME', content: "Faire quelque chose d'unique pour quelqu'un qu'on aime. Pas un cadeau acheté : une expérience créée." },
      step2: { title: 'SOLUTION', content: "Une plateforme où les proches peuvent déposer un message, une photo, un souvenir — tout se révèle le jour J." },
      step3: { title: 'FONCTIONNALITÉS', content: "- Formulaire de dépôt de messages et photos\n- Compte à rebours dynamique\n- Page secrète de révélation\n- Stockage via Supabase" },
      step4: { title: 'OBSTACLE', content: "La gestion de la confidentialité : les messages ne doivent pas être visibles avant la date." },
      step5: { title: 'RÉSULTAT', content: "Projet livré et utilisé. La surprise a fonctionné." },
    },
    case_study_en: {
      step1: { title: 'PROBLEM', content: "Do something unique for someone you love. Not a bought gift: a created experience." },
      step2: { title: 'SOLUTION', content: "A platform where loved ones can leave messages and photos — revealed on the big day." },
      step3: { title: 'FEATURES', content: "- Message submission form\n- Dynamic countdown\n- Secret revelation page\n- Supabase storage" },
      step4: { title: 'OBSTACLE', content: "Managing privacy: messages must not be visible before the date." },
      step5: { title: 'RESULT', content: "Project delivered and used. The surprise worked." },
    },
    display_order: 3,
    is_visible: true,
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

const FALLBACK_TESTIMONIALS: any[] = [];

export interface Project {
  id: string;
  title_fr: string;
  title_en: string;
  status: 'delivered' | 'in_progress' | 'concept';
  description_fr: string;
  description_en: string;
  stack: string[];
  live_url: string;
  image_url: string;
  case_study_fr: any;
  case_study_en: any;
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  person_name: string;
  person_role: string;
  company: string;
  content_fr: string;
  content_en: string;
  photo_url: string;
  video_url: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
}

export interface SiteConfig {
  [key: string]: { value_fr: string; value_en: string; value_generic: string; };
}

interface UseSupabaseDataReturn {
  projects: Project[];
  testimonials: Testimonial[];
  siteConfig: SiteConfig;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useSupabaseData = (): UseSupabaseDataReturn => {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    hero_stat_1: FALLBACK_STATS.hero_stat_1,
    hero_stat_2: FALLBACK_STATS.hero_stat_2,
    hero_stat_3: FALLBACK_STATS.hero_stat_3,
    hero_badge: FALLBACK_BADGE,
    hero_tagline: FALLBACK_TAGLINE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      
      const [projectsRes, testimonialsRes, configRes] = await Promise.all([
        supabase.from('projects').select('*').eq('is_visible', true).order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').eq('is_visible', true).order('display_order', { ascending: true }),
        supabase.from('site_config').select('*'),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (testimonialsRes.error) throw testimonialsRes.error;
      if (configRes.error) throw configRes.error;

      if (projectsRes.data && projectsRes.data.length > 0) setProjects(projectsRes.data);
      if (testimonialsRes.data && testimonialsRes.data.length > 0) setTestimonials(testimonialsRes.data);
      
      const configMap = (configRes.data || []).reduce((acc, item) => {
        acc[item.key] = { value_fr: item.value_fr || '', value_en: item.value_en || '', value_generic: item.value_generic || '' };
        return acc;
      }, {} as SiteConfig);
      
      if (!configMap.hero_stat_1) configMap.hero_stat_1 = FALLBACK_STATS.hero_stat_1;
      if (!configMap.hero_stat_2) configMap.hero_stat_2 = FALLBACK_STATS.hero_stat_2;
      if (!configMap.hero_stat_3) configMap.hero_stat_3 = FALLBACK_STATS.hero_stat_3;
      if (!configMap.hero_badge) configMap.hero_badge = FALLBACK_BADGE;
      if (!configMap.hero_tagline) configMap.hero_tagline = FALLBACK_TAGLINE;
      
      setSiteConfig(configMap);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return { projects, testimonials, siteConfig, loading, error, refresh: fetchData };
};
