// // src/types/index.ts

// export interface TourCategory {
//   id: number;
//   name: string;
//   slug: string;
//   description: string | null;
//   vibe: string;
//   hero_tagline: string | null;
//   seo_title: string;
//   seo_description: string;
//   status: 'active' | 'inactive';
//   created_at: string;
//   updated_at: string;
// }

// export interface Tour {
//   id: number;
//   category_id: number;
//   title: string;
//   slug: string;
//   short_description: string | null;
//   itinerary: string;
//   inclusions: string[];
//   exclusions: string[];
//   duration: string;
//   location: string;
//   starting_price: number;
//   seo_title: string;
//   seo_description: string;
//   status: 'draft' | 'active' | 'archived';
//   featured: boolean;
//   featured_reason: string | null;
//   activity_level: 'easy' | 'moderate' | 'challenging' | 'hard';
//   mood_tags: string[];
//   max_group_size: number;
//   created_at: string;
//   updated_at: string;
//   category?: TourCategory;
//   images?: TourImage[];
// }

// export interface TourImage {
//   id: number;
//   image_url: string;
//   alt_text: string;
//   is_primary: boolean;
//   sequence: number;
//   created_at: string;
// }

// export interface TourItem {
//   id: number;
//   title: string;
//   slug: string;
//   image: string;
//   price: string;
//   duration: string;
//   category: string;
//   location?: string;
//   overview?: string;
//   description?: string;
//   starting_price?: number;
// }

// export type Adventure = Tour;

// export interface Testimonial {
//   id: number;
//   author_name: string;
//   author_location: string | null;
//   rating: number;
//   platform: string;
//   content: string;
//   tour_id: number | null;
//   is_featured: boolean;
//   created_at: string;
// }

// export interface Review {
//   id: string;
//   name: string;
//   text: string;
//   rating: number;
//   avatar: string;
//   country: string;
//   featured?: boolean;
// }

// export interface GalleryImage {
//   url: string;
//   title: string;
//   alt_text?: string;
// }

// export interface BlogPost {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   featured_image: string;
//   author: string;
//   category: string;
//   published_at: string;
//   status: 'published' | 'draft';
// }

// export interface CompanyInfo {
//   id: number;
//   name: string;
//   description: string;
//   address: string;
//   phone: string;
//   email: string;
//   whatsapp: string;
//   instagram?: string;
//   facebook?: string;
//   twitter?: string;
//   operating_hours?: string;
//   updated_at: string;
// }

// // Legacy/backward compatibility - FIXED: Make sure this is exported
// export type TourCategoryLegacy = 'Combination' | 'Full Day' | 'Half Day';