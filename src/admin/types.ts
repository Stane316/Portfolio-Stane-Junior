/**
 * Types TypeScript stricts pour les données admin
 * Remplace tous les 'any' pour une sécurité de type complète
 */

export interface CaseStudyStep {
  title: string;
  content: string;
}

export interface CaseStudyData {
  step1: CaseStudyStep;
  step2: CaseStudyStep;
  step3: CaseStudyStep;
  step4: CaseStudyStep;
  step5: CaseStudyStep;
}

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
  case_study_fr: CaseStudyData;
  case_study_en: CaseStudyData;
  is_visible: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string;
  initial: string;
  image_url: string;
  order: number;
}

export interface VisionData {
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
}

export interface GrowTechData {
  logo_url: string;
  description_fr: string;
  description_en: string;
  members: TeamMember[];
  projects: Project[];
  vision: VisionData;
}

export interface VisionItem {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  status: 'concept' | 'in_progress' | 'paused';
  image_url: string;
  order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  slug: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  category: string;
  image_url: string;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
}

export interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
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

export interface DashboardData {
  projects: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
  recentMessages: Message[];
  recentProjects: Project[];
}