import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
        setProjects([]);
        setTestimonials([]);
        setSiteConfig({});
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

      // Stocker directement les données brutes sans transformation
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
      setSiteConfig(configMap);

    } catch (err: any) {
      console.error('Error fetching data from Supabase:', err);
      setError(err.message || 'Failed to load data');
      setProjects([]);
      setTestimonials([]);
      setSiteConfig({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { projects, testimonials, siteConfig, loading, error, refresh: fetchData };
};