// src/pages/TourDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTourBySlug } from '../services/tourService';
import type { Tour } from '../services/tourService';

const TourDetail: React.FC = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await getTourBySlug(id || '');
        
        if (data) {
          let imageUrl = data.image;
          if (data.images && data.images.length > 0) {
            const primaryImage = data.images.find((img: any) => img.is_primary);
            imageUrl = primaryImage?.image_url || data.images[0].image_url;
          }
          
          const formattedTour: Tour = {
            id: data.id,
            category_id: data.category_id,
            title: data.title,
            slug: data.slug,
            short_description: data.short_description,
            overview: data.overview || data.short_description || '',
            itinerary: data.itinerary || '',
            inclusions: data.inclusions || [],
            exclusions: data.exclusions || [],
            duration: data.duration || 'Full Day',
            location: data.location || 'Bali, Indonesia',
            starting_price: data.starting_price,
            price: data.price || `From $${data.starting_price || 0}`,
            image: imageUrl,
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
            status: data.status || 'active',
            featured: data.featured || false,
            featured_reason: data.featured_reason,
            activity_level: data.activity_level || 'moderate',
            mood_tags: data.mood_tags || [],
            max_group_size: data.max_group_size || 8,
            created_at: data.created_at,
            updated_at: data.updated_at,
            category: data.category,
            images: data.images,
            rating: data.rating || 4.9,
            reviews: data.reviews || 0,
            highlights: data.highlights || []
          };
          setTour(formattedTour);
        } else {
          setTour(null);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <div className="pt-20 text-center">Loading tour...</div>;
  if (!tour) return <div className="pt-20 text-center">Tour not found</div>;

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-4">{tour.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img 
              src={tour.image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'} 
              alt={tour.title} 
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
          <div>
            <p className="text-gray-600 text-lg mb-6">{tour.overview || tour.short_description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black mb-2">Duration</h3>
                <p>{tour.duration}</p>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">Location</h3>
                <p>{tour.location}</p>
              </div>
              <div>
                <h3 className="text-xl font-black mb-2">Price</h3>
                <p className="text-2xl font-black text-brand-orange">{tour.price}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;