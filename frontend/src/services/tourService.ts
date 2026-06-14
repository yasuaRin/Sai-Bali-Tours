import { supabase } from '../lib/supabaseClient';

const BUCKET_URL = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/';

const getTourImageUrl = (tourId: number, imageUrl?: string | null): string => {
  if (imageUrl) return imageUrl;
  return `${BUCKET_URL}/tours/${tourId}.jpg`;
};

// ─── Shared tour mapper — single source of truth ───────────────────────────
const mapTour = (item: any): Tour => ({
  id: Number(item.id),
  title: String(item.title || ''),
  slug: String(item.slug || ''),
  category: item.category ?? null,
  image: getTourImageUrl(item.id, item.image_url),
  image_alt: item.image_alt || String(item.title || ''),
  price: `From $${item.starting_price || 0}`,
  minPerson: Number(item.min_person || 1),
  duration: String(item.duration || 'Full Day'),
  overview: String(item.short_description || item.overview || ''),
  highlights: Array.isArray(item.highlights) ? item.highlights : [],
  itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
  inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
  exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
  featured: item.featured || false,
  featured_reason: item.featured_reason ?? null,
  rating: item.rating || 4.9,
  reviews: item.reviews || 0,
  starting_price: item.starting_price,
  short_description: item.short_description,
  location: item.location,
  category_id: item.category_id,
  seo_title: item.seo_title || '',
  seo_description: item.seo_description || '',
  status: item.status || 'active',
  activity_level: item.activity_level || 'moderate',
  mood_tags: item.mood_tags || [],
  max_group_size: item.max_group_size || 8,
  created_at: item.created_at,
  updated_at: item.updated_at,
  images: [],
  hotel_options: item.hotel_options || null,
  notes: item.notes || null,
});

// ─── Shared category select fragment ───────────────────────────────────────
const CATEGORY_SELECT = `*, category:tour_categories (id, name, slug, vibe)`;

// ─── Interfaces ────────────────────────────────────────────────────────────
export interface Tour {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  overview?: string;
  itinerary: any;
  inclusions: string[];
  exclusions: string[];
  duration: string;
  location: string;
  starting_price: number;
  price?: string;
  minPerson: number;
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
  category?: any;
  images?: any[];
  rating?: number;
  reviews?: number;
  highlights?: string[];
  hotel_options?: { hotel: string; cost: string }[] | null;
  notes?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  vibe?: string;
  hero_tagline?: string;
  hero_image_url?: string | null;
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
  image?: string;
  price?: string;
  nights?: number;
  summary?: string[];
  hotelCategory?: string;
  tours?: string[];
}

// ─── Categories ────────────────────────────────────────────────────────────
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('tour_categories')
      .select('id, name, slug, description, vibe, hero_tagline, hero_image_url')
      .eq('status', 'active')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('tour_categories')
      .select('id, name, slug, description, vibe, hero_tagline, hero_image_url')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
};

// ─── Tours ─────────────────────────────────────────────────────────────────
export const getTours = async (): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTour);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

export const getToursByCategory = async (categorySlug: string): Promise<Tour[]> => {
  try {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];

    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('category_id', category.id)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapTour);
  } catch (error) {
    console.error('Error fetching tours by category:', error);
    return [];
  }
};

export const getTourById = async (id: string): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    if (!data) return null;
    return mapTour(data);
  } catch (error) {
    console.error('Error fetching tour by id:', error);
    return null;
  }
};

export const getTourBySlug = async (slug: string): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return mapTour(data);
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
};

export const getSignatureTours = async (limit: number = 4): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(mapTour);
  } catch (error) {
    console.error('Error fetching signature tours:', error);
    return [];
  }
};

export const getFeaturedTourPerCategory = async (): Promise<Tour[]> => {
  try {
    const categories = await getCategories();
    const results = await Promise.all(
      categories.map(async (cat) => {
        const { data } = await supabase
          .from('tours')
          .select(CATEGORY_SELECT)
          .eq('status', 'active')
          .eq('category_id', cat.id)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        return data ? mapTour(data) : null;
      })
    );
    return results.filter(Boolean) as Tour[];
  } catch (error) {
    console.error('Error fetching featured tour per category:', error);
    return [];
  }
};

