// src/types/index.ts

// ========================================
// Database Schema Types (matches Supabase)
// ========================================

export interface TourCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  vibe: string;
  hero_tagline: string | null;
  seo_title: string;
  seo_description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface TourImage {
  id: number;
  tour_id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sequence: number;
  created_at: string;
}

export interface Tour {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  overview?: string;
  itinerary: { time: string; activity: string }[];
  inclusions: string[];
  exclusions: string[];
  duration: string;
  location: string;
  starting_price: number;
  price?: string;
  image?: string;
  image_alt?: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  featured_reason: string | null;
  activity_level: 'easy' | 'moderate' | 'challenging' | 'hard';
  mood_tags: string[];
  max_group_size: number;
  created_at: string;
  updated_at: string;
  category?: TourCategory;
  images?: TourImage[];
  rating?: number;
  reviews?: number;
  highlights?: string[];
  hotel_options?: { hotel: string; cost:string } [];
  notes?: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  duration_days: number;
  duration_nights: number;
  overview: string;
  price_estimate: number;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Adventure {
  id: string;
  title: string;
  icon: string;
  image: string;
  activityLevel: 'Easy' | 'Moderate' | 'Hard';
  description: string;
  price: string;
  duration: string;
  highlights: string[];
  itinerary: { time: string; activity: string }[];
  inclusions: string[];
  exclusions: string[];
  category?: string;
}

export type TourCategoryType = 'Combination' | 'Adventure' | 'Full Day' | 'Half Day' | 'Stay + Tour';
// Add this to your types file
export interface BlogImage {
  id: number;
  blog_id: number;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  is_primary: boolean;
  sequence: number;
  created_at: string;
}

// Update your existing BlogPost interface
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  images?: BlogImage[]; // Add this line for multiple images
  category?: string;
  interactivePoints?: InteractivePoint[];
}


export interface Testimonial {
  id: number;
  author_name: string;
  author_location: string | null;
  rating: number;
  platform: string;
  content: string;
  tour_id: number | null;
  is_featured: boolean;
  created_at: string;
  avatar?: string;
}

export interface GalleryImage {
  url: string;
  title: string;
  alt_text?: string;
}

export interface CompanyInfo {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  operating_hours?: string;
  updated_at: string;
}

export interface CuratedTour {
  category_name: string;
  category_slug: string;
  category_vibe: string;
  tour_id: number;
  tour_title: string;
  tour_slug: string;
  tour_short_description: string | null;
  tour_featured_reason: string | null;
  tour_starting_price: number;
  tour_image?: string;
  tour_duration?: string;
  tour_rating?: number;
  tour_reviews?: number;
}

export interface ShowcaseTour {
  id: number;
  title: string;
  image: string;
  price: string;
  duration: string;
  category: string;
  overview?: string;
}

export type TourCategoryLegacy = 'Combination' | 'Full Day' | 'Half Day';