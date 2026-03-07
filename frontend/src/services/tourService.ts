import { supabase } from '../lib/supabaseClient';

// Add this helper at the top
const BUCKET_URL = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/';

// Map tour IDs to their actual image filenames in your bucket
const tourImageMap: Record<number, string> = {
  1: 'bali-swing.jpg',
  2: 'alas-harum-cave-tubing.jpg',
  3: 'tlaga-singha-ubud.jpg',
  4: 'ubud-private-customized.jpg',
  5: 'ubud-buggy-cultural.jpg',
  6: 'cretya-ubud.jpg', 
  7: 'ubud-jungle-cart-volcano.jpg',
  8: 'sunset-sailboat-ubud.jpg',
  9: 'cretya-ubud-atv-gorilla.jpg',
  10: 'temple-bathing-batur-rice.jpg',
  11: 'sailor-cruise-ubud.jpg',
  12: 'northern-bali-highlights.jpg',
  13: 'bali-historical-mother-temple.jpg',
  14: 'nusa-penida-snorkeling.jpg',
  15: 'ulun-danu-temple.jpg', // Your signature tour
  16: 'uluwatu-sunset-kecak.jpg',
  17: 'tanah-lot.jpg', 
  18: 'ubud-atv-350cc-gorilla.jpg',
  19: 'monkey-bar-snorkeling.jpg',
  20: 'mount-batur-sunrise-trek.jpg',
  21: 'telaga-waja-rafting.jpg',
  22: 'bali-swing.jpg', // Your signature tour
};

const getTourImageUrl = (tourId: number): string => {
  const filename = tourImageMap[tourId] || `${tourId}.jpg`;
  return `${BUCKET_URL}/tours/${filename}`;
};

