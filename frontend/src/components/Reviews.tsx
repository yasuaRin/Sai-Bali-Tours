import React, { useState, useEffect } from 'react';
import { Star, Loader2, MapPin, Heart, Plus, Minus } from 'lucide-react';
import { testimonialService } from '../services/testimonialService';
import { Testimonial } from '../types/index';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    testimonialService.getTestimonials().then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const getInitialsAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F28C33&color=fff&bold=true&rounded=true&font-size=0.4`;
  };

  const handleLoadMore = () => {
    if (window.innerWidth < 640) {
      setVisibleCount(prev => prev + 1);
    } else if (window.innerWidth < 1024) {
      setVisibleCount(prev => prev + 2);
    } else {
      setVisibleCount(prev => prev + 3);
    }
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16 lg:space-y-20">
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
        {reviews.slice(0, visibleCount).map((review) => (
          <div 
            key={review.id} 
            itemScope 
            itemType="https://schema.org/Review"
            className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full group hover:shadow-xl lg:hover:shadow-2xl hover:-translate-y-1 lg:hover:-translate-y-2 transition-all duration-500 lg:duration-700"
          >
            {/* Header Identity & Stars */}
            <div className="flex items-start justify-between mb-6 sm:mb-8 lg:mb-10">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative shrink-0">
                  <img 
                    src={getInitialsAvatar(review.author_name)} 
                    alt={review.author_name} 
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-gray-100 object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                    <Heart size={6} sm:size={7} lg:size={8} className="text-brand-orange" fill="currentColor" />
                  </div>
                </div>
                <div className="flex flex-col" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <div itemProp="name" className="font-black text-brand-text text-xs sm:text-sm lg:text-base uppercase tracking-tighter leading-tight mb-0.5">{review.author_name}</div>
                  <div className="flex items-center text-[6px] sm:text-[7px] lg:text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">
                    <MapPin size={6} sm:size={7} lg:size={8} className="mr-1 text-brand-orange" />
                    {review.author_location || 'Bali'}
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center space-x-0.5 pt-1 sm:pt-1.5" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={review.rating.toString()} />
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={8} 
                    sm:size={9} 
                    lg:size={10} 
                    className={i < review.rating ? "text-brand-orange fill-brand-orange" : "text-gray-100"} 
                  />
                ))}
              </div>
            </div>

            {/* Comment Body */}
            <div className="flex-1">
              <p itemProp="reviewBody" className="text-brand-text font-bold text-xs sm:text-sm lg:text-base leading-[1.5] sm:leading-[1.6] lg:leading-[1.65] tracking-tight group-hover:text-brand-orange transition-colors duration-500 line-clamp-4 sm:line-clamp-5 lg:line-clamp-6">
                "{review.content}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More / Show Less Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-10 lg:mt-12">
        {visibleCount < reviews.length && (
          <button 
            onClick={handleLoadMore}
            className="group relative flex items-center space-x-2 sm:space-x-3 bg-brand-text text-white px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-full shadow-lg lg:shadow-xl hover:bg-brand-orange transition-all duration-500 active:scale-95"
          >
            <Plus size={14} sm:size={15} lg:size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-[8px] sm:text-[9px] lg:text-[10px]">Load More Reviews</span>
          </button>
        )}
        
        {visibleCount > 6 && (
          <button 
            onClick={handleShowLess}
            className="group relative flex items-center space-x-2 sm:space-x-3 bg-white text-brand-text border-2 border-gray-100 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 rounded-full shadow-lg hover:border-brand-orange hover:text-brand-orange transition-all duration-500 active:scale-95"
          >
            <Minus size={14} sm:size={15} lg:size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-[8px] sm:text-[9px] lg:text-[10px]">Show Less</span>
          </button>
        )}
      </div>

      {/* Review Count */}
      {reviews.length > 0 && (
        <div className="text-center text-gray-400 text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest mt-4 sm:mt-6 lg:mt-8">
          Showing {Math.min(visibleCount, reviews.length)} of {reviews.length} reviews
        </div>
      )}
    </div>
  );
};

export default Reviews;