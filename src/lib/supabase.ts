/**
 * Supabase client configuration
 * 
 * This file initializes the Supabase client using environment variables.
 * The Supabase URL and Anon Key must be set in the .env file or Netlify environment variables.
 * 
 * @see https://supabase.com/docs/reference/javascript/introduction
 */

import { createClient } from '@supabase/supabase-js';

// @ts-ignore - Vite injects these at build time
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// @ts-ignore - Vite injects these at build time
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Supabase client instance
 * Used for all database operations throughout the application
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Helper function to check if Supabase is properly configured
 * Returns false if using placeholder values (useful for development without .env)
 */
export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-anon-key';
};