export interface Tour {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  overview?: string;
  itinerary: string;
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
  category?: any;
  images?: any[];
  rating?: number;
  reviews?: number;
  highlights?: string[];
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

export const getTours = async (): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const tours: Tour[] = (data || []).map((item: any) => {
      let categoryName = 'Tour';
      if (item.category) {
        if (typeof item.category === 'object') {
          categoryName = item.category.name || 'Tour';
        } else {
          categoryName = String(item.category);
        }
      }
      
      return {
        id: Number(item.id),
        title: String(item.title || ''),
        category: categoryName as any,
        image: item.image_url || getTourImageUrl(item.id),
        image_alt: item.image_alt || String(item.title || ''),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        overview: String(item.short_description || item.overview || ''),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
        featured: item.featured || false,
        rating: item.rating || 4.9,
        reviews: item.reviews || 0,
        starting_price: item.starting_price,
        short_description: item.short_description,
        slug: item.slug,
        location: item.location,
        category_id: item.category_id,
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        status: item.status || 'active',
        featured_reason: item.featured_reason,
        activity_level: item.activity_level || 'moderate',
        mood_tags: item.mood_tags || [],
        max_group_size: item.max_group_size || 8,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        images: []
      };
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
};

export const getAdventures = async (): Promise<Adventure[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories!inner (name, slug, vibe)
      `)
      .eq('category.tour_categories.slug', 'adventures')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const adventures: Adventure[] = (data || []).map((item: any) => {
      let activityLevel: 'Easy' | 'Moderate' | 'Hard' = 'Moderate';
      if (item.activity_level) {
        const level = String(item.activity_level).toLowerCase();
        if (level.includes('easy')) activityLevel = 'Easy';
        else if (level.includes('hard') || level.includes('challenging')) activityLevel = 'Hard';
      }
      
      return {
        id: String(item.id),
        title: String(item.title || ''),
        category: 'Adventure',
        icon: 'Zap',
        image: getTourImageUrl(item.id),
        activityLevel: activityLevel,
        description: String(item.short_description || item.overview || ''),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : []
      };
    });
    
    return adventures;
  } catch (error) {
    console.error('Error fetching adventures:', error);
    return [];
  }
};

export const getTourById = async (id: string): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    let categoryName = 'Tour';
    if (data.category) {
      if (typeof data.category === 'object') {
        categoryName = data.category.name || 'Tour';
      } else {
        categoryName = String(data.category);
      }
    }
    
    return {
      id: Number(data.id),
      title: String(data.title || ''),
      category: categoryName as any,
      image: getTourImageUrl(data.id),
      price: `From $${data.starting_price || 0}`,
      duration: String(data.duration || 'Full Day'),
      overview: String(data.short_description || data.overview || ''),
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
      featured: data.featured || false,
      rating: data.rating || 4.9,
      reviews: data.reviews || 0,
      starting_price: data.starting_price,
      short_description: data.short_description,
      slug: data.slug,
      location: data.location,
      category_id: data.category_id,
      seo_title: data.seo_title || '',
      seo_description: data.seo_description || '',
      status: data.status || 'active',
      featured_reason: data.featured_reason,
      activity_level: data.activity_level || 'moderate',
      mood_tags: data.mood_tags || [],
      max_group_size: data.max_group_size || 8,
      created_at: data.created_at,
      updated_at: data.updated_at,
      category: data.category,
      images: []
    };
  } catch (error) {
    console.error('Error fetching tour by id:', error);
    return null;
  }
};

export const getPackages = async (): Promise<Package[]> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const packages: Package[] = (data || []).map((item: any) => ({
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
      image: item.image || `${BUCKET_URL}/packages/${item.id}.jpg`,
      price: `$${item.price_estimate || 499}`,
      nights: item.duration_nights || 2,
      summary: Array.isArray(item.summary) ? item.summary : [],
      hotelCategory: item.hotel_category || 'Luxury',
      tours: Array.isArray(item.tours) ? item.tours : []
    }));
    
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
};

export const getGalleryImages = async (): Promise<{ url: string; title: string }[]> => {
  // Return bucket URLs for gallery images
  return [
    {
      url: `${BUCKET_URL}/gallery/gallery-1.jpg`,
      title: 'Ubud Rice Terraces'
    },
    {
      url: `${BUCKET_URL}/gallery/gallery-2.jpg`,
      title: 'Uluwatu Temple'
    },
    {
      url: `${BUCKET_URL}/gallery/gallery-3.jpg`,
      title: 'Mount Batur Sunrise'
    },
    {
      url: `${BUCKET_URL}/gallery/gallery-4.jpg`,
      title: 'Traditional Dance'
    },
    {
      url: `${BUCKET_URL}/gallery/gallery-5.jpg`,
      title: 'Hidden Waterfall'
    },
    {
      url: `${BUCKET_URL}/gallery/gallery-6.jpg`,
      title: 'Rice Terrace Swing'
    }
  ];
};

export const getSignatureTours = async (limit: number = 4): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    const tours: Tour[] = (data || []).map((item: any) => {
      let categoryName = 'Tour';
      if (item.category) {
        if (typeof item.category === 'object') {
          categoryName = item.category.name || 'Tour';
        } else {
          categoryName = String(item.category);
        }
      }
      
      return {
        id: Number(item.id),
        title: String(item.title || ''),
        category: categoryName as any,
        image: item.image_url || getTourImageUrl(item.id),
        image_alt: item.image_alt || String(item.title || ''),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        overview: String(item.short_description || item.overview || ''),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
        featured: item.featured || false,
        rating: item.rating || 4.9,
        reviews: item.reviews || 0,
        starting_price: item.starting_price,
        short_description: item.short_description,
        slug: item.slug,
        location: item.location,
        category_id: item.category_id,
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        status: item.status || 'active',
        featured_reason: item.featured_reason,
        activity_level: item.activity_level || 'moderate',
        mood_tags: item.mood_tags || [],
        max_group_size: item.max_group_size || 8,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        images: []
      };
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching signature tours:', error);
    return [];
  }
};

export const getTourBySlug = async (slug: string): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    let categoryName = 'Tour';
    if (data.category) {
      if (typeof data.category === 'object') {
        categoryName = data.category.name || 'Tour';
      } else {
        categoryName = String(data.category);
      }
    }
    
    return {
      id: Number(data.id),
      title: String(data.title || ''),
      category: categoryName as any,
      image: getTourImageUrl(data.id),
      price: `From $${data.starting_price || 0}`,
      duration: String(data.duration || 'Full Day'),
      overview: String(data.short_description || data.overview || ''),
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
      featured: data.featured || false,
      rating: data.rating || 4.9,
      reviews: data.reviews || 0,
      starting_price: data.starting_price,
      short_description: data.short_description,
      slug: data.slug,
      location: data.location,
      category_id: data.category_id,
      seo_title: data.seo_title || '',
      seo_description: data.seo_description || '',
      status: data.status || 'active',
      featured_reason: data.featured_reason,
      activity_level: data.activity_level || 'moderate',
      mood_tags: data.mood_tags || [],
      max_group_size: data.max_group_size || 8,
      created_at: data.created_at,
      updated_at: data.updated_at,
      category: data.category,
      images: []
    };
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
};

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
      .select(`
        id,
        title,
        slug,
        short_description,
        duration,
        starting_price,
        category:tour_categories (name)
      `)
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

// Get signature tours - one from each category (Combination, Adventure, Full Day, Half Day)
export const getSignatureToursByCategory = async (): Promise<Tour[]> => {
  try {
    // Define the tours by their IDs as specified
    const signatureTourIds = [6, 22, 15, 17]; // Cretya, Ubud Swing, Bedugul, Tanah Lot
    
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .in('id', signatureTourIds)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform data
    const tours: Tour[] = (data || []).map((item: any) => {
      let categoryName = 'Tour';
      if (item.category) {
        if (typeof item.category === 'object') {
          categoryName = item.category.name || 'Tour';
        } else {
          categoryName = String(item.category);
        }
      }
      
      return {
        id: Number(item.id),
        title: String(item.title || ''),
        category: categoryName as any,
        image: getTourImageUrl(item.id),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        overview: String(item.short_description || item.overview || ''),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
        featured: item.featured || false,
        rating: item.rating || 4.9,
        reviews: item.reviews || 0,
        starting_price: item.starting_price,
        short_description: item.short_description,
        slug: item.slug,
        location: item.location,
        category_id: item.category_id,
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        status: item.status || 'active',
        featured_reason: item.featured_reason,
        activity_level: item.activity_level || 'moderate',
        mood_tags: item.mood_tags || [],
        max_group_size: item.max_group_size || 8,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        images: []
      };
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching signature tours by category:', error);
    return [];
  }
};

export const getTopAdventure = async (): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories!inner (name, slug, vibe)
      `)
      .eq('status', 'active')
      .eq('category.tour_categories.slug', 'adventures')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching top adventure:', error);
    return null;
  }
};

