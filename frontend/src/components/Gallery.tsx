import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tourService } from '../services/tourService'; // Import the service object
import { Search, MapPin, Loader2 } from 'lucide-react';

// Define types locally since there are import issues
interface GalleryTour {
  id: number;
  title: string;
  image: string;
  price: string;
  category: string;
  location?: string;
  duration?: string;
  overview?: string;
}

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [tours, setTours] = useState<GalleryTour[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Combination', 'Full Day', 'Half Day'];

  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Use the existing getCuratedTours function
        const toursData = await tourService.getCuratedTours();
        
        // Map the data to GalleryTour format
        const mappedTours: GalleryTour[] = toursData.map((item: any) => ({
          id: item.id || item.tour_id || 0,
          title: item.title || item.tour_title || 'Bali Tour',
          image: item.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
          price: `From $${item.starting_price || item.tour_starting_price || 99}`,
          category: item.category_vibe || item.category?.vibe || 'Tour',
          location: item.location || 'Bali, Indonesia',
          duration: item.duration || 'Full Day',
          overview: item.short_description || item.tour_short_description || 'Experience Bali'
        }));
        
        setTours(mappedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
        // Set empty array on error
        setTours([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);

  const filteredTours = activeFilter === 'All' 
    ? tours 
    : tours.filter(tour => tour.category === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        <span className="ml-3 text-gray-500">Loading tours...</span>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex flex-col items-center space-y-8">
        <div className="inline-flex p-1.5 bg-gray-100 rounded-[2rem] shadow-inner">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 sm:px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeFilter === cat 
                  ? 'bg-white text-brand-orange shadow-md scale-100' 
                  : 'text-gray-400 hover:text-brand-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTours.map((tour, index) => (
          <Link 
            key={tour.id} 
            to={`/tour/${tour.id}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-gray-200 shadow-xl transition-all duration-500 hover:-translate-y-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img 
              src={tour.image} 
              alt={tour.title} 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 z-20">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-brand-text text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {tour.category}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor via-brand-anchor/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10 z-10">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="flex items-center space-x-2 text-brand-accent mb-2">
                  <MapPin size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Bali, Indonesia</span>
                </div>
                <h4 className="text-white text-2xl font-black leading-tight mb-4">
                  {tour.title}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
                    <span>View Itinerary</span>
                    <div className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-brand-orange transition-all duration-500"></div>
                  </div>
                  <div className="text-brand-orange font-black text-lg">
                    {tour.price.split(' ')[1] || tour.price}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity"></div>
          </Link>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
          <Search className="mx-auto text-gray-200 mb-4" size={48} />
          <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter">No destinations found</h3>
          <p className="text-gray-500">Please try another category.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;