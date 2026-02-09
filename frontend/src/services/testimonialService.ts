import { supabase } from '../lib/supabaseClient';
import type { Testimonial } from '../types';

export const testimonialService = {
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, author_name, author_location, rating, platform, content, tour_id, is_featured, created_at')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  }
};