export const getTopCulturalTour = async (): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories!inner (name, slug, vibe)
      `)
      .eq('status', 'active')
      .eq('category.tour_categories.vibe', 'cultural')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching top cultural tour:', error);
    return null;
  }
};

export const getTopCombinationTour = async (): Promise<Tour | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .ilike('title', '%combination%')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      const { data: featuredData } = await supabase
        .from('tours')
        .select(`
          *,
          category:tour_categories (name, slug, vibe)
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      return featuredData;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching top combination tour:', error);
    return null;
  }
};

export const getPopularTours = async (limit: number = 3): Promise<Tour[]> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    if (data && data.length >= limit) {
      const tours: Tour[] = (data || []).map((item: any) => {
        let categoryName = 'Tour';
        if (item.category) {
          if (typeof item.category === 'object') {
            categoryName = item.category.name || 'Tour';
          } else {
            categoryName = String(item.category);
          }
        }
        
        return {
          id: Number(item.id),
          title: String(item.title || ''),
          category: categoryName as any,
          image: getTourImageUrl(item.id),
          price: `From $${item.starting_price || 0}`,
          duration: String(item.duration || 'Full Day'),
          overview: String(item.short_description || item.overview || ''),
          highlights: Array.isArray(item.highlights) ? item.highlights : [],
          itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
          inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
          exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
          featured: item.featured || false,
          rating: item.rating || 4.9,
          reviews: item.reviews || 0,
          starting_price: item.starting_price,
          short_description: item.short_description,
          slug: item.slug,
          location: item.location,
          category_id: item.category_id,
          seo_title: item.seo_title || '',
          seo_description: item.seo_description || '',
          status: item.status || 'active',
          featured_reason: item.featured_reason,
          activity_level: item.activity_level || 'moderate',
          mood_tags: item.mood_tags || [],
          max_group_size: item.max_group_size || 8,
          created_at: item.created_at,
          updated_at: item.updated_at,
          category: item.category,
          images: []
        };
      });
      return tours;
    }
    
    const remaining = limit - (data?.length || 0);
    const { data: recentData, error: recentError } = await supabase
      .from('tours')
      .select(`
        *,
        category:tour_categories (name, slug, vibe)
      `)
      .eq('status', 'active')
      .eq('featured', false)
      .order('created_at', { ascending: false })
      .limit(remaining);
    
    if (recentError) throw recentError;
    
    const allData = [...(data || []), ...(recentData || [])];
    
    const tours: Tour[] = allData.map((item: any) => {
      let categoryName = 'Tour';
      if (item.category) {
        if (typeof item.category === 'object') {
          categoryName = item.category.name || 'Tour';
        } else {
          categoryName = String(item.category);
        }
      }
      
      return {
        id: Number(item.id),
        title: String(item.title || ''),
        category: categoryName as any,
        image: getTourImageUrl(item.id),
        price: `From $${item.starting_price || 0}`,
        duration: String(item.duration || 'Full Day'),
        overview: String(item.short_description || item.overview || ''),
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        itinerary: Array.isArray(item.itinerary) ? item.itinerary : [],
        inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
        exclusions: Array.isArray(item.exclusions) ? item.exclusions : [],
        featured: item.featured || false,
        rating: item.rating || 4.9,
        reviews: item.reviews || 0,
        starting_price: item.starting_price,
        short_description: item.short_description,
        slug: item.slug,
        location: item.location,
        category_id: item.category_id,
        seo_title: item.seo_title || '',
        seo_description: item.seo_description || '',
        status: item.status || 'active',
        featured_reason: item.featured_reason,
        activity_level: item.activity_level || 'moderate',
        mood_tags: item.mood_tags || [],
        max_group_size: item.max_group_size || 8,
        created_at: item.created_at,
        updated_at: item.updated_at,
        category: item.category,
        images: []
      };
    });
    
    return tours;
  } catch (error) {
    console.error('Error fetching popular tours:', error);
    return [];
  }
};