// src/utils/imageOptimizer.ts

export const optimizeImage = (
  url: string, 
  width: number = 400, 
  height: number = 300
): string => {
  // Only optimize Supabase images
  if (!url || !url.includes('supabase.co')) {
    return url;
  }
  
  // Add query parameters for Supabase image transformation
  return `${url}?width=${width}&height=${height}&resize=cover&quality=75`;
};

// Pre-defined sizes for different components
export const getTourCardImage = (url: string) => optimizeImage(url, 400, 300);
export const getHeroImage = (url: string) => optimizeImage(url, 1920, 1080);
export const getThumbnailImage = (url: string) => optimizeImage(url, 150, 150);