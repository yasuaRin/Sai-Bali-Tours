import { supabase } from '../lib/supabaseClient';
import type { Testimonial } from '../types';

export const testimonialService = {
  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFeaturedTestimonials(limit: number = 6): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  async getTestimonialsByPlatform(platform: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('platform', platform)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};