export const getPopularTours = async (limit: number = 3): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if ((data || []).length >= limit) {
      return (data || []).map(mapTour);
    }

    const remaining = limit - (data?.length || 0);
    const { data: recentData, error: recentError } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('featured', false)
      .order('created_at', { ascending: false })
      .limit(remaining);

    if (recentError) throw recentError;
    return [...(data || []), ...(recentData || [])].map(mapTour);
  } catch (error) {
    console.error('Error fetching popular tours:', error);
    return [];
  }
};

export const getTopTourByCategory = async (categorySlug: string): Promise<Tour | null> => {
  try {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return null;

    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('category_id', category.id)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ? mapTour(data) : null;
  } catch (error) {
    console.error('Error fetching top tour by category:', error);
    return null;
  }
};

// ─── Adventures ────────────────────────────────────────────────────────────
export const getAdventures = async (): Promise<Adventure[]> => {
  try {
    const category = await getCategoryBySlug('adventures');
    if (!category) return [];

    const { data, error } = await supabase
      .from('tours')
      .select(CATEGORY_SELECT)
      .eq('status', 'active')
      .eq('category_id', category.id)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => {
      let activityLevel: 'Easy' | 'Moderate' | 'Hard' = 'Moderate';
      const level = String(item.activity_level || '').toLowerCase();
      if (level.includes('easy')) activityLevel = 'Easy';
      else if (level.includes('hard') || level.includes('challenging')) activityLevel = 'Hard';

      return {
        id: String(item.id),
        title: String(item.title || ''),
        category: item.category?.name || 'Adventure',
        icon: 'Zap',
        image: getTourImageUrl(item.id, item.image_url),
        activityLevel,
        description: String(item.short_description || item.overview || ''),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
      };
    });
  } catch (error) {
    console.error('Error fetching adventures:', error);
    return [];
  }
};

// ─── Packages ──────────────────────────────────────────────────────────────
export const getPackages = async (): Promise<Package[]> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: String(item.id),
      title: String(item.title || ''),
      slug: String(item.slug || ''),
      duration_days: item.duration_days || 3,
      duration_nights: item.duration_nights || 2,
      overview: String(item.overview || ''),
      price_estimate: item.price_estimate || 0,
      seo_title: String(item.seo_title || ''),
      seo_description: String(item.seo_description || ''),
      status: item.status || 'active',
      created_at: item.created_at,
      updated_at: item.updated_at,
      image: item.image_url || `${BUCKET_URL}/packages/${item.id}.jpg`,
      price: `$${item.price_estimate || 499}`,
      nights: item.duration_nights || 2,
      summary: Array.isArray(item.summary) ? item.summary : [],
      hotelCategory: item.hotel_category || 'Luxury',
      tours: Array.isArray(item.tours) ? item.tours : [],
    }));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
};

// ─── Gallery ───────────────────────────────────────────────────────────────
export const getGalleryImages = async (): Promise<{ url: string; title: string }[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('image_url, title')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        url: item.image_url,
        title: item.title || '',
      }));
    }
  } catch {
    // fall through to bucket fallback
  }

  return Array.from({ length: 6 }, (_, i) => ({
    url: `${BUCKET_URL}/gallery/gallery-${i + 1}.jpg`,
    title: '',
  }));
};

// ─── Misc ──────────────────────────────────────────────────────────────────
export const getCuratedTours = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.rpc('get_curated_tours');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching curated tours:', error);
    return [];
  }
};

export const getTourByMood = async (mood: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`id, title, slug, short_description, duration, starting_price, category:tour_categories (name)`)
      .eq('status', 'active')
      .contains('mood_tags', [mood])
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tour by mood:', error);
    return null;
  }
};

// Kept for backwards compatibility
export const getTopAdventure = () => getTopTourByCategory('adventures');
export const getTopCulturalTour = () => getTopTourByCategory('full-day');
export const getTopCombinationTour = () => getTopTourByCategory('combination');