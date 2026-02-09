// Tour Categories
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

// Tours
export interface Tour {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  itinerary: string;
  inclusions: string[];
  exclusions: string[];
  duration: string;
  location: string;
  starting_price: number;
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
}

// Tour Images
export interface TourImage {
  id: number;
  tour_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sequence: number;
  created_at: string;
}

// Curated Tour (for homepage)
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
}

// Testimonials
export interface Testimonial {
  id: number;
  author_name: string;
  author_location: string | null;
  rating: number;
  platform: 'tripadvisor' | 'google' | 'instagram';
  content: string;
  tour_id: number | null;
  is_featured: boolean;
  created_at: string;
}

// Company Info
export interface CompanyInfo {
  id: number;
  established_year: number;
  legal_name: string;
  heritage_narrative: string;
  mission_statement: string | null;
  ubud_address: string | null;
  whatsapp_number: string;
  email_address: string;
  instagram_handle: string | null;
  facebook_handle: string | null;
  updated_at: string;
}

// Staff
export interface Staff {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  specialty: string | null;
  whatsapp_number: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
}

// Inquiry
export interface Inquiry {
  tour_id?: number | null;
  package_id?: number | null;
  user_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  message?: string | null;
}