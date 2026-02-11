// src/services/testimonialService.ts
import { supabase } from '../lib/supabaseClient';
import type { Testimonial, Review } from '../types';

// Function to map database Testimonial to component Review
function mapTestimonialToReview(testimonial: Testimonial): Review {
  // Generate avatar based on author name if not in DB
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author_name)}&background=0D8ABC&color=fff`;
  
  return {
    id: testimonial.id.toString(),
    name: testimonial.author_name,
    text: testimonial.content,
    rating: testimonial.rating,
    avatar: avatarUrl,
    country: testimonial.author_location || 'Unknown',
    featured: testimonial.is_featured
  };
}

export const testimonialService = {
  // Get featured testimonials for homepage
  async getFeaturedTestimonials(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);
      
    if (error) {
      console.error('Error fetching featured testimonials:', error);
      return [];
    }
    
    return data ? data.map(mapTestimonialToReview) : [];
  },

  // Get all testimonials
  async getAllTestimonials(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
    
    return data ? data.map(mapTestimonialToReview) : [];
  },

  // Get testimonials by tour
  async getTestimonialsByTour(tourId: number): Promise<Review[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('tour_id', tourId)
      .order('rating', { ascending: false });
      
    if (error) {
      console.error('Error fetching testimonials by tour:', error);
      return [];
    }
    
    return data ? data.map(mapTestimonialToReview) : [];
  },

  // Get raw testimonials (database format)
  async getRawTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching raw testimonials:', error);
      return [];
    }
    
    return data || [];
  }
};