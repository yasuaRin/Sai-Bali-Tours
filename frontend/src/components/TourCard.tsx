import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ChevronDown, ChevronUp, Check, ArrowUpRight } from 'lucide-react';
import type { Tour } from '../types';

// 1️⃣ IMPORT THE IMAGE OPTIMIZER
import { getTourCardImage } from '../utils/imageOptimizer';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // 2️⃣ TRACK WHEN IMAGE LOADS

  // 3️⃣ FALLBACK IMAGE (should be a complete URL)
  const fallbackImage = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/fallback.jpg';

  // 4️⃣ OPTIMIZE THE IMAGE URL
  const optimizedImage = getTourCardImage(tour.image);

  return (
    <div 
      className={`group bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full ${
        isExpanded ? 'shadow-2xl ring-2 ring-brand-orange/10' : 'shadow-md hover:shadow-xl'
      }`}
    >
      {/* Visual Area */}
      <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-gray-100">
        {/* 5️⃣ LOADING SKELETON - Shows gray pulsing box while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
        )}
        
        <img 
          src={imageError ? fallbackImage : optimizedImage}  // 6️⃣ USE OPTIMIZED IMAGE
          alt={tour.image_alt || tour.title}
          className={`w-full h-full object-cover transition-all duration-1000 ${
            // 7️⃣ FADE IN WHEN LOADED
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-110`}
          onError={() => setImageError(true)}  // 8️⃣ HANDLE ERROR
          onLoad={() => setImageLoaded(true)}   // 9️⃣ MARK AS LOADED
          loading="lazy"                        // 🔟 LAZY LOAD
          width="400"                           // 1️⃣1️⃣ HELPS BROWSER RESERVE SPACE
          height="300"
        />
        
        {/* Category Badge - Top Left */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <div className="bg-white/95 backdrop-blur-md text-brand-text px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm">
            {typeof tour.category === 'object' ? tour.category.name : tour.category}
          </div>
        </div>
        
        {/* Price Badge - Bottom Left */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
          <div className="bg-brand-orange text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-sm">
            {tour.price}
          </div>
        </div>
      </div>
      
      {/* Content Area - REST OF YOUR COMPONENT STAYS THE SAME */}
      <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-brand-orange">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={8} className="text-brand-orange fill-brand-orange" />
            ))}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Clock size={10} className="text-brand-orange" />
            <span>{tour.duration}</span>
          </div>
        </div>
        
        <h3 className="text-base sm:text-lg md:text-xl font-black text-brand-text leading-tight mb-2 sm:mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">
          {tour.title}
        </h3>
        
        <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 mb-4 sm:mb-5 md:mb-6">
          {tour.overview}
        </p>

        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-50 flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 sm:p-2.5 md:p-3 bg-gray-50 text-brand-text rounded-lg sm:rounded-xl hover:bg-brand-orange hover:text-white transition-all"
            title={isExpanded ? 'Hide Details' : 'View Quick Details'}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <Link 
            to={`/tour/${tour.slug}`}
            className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 bg-brand-anchor text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase hover:bg-brand-orange transition-all"
          >
            <span>Full Details</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>

      {/* Expandable Preview Drawer */}
      {isExpanded && (
        <div className="bg-gray-50/80 p-4 sm:p-5 md:p-6 border-t border-gray-100 animate-fadeIn">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-orange mb-1.5 sm:mb-2">Highlights</h4>
              <div className="space-y-1 sm:space-y-1.5">
                {tour.highlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-brand-orange" />
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-brand-text">{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-orange mb-1.5 sm:mb-2">Inclusions</h4>
              <div className="grid grid-cols-1 gap-0.5 sm:gap-1">
                {tour.inclusions.slice(0, 3).map((inc, i) => (
                  <div key={i} className="flex items-center space-x-1.5 sm:space-x-2 text-[8px] sm:text-[9px] md:text-[10px] font-medium text-gray-600">
                    <Check size={10} className="text-green-500 shrink-0" />
                    <span className="truncate">{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourCard;