import { supabase } from '../lib/supabaseClient';

import type {
  Tour,
  TourCategory,
  CuratedTour,
  TourImage
} from '../types/index';

export const tourService = {
  async getCuratedTours(): Promise<CuratedTour[]> {
    const { data, error } = await supabase.rpc('get_curated_tours');
    if (error) throw error;
    return data || [];
  },

  async getCategories(): Promise<TourCategory[]> {
    const { data, error } = await supabase
      .from('tour_categories')
      .select('id, name, slug, description, vibe, hero_tagline, seo_title, seo_description, status, created_at, updated_at')
      .eq('status', 'active')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getCategoryBySlug(slug: string): Promise<TourCategory & { tours: Tour[] }> {
    const {  category, error: catError } = await supabase
      .from('tour_categories')
      .select('id, name, slug, description, vibe, hero_image_url, hero_tagline, seo_title, seo_description, status, created_at, updated_at')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (catError) throw catError;

    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('id, slug, title, short_description, duration, location, starting_price, activity_level, featured, status, created_at, updated_at')
      .eq('category_id', category.id)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (toursError) throw toursError;

    return { ...category, tours };
  },

  async getTourBySlug(slug: string): Promise<Tour> {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        id,
        slug,
        title,
        short_description,
        itinerary,
        inclusions,
        exclusions,
        duration,
        location,
        starting_price,
        activity_level,
        max_group_size,
        featured_reason,
        mood_tags,
        status,
        created_at,
        updated_at,
        category:tour_categories!inner (id, name, slug),
        images:tour_images (id, image_url, alt_text, is_primary, sequence, created_at)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error) throw error;
    
    if (data.images) {
      data.images.sort((a: TourImage, b: TourImage) => a.sequence - b.sequence);
    }
    
    return data;
  },

  async filterTours(filters: {
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    activityLevel?: 'easy' | 'moderate' | 'challenging' | 'hard';
  }): Promise<Tour[]> {
    let query = supabase
      .from('tours')
      .select(`
        id,
        slug,
        title,
        short_description,
        duration,
        location,
        starting_price,
        activity_level,
        featured,
        status,
        created_at,
        updated_at,
        category:tour_categories!inner (name, vibe)
      `)
      .eq('status', 'active');

    if (filters.categorySlug) {
      query = query.eq('category.slug', filters.categorySlug);
    }
    if (filters.minPrice) {
      query = query.gte('starting_price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('starting_price', filters.maxPrice);
    }
    if (filters.activityLevel) {
      query = query.eq('activity_level', filters.activityLevel);
    }

    const { data, error } = await query.order('featured', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getTourByMood(mood: string): Promise<Tour | null> {
    const { data, error } = await supabase
      .from('tours')
      .select('id, slug, title, short_description, starting_price, mood_tags, status, created_at, updated_at')
      .eq('status', 'active')
      .contains('mood_tags', [mood])
      .order('featured', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  }
};