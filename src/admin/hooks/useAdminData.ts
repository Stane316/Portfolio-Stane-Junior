/**
 * Hook personnalisé pour centraliser la logique de fetch/save/delete
 * Réduit la duplication de code dans tous les composants admin
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface UseAdminDataOptions<T> {
  table: string;
  orderBy?: string;
  orderAsc?: boolean;
  filter?: { column: string; value: any };
  selectAll?: boolean; // Pour les tables comme site_config où on veut tout récupérer
}

interface UseAdminDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  saveItem: (item: Partial<T>, id?: string) => Promise<{ success: boolean; error?: string }>;
  deleteItem: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAdminData<T>({ 
  table, 
  orderBy = 'created_at', 
  orderAsc = false,
  filter,
  selectAll = false
}: UseAdminDataOptions<T>): UseAdminDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from(table).select('*');
      
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }
      
      if (!selectAll) {
        query = query.order(orderBy, { ascending: orderAsc });
      }
      
      const { data: result, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      setData((result as T[]) || []);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
      console.error(`Erreur fetch ${table}:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, orderBy, orderAsc, filter, selectAll]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveItem = async (item: Partial<T>, id?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (id) {
        const { error } = await supabase.from(table).update(item).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([item]);
        if (error) throw error;
      }
      await fetchData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { data, loading, error, fetchData, saveItem, deleteItem };
}