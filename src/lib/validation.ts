/**
 * Validation utilitaire pour les formulaires admin
 * Validation côté client avant envoi à Supabase
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProject = (data: {
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  live_url?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.title_fr.trim()) errors.title_fr = 'Le titre (FR) est requis';
  else if (data.title_fr.length < 2) errors.title_fr = 'Le titre doit contenir au moins 2 caractères';
  
  if (!data.title_en.trim()) errors.title_en = 'Le titre (EN) est requis';
  else if (data.title_en.length < 2) errors.title_en = 'Le titre doit contenir au moins 2 caractères';

  if (!data.description_fr.trim()) errors.description_fr = 'La description (FR) est requise';
  else if (data.description_fr.length < 10) errors.description_fr = 'La description doit contenir au moins 10 caractères';

  if (!data.description_en.trim()) errors.description_en = 'La description (EN) est requise';
  else if (data.description_en.length < 10) errors.description_en = 'La description doit contenir au moins 10 caractères';

  if (data.live_url && data.live_url.trim()) {
    try {
      new URL(data.live_url);
    } catch {
      errors.live_url = 'L\'URL n\'est pas valide';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTestimonial = (data: {
  person_name: string;
  person_role: string;
  content_fr: string;
  content_en: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.person_name.trim()) errors.person_name = 'Le nom est requis';
  else if (data.person_name.length < 2) errors.person_name = 'Le nom doit contenir au moins 2 caractères';

  if (!data.person_role.trim()) errors.person_role = 'Le rôle est requis';

  if (!data.content_fr.trim()) errors.content_fr = 'Le contenu (FR) est requis';
  else if (data.content_fr.length < 10) errors.content_fr = 'Le contenu doit contenir au moins 10 caractères';

  if (!data.content_en.trim()) errors.content_en = 'Le contenu (EN) est requis';
  else if (data.content_en.length < 10) errors.content_en = 'Le contenu doit contenir au moins 10 caractères';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateMessage = (data: {
  full_name: string;
  email: string;
  message: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.full_name.trim()) errors.full_name = 'Le nom est requis';
  else if (data.full_name.length < 2) errors.full_name = 'Le nom doit contenir au moins 2 caractères';

  if (!data.email.trim()) errors.email = 'L\'email est requis';
  else if (!validateEmail(data.email)) errors.email = 'L\'email n\'est pas valide';

  if (!data.message.trim()) errors.message = 'Le message est requis';
  else if (data.message.length < 10) errors.message = 'Le message doit contenir au moins 10 caractères';
  else if (data.message.length > 2000) errors.message = 'Le message ne doit pas dépasser 2000 caractères';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};