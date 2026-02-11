import { supabase } from '../lib/supabaseClient';
import type { Tour, TourCategory } from '../types';

export const tourService = {
  async getCuratedTours() {
    const { data, error } = await supabase.rpc('get_curated_tours');
    if (error) throw error;
    return data || [];
  },

  async getTourBySlug(slug: string) {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories!inner (name, slug)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error) throw error;
    return data;
  }
};