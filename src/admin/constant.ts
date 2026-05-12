/**
 * Constants centralisées pour animations, layouts et validations
 * Élimine les magic numbers pour une maintenance facile
 */

export const ANIMATION = {
  // Durées (en secondes)
  DURATION_SHORT: 0.2,
  DURATION_MEDIUM: 0.4,
  DURATION_LONG: 0.6,
  DURATION_EXTRA_LONG: 0.8,
  
  // Delays
  DELAY_SHORT: 0.1,
  DELAY_MEDIUM: 0.2,
  DELAY_LONG: 0.3,
  
  // Stagger (décalage entre éléments)
  STAGGER_SHORT: 0.05,
  STAGGER_MEDIUM: 0.1,
  
  // Easings
  EASING_DEFAULT: "easeInOut" as const,
  EASING_OUT: "easeOut" as const,
  EASING_IN: "easeIn" as const,
  EASING_SPRING: { type: "spring" as const, stiffness: 300, damping: 25 },
} as const;

export const LAYOUT = {
  // Gaps
  GAP_SMALL: 'gap-2',
  GAP_MEDIUM: 'gap-4',
  GAP_LARGE: 'gap-6',
  
  // Padding
  PADDING_SMALL: 'p-4',
  PADDING_MEDIUM: 'p-6',
  PADDING_LARGE: 'p-8',
  
  // Max widths
  MAX_WIDTH_FORM: 'max-w-5xl',
  MAX_WIDTH_CARD: 'max-w-3xl',
} as const;

export const TOAST = {
  DURATION_SUCCESS: 4000,
  DURATION_ERROR: 6000,
  DURATION_INFO: 3000,
  DURATION_WARNING: 5000,
} as const;

export const VALIDATION = {
  MIN_LENGTH: {
    TITLE: 2,
    DESCRIPTION: 10,
    NAME: 2,
    MESSAGE: 10,
  },
  MAX_LENGTH: {
    TITLE: 100,
    DESCRIPTION: 1000,
    SLUG: 50,
    MESSAGE: 2000,
  },
} as const;

export const COLORS = {
  STATUS: {
    DELIVERED: { bg: 'bg-green-500/20', text: 'text-green-400' },
    IN_PROGRESS: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    CONCEPT: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    PAUSED: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  },
  TOAST: {
    SUCCESS: 'text-green-400',
    ERROR: 'text-red-400',
    INFO: 'text-blue-400',
    WARNING: 'text-yellow-400',
  },
} as const;

export const STORAGE = {
  BUCKETS: {
    PORTFOLIO_ASSETS: 'portfolio-assets',
  },
  FOLDERS: {
    PROJECTS: 'projects',
    GROWTECH: 'growtech',
    GROWTECH_PROJECTS: 'growtech-projects',
    TEAM: 'team',
    VISION: 'vision',
    BLOG: 'blog',
  },
  MAX_FILE_SIZE_MB: 5,
} as const;