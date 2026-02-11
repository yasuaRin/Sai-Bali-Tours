// src/components/ReviewStrip.tsx
import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonialService } from '../services/testimonialService';
import type { Review } from '../types';

const ReviewStrip: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const featuredReviews = await testimonialService.getFeaturedTestimonials();
      setReviews(featuredReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]); // Add reviews as dependency

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.5 : clientWidth * 0.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 500);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 overflow-hidden border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">Loading reviews...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 overflow-hidden border-y border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
        <div>
          <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-4">Guest Testimonials</div>
          <h3 className="text-3xl sm:text-5xl font-black text-brand-text tracking-tighter leading-none">
            Stories from <br /> <span className="text-brand-orange italic">The Island.</span>
          </h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-4 flex items-center">
            <Star size={14} fill="#F28C33" className="mr-2 text-brand-orange" />
            4.9/5 Average Rating from 50K+ Guests
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => scroll('left')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              canScrollLeft ? 'bg-white shadow-xl text-brand-text hover:bg-brand-orange hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              canScrollRight ? 'bg-white shadow-xl text-brand-text hover:bg-brand-orange hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-8 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8"
      >
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="min-w-[320px] sm:min-w-[450px] bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 snap-start flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-10 right-10 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors">
              <Quote size={60} fill="currentColor" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-1 mb-8 text-brand-orange">
                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-text text-xl sm:text-2xl font-medium leading-relaxed italic mb-10">
                "{review.text}"
              </p>
            </div>
            
            <div className="flex items-center space-x-5 relative z-10 border-t border-gray-50 pt-8">
              <div className="relative">
                <img src={review.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt={review.name} />
                <div className="absolute -bottom-2 -right-2 bg-brand-orange text-white p-1 rounded-full shadow-md">
                   <Star size={10} fill="currentColor" />
                </div>
              </div>
              <div>
                <div className="font-black text-brand-text text-base">{review.name}</div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{review.country}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'TripAdvisor', score: '5.0/5.0' },
           { label: 'Google Maps', score: '4.9/5.0' },
           { label: 'WhatsApp Response', score: '< 5 Mins' },
           { label: 'Total Guests', score: '50K+' }
         ].map((stat, i) => (
           <div key={i} className="text-center py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-sm font-black text-brand-text">{stat.score}</div>
           </div>
         ))}
      </div>
    </section>
  );
};

export default ReviewStrip;