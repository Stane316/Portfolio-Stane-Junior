/**
 * Media Utilities — UNIVERSAL MEDIA SYSTEM
 * 
 * Provides helpers to work with image OR video per zone.
 * Uses both site_config (legacy) + media_items (new universal table).
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface MediaItem {
  id: string;
  key: string;
  type: 'image' | 'video';
  url: string | null;
  storage_path: string | null;
  alt_fr: string | null;
  alt_en: string | null;
  section: string;
  active: boolean;
  order_index: number;
}

export interface MediaResult {
  url: string | null;
  type: 'image' | 'video';
  alt?: string;
}

/**
 * Get media for a given key.
 * Priority: media_items table → fallback to site_config value_generic
 */
export const getMedia = async (key: string, fallbackUrl?: string): Promise<MediaResult> => {
  if (!isSupabaseConfigured()) {
    return {
      url: fallbackUrl || null,
      type: fallbackUrl?.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
    };
  }

  try {
    const { data: mediaData } = await supabase
      .from('media_items')
      .select('*')
      .eq('key', key)
      .eq('active', true)
      .single();

    if (mediaData && mediaData.url) {
      return {
        url: mediaData.url,
        type: mediaData.type as 'image' | 'video',
        alt: mediaData.alt_fr || mediaData.alt_en || undefined
      };
    }

    const { data: configData } = await supabase
      .from('site_config')
      .select('value_generic')
      .eq('key', key)
      .single();

    const url = configData?.value_generic || fallbackUrl || null;

    return {
      url,
      type: url?.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
    };
  } catch (error) {
    console.warn(`[media] Failed to fetch media for key "${key}"`, error);
    return {
      url: fallbackUrl || null,
      type: fallbackUrl?.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
    };
  }
};

/**
 * Synchronous version using already-loaded config + media map
 */
export const getMediaFromConfig = (
  key: string, 
  siteConfig: Record<string, any>, 
  mediaItems: MediaItem[] = [],
  fallbackUrl?: string
): MediaResult => {
  const media = mediaItems.find(m => m.key === key && m.active);
  if (media && media.url) {
    return {
      url: media.url,
      type: media.type,
      alt: media.alt_fr || media.alt_en || undefined
    };
  }

  const config = siteConfig[key];
  const url = config?.value_generic || fallbackUrl || null;

  return {
    url,
    type: url?.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image'
  };
};

/**
 * Save or update a media item (used by admin)
 */
export const upsertMediaItem = async (
  key: string,
  url: string,
  type: 'image' | 'video',
  section: string,
  alt_fr?: string,
  alt_en?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase
      .from('media_items')
      .upsert({
        key,
        type,
        url,
        storage_path: url,
        section,
        active: true,
        alt_fr: alt_fr || null,
        alt_en: alt_en || null,
      }, { onConflict: 'key' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[media] upsertMediaItem failed:', err);
    return false;
  }
};

export default { getMedia, getMediaFromConfig, upsertMediaItem };