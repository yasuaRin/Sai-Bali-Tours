import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { tourService } from '../services/tourService';

// Define types locally
interface TourItem {
  id: number;
  title: string;
  image: string;
  price: string;
  duration: string;
  category: string;
  slug?: string;
  location?: string;
  overview?: string;
  starting_price?: number;
}

const ExperienceDiscovery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Combination');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tours, setTours] = useState<TourItem[]>([]);
  const [adventures, setAdventures] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = ['Combination', 'Full Day', 'Half Day', 'Adventures'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the existing function getCuratedTours()
        const curatedTours = await tourService.getCuratedTours();
        
        console.log('Curated tours data:', curatedTours); // Debug log
        
        // Map the curated tours data to TourItem format
        const mapToTourItem = (item: any): TourItem => {
          // Check what properties your curated tours actually have
          const tourId = item.id || item.tour_id || 0;
          const title = item.title || item.tour_title || 'Bali Experience';
          const price = item.starting_price || item.tour_starting_price || 99;
          const category = item.category_vibe || item.category?.vibe || 'Tour';
          const duration = item.duration || 'Full Day';
          const location = item.location || 'Bali, Indonesia';
          const overview = item.short_description || item.tour_short_description || 'Experience the beauty of Bali';
          const image = item.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80';
          
          return {
            id: tourId,
            title: title,
            image: image,
            price: `From $${price}`,
            duration: duration,
            category: category,
            location: location,
            overview: overview,
            starting_price: price
          };
        };
        
        // Convert all curated tours
        const allItems = curatedTours.map(mapToTourItem);
        
        // For now, let's create some mock data for different categories
        // You'll need to update this based on your actual data structure
        
        // Separate by category - adjust based on your actual category values
        const tourItems = allItems.filter(item => 
          !item.category?.toLowerCase().includes('adventure')
        );
        
        const adventureItems = allItems.filter(item => 
          item.category?.toLowerCase().includes('adventure')
        );
        
        // If no adventures in data, create some mock ones for demo
        if (adventureItems.length === 0 && allItems.length > 0) {
          adventureItems.push(
            {
              ...allItems[0],
              id: 9991,
              title: 'ATV Quad Bike Adventure',
              category: 'Adventure',
              image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80'
            },
            {
              ...allItems[0],
              id: 9992,
              title: 'White Water Rafting',
              category: 'Adventure',
              image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
            }
          );
        }
        
        setTours(tourItems);
        setAdventures(adventureItems);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error
        setTours([]);
        setAdventures([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getFilteredItems = (): TourItem[] => {
    if (activeTab === 'Adventures') {
      return adventures.map(item => ({ 
        ...item, 
        category: 'Adventure'
      }));
    }
    
    // For tour categories, filter tours
    return tours.filter(item => {
      const itemCategory = item.category?.toLowerCase() || '';
      const itemTitle = item.title?.toLowerCase() || '';
      const itemDuration = item.duration?.toLowerCase() || '';
      
      if (activeTab === 'Combination') {
        return itemCategory.includes('combination') || itemTitle.includes('combination');
      }
      if (activeTab === 'Full Day') {
        return itemCategory.includes('full') || itemDuration.includes('full day') || itemDuration.includes('full-day');
      }
      if (activeTab === 'Half Day') {
        return itemCategory.includes('half') || itemDuration.includes('half day') || itemDuration.includes('half-day');
      }
      return true;
    });
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.5 : scrollLeft + clientWidth * 0.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center py-12">
          <Loader2 className="animate-spin mx-auto text-brand-orange" size={32} />
          <p className="mt-4 text-gray-500">Loading experiences...</p>
        </div>
      </section>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden relative group/discovery">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
          <div className="max-w-2xl">
            <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-3">Discovery Center</div>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-text tracking-tighter leading-none">
              Explore Every <br />
              <span className="text-brand-orange italic">Corner of Bali.</span>
            </h2>
            <div className="flex flex-wrap gap-2 mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 ${
                    activeTab === tab
                      ? 'bg-brand-orange border-brand-orange text-white shadow-lg'
                      : 'bg-transparent border-gray-100 text-gray-400 hover:border-brand-orange/30 hover:text-brand-orange'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => scroll('left')}
            className={`absolute -left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white rounded-full shadow-xl text-brand-text hover:bg-brand-orange hover:text-white transition-all duration-300 hidden lg:flex items-center justify-center border border-gray-100 ${scrollProgress <= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className={`absolute -right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-white rounded-full shadow-xl text-brand-text hover:bg-brand-orange hover:text-white transition-all duration-300 hidden lg:flex items-center justify-center border border-gray-100 ${scrollProgress >= 99 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <ChevronRight size={18} />
          </button>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="min-w-[220px] sm:min-w-[280px] snap-start">
                  <Link 
                    to={activeTab === 'Adventures' ? '/adventures' : `/tour/${item.slug || item.id}`}
                    className="group block relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-md bg-gray-100 border border-gray-50"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor/95 via-brand-anchor/20 to-transparent opacity-85 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1 bg-brand-orange text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-md">
                        {item.price}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center space-x-2 text-brand-accent mb-1">
                        <div className="w-5 h-[1px] bg-brand-accent"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest">Select Plan</span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-brand-orange transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <div className="flex items-center space-x-1 text-white/70 text-[8px] font-bold uppercase tracking-widest">
                          <Clock size={10} />
                          <span>{item.duration}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-anchor group-hover:bg-brand-orange group-hover:text-white transition-all shadow-lg">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="min-w-[280px] snap-start flex items-center justify-center p-8 text-center bg-gray-50 rounded-[2rem]">
                <div>
                  <div className="text-4xl mb-4">🌴</div>
                  <p className="text-gray-400">No {activeTab.toLowerCase()} experiences available.</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 max-w-7xl mx-auto h-0.5 bg-gray-50 rounded-full overflow-hidden relative">
            <div 
              className="absolute h-full bg-brand-orange/30 transition-all duration-300 ease-out" 
              style={{ 
                width: `${Math.max(10, scrollProgress)}%`, 
                left: `${Math.min(90, scrollProgress * 0.9)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceDiscovery;