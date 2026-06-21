import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// EVOLUTION 2026: FALLBACKS mis à jour pour refléter le positionnement
// AI Systems Engineering — comme PROLONGEMENT, pas pivot
const FALLBACK_STATS = {
  hero_stat_1: { value_generic: '5+', value_fr: 'Projets construits', value_en: 'Projects Built' },
  hero_stat_2: { value_generic: '3+', value_fr: 'Concepts IA & Systèmes intelligents', value_en: 'AI & Intelligent Concepts' },
  hero_stat_3: { value_generic: '1', value_fr: 'Agence fondée', value_en: 'Agency Founded' },
};

const FALLBACK_BADGE = {
  value_generic: '',
  value_fr: 'Building Intelligent Systems for Africa',
  value_en: 'Building Intelligent Systems for Africa',
};

const FALLBACK_TAGLINE = {
  value_generic: '',
  value_fr: "Je ne construis pas juste des sites web. Je code des solutions à des problèmes que j'ai observés, vécus, compris.",
  value_en: "I don't just build websites. I code solutions to problems I've observed, lived, and understood.",
};

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
  [key: string]: { value_fr: string; value_en: string; value_generic: string };
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      if (!isSupabaseConfigured()) {
        // FALLBACKS : retourner les données par défaut (EVOLUTION 2026)
        setProjects([]);
        setTestimonials([]);
        setSiteConfig({
          hero_stat_1: FALLBACK_STATS.hero_stat_1,
          hero_stat_2: FALLBACK_STATS.hero_stat_2,
          hero_stat_3: FALLBACK_STATS.hero_stat_3,
          hero_badge: FALLBACK_BADGE,
          hero_tagline: FALLBACK_TAGLINE,
        });
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

      setProjects((projectsRes.data as Project[]) || []);
      setTestimonials((testimonialsRes.data as Testimonial[]) || []);
      
      const configMap = (configRes.data || []).reduce((acc: SiteConfig, item: any) => {
        acc[item.key] = {
          value_fr: item.value_fr || '',
          value_en: item.value_en || '',
          value_generic: item.value_generic || '',
        };
        return acc;
      }, {} as SiteConfig);

      // Merge avec les fallbacks pour les stats si absentes de la DB
      if (!configMap.hero_stat_1) configMap.hero_stat_1 = FALLBACK_STATS.hero_stat_1;
      if (!configMap.hero_stat_2) configMap.hero_stat_2 = FALLBACK_STATS.hero_stat_2;
      if (!configMap.hero_stat_3) configMap.hero_stat_3 = FALLBACK_STATS.hero_stat_3;
      if (!configMap.hero_badge) configMap.hero_badge = FALLBACK_BADGE;
      if (!configMap.hero_tagline) configMap.hero_tagline = FALLBACK_TAGLINE;

      setSiteConfig(configMap);

    } catch (err: any) {
      console.error('Error fetching data from Supabase:', err);
      setError(err.message || 'Failed to load data');
      // En cas d'erreur, utiliser les fallbacks (EVOLUTION 2026)
      setProjects([]);
      setTestimonials([]);
      setSiteConfig({
        hero_stat_1: FALLBACK_STATS.hero_stat_1,
        hero_stat_2: FALLBACK_STATS.hero_stat_2,
        hero_stat_3: FALLBACK_STATS.hero_stat_3,
        hero_badge: FALLBACK_BADGE,
        hero_tagline: FALLBACK_TAGLINE,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { projects, testimonials, siteConfig, loading, error, refresh: fetchData };
};
