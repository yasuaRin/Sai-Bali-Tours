// src/pages/ToursByCategory.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { getTours } from '../services/tourService';
import TourCard from '../components/TourCard';
import type { Tour } from '../services/tourService';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';

// Helper function to safely get category slug from tour object - FULLY DYNAMIC
const getCategorySlug = (tour: Tour): string => {
  // If category is a string (fallback)
  if (typeof tour.category === 'string') {
    return tour.category.toLowerCase().replace(/\s+/g, '-');
  }
  // If category is an object with slug (from Supabase join)
  if (tour.category && typeof tour.category === 'object') {
    // Priority 1: Use the slug if it exists
    if ('slug' in tour.category && (tour.category as any).slug) {
      return (tour.category as any).slug;
    }
    // Priority 2: Use name if no slug
    if ('name' in tour.category && (tour.category as any).name) {
      return (tour.category as any).name.toLowerCase().replace(/\s+/g, '-');
    }
  }
  // Fallback - use category_id to create a slug
  return `category-${tour.category_id}`;
};

// Get display name from category object - FULLY DYNAMIC
const getCategoryDisplayName = (category: any): string => {
  if (!category) return 'Tour';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
    return category.name || category.slug || 'Tour';
  }
  return 'Tour';
};

const ToursByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  // Dynamic display category - converts slug to readable name
  const displayCategory = category?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'All';

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        console.log('Fetched tours:', data);
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Filter tours by category - USING ACTUAL DATABASE CATEGORY SLUGS
  const filteredTours = useMemo(() => {
    if (!category || category === 'all') {
      return tours;
    }
    
    return tours.filter(tour => {
      const tourSlug = getCategorySlug(tour);
      return tourSlug === category;
    });
  }, [tours, category]);

  // Sort tours
  const sortedTours = useMemo(() => {
    const toursToSort = [...filteredTours];
    const getPrice = (p: string) => parseInt(p.replace(/[^0-9]/g, '')) || 0;
    const getDuration = (d: string) => parseInt(d.split(' ')[0]) || 0;

    switch (sortBy) {
      case 'price-asc':
        return toursToSort.sort((a, b) => getPrice(a.price) - getPrice(b.price));
      case 'price-desc':
        return toursToSort.sort((a, b) => getPrice(b.price) - getPrice(a.price));
      case 'duration-asc':
        return toursToSort.sort((a, b) => getDuration(a.duration) - getDuration(b.duration));
      case 'duration-desc':
        return toursToSort.sort((a, b) => getDuration(b.duration) - getDuration(a.duration));
      default:
        return toursToSort;
    }
  }, [filteredTours, sortBy]);

  const triggerPlanner = () => {
    window.dispatchEvent(new CustomEvent('open-bali-planner'));
  };

  const showMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-brand-anchor py-20 sm:py-28 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-orange/5 blur-3xl -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-4">
              Official Itineraries
            </div>
            <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-none tracking-tighter">
              {displayCategory} <br />
              <span className="text-brand-orange italic">Destinations.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Explore our hand-picked {displayCategory.toLowerCase()} experiences. 
              Every journey is 100% private and curated for comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {sortedTours.length > 0 ? (
            <>
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 border-b border-gray-50 pb-8">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange">
                      <Filter size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-text">
                      Total: {sortedTours.length} Experiences Found
                    </span>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-text hover:bg-gray-100 transition-all border border-gray-100">
                      <ArrowUpDown size={14} className="text-brand-orange" />
                      <span>Sort By</span>
                      <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                      {[
                        { label: 'Default', value: 'default' },
                        { label: 'Price: Low to High', value: 'price-asc' },
                        { label: 'Price: High to Low', value: 'price-desc' },
                        { label: 'Duration: Short to Long', value: 'duration-asc' },
                        { label: 'Duration: Long to Short', value: 'duration-desc' }
                      ].map((opt) => (
                        <button 
                          key={opt.value}
                          onClick={() => setSortBy(opt.value as SortOption)}
                          className={`w-full text-left px-5 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-50 hover:text-brand-orange transition-colors ${
                            sortBy === opt.value ? 'text-brand-orange bg-orange-50' : 'text-brand-text'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Showing {Math.min(visibleCount, sortedTours.length)} tours
                </span>
              </div>
              
              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedTours.slice(0, visibleCount).map(tour => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < sortedTours.length && (
                <div className="pt-20 text-center">
                  <button 
                    onClick={showMore}
                    className="inline-flex items-center space-x-3 bg-white border-2 border-brand-anchor px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-anchor hover:text-white transition-all shadow-xl"
                  >
                    <span>Load Next 5 Tours</span>
                    <ChevronDown size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Empty State
            <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
              <h2 className="text-3xl font-black text-gray-300 mb-4 tracking-tighter uppercase">
                Itineraries Coming Soon
              </h2>
              <p className="text-gray-500 font-medium">
                Our team is currently perfecting the routes for this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-black text-brand-text mb-4 tracking-tight">
            Need a Bespoke Itinerary?
          </h3>
          <p className="text-gray-500 mb-10 font-medium">
            Our AI Planner can help you mix and match any of these activities into a custom day trip.
          </p>
          <button 
            onClick={triggerPlanner} 
            className="inline-flex items-center space-x-3 bg-brand-orange text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition shadow-2xl"
          >
            <span>Launch AI Planner</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ToursByCategory;