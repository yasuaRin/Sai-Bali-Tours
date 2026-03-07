import React, { useState, useEffect } from 'react';
import { Star, Heart, Award, Sparkles, MapPin, Plus, Minus } from 'lucide-react';
import { testimonialService } from '../services/testimonialService';
import type { Testimonial } from '../types/index';

const ReviewStrip: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showVerifiedSection, setShowVerifiedSection] = useState(false);

  useEffect(() => {
    testimonialService.getTestimonials().then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  // SEO: Dynamic JSON-LD Structured Data
  useEffect(() => {
    if (reviews.length > 0) {
      const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
      
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "name": "Sai Bali Private Tours",
        "description": "Premium private tour services in Bali, Indonesia.",
        "provider": {
          "@type": "LocalBusiness",
          "name": "PT. Bali Mertan Pertiwi"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": averageRating,
          "reviewCount": reviews.length.toString()
        },
        "review": reviews.map(r => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": r.rating.toString()
          },
          "author": {
            "@type": "Person",
            "name": r.author_name
          },
          "reviewBody": r.content
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) document.head.removeChild(existingScript);
      };
    }
  }, [reviews]);

  const getInitialsAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F28C33&color=fff&bold=true&rounded=true&font-size=0.4`;
  };

  const handleLoadMore = () => {
    const newCount = visibleCount + (window.innerWidth < 768 ? 2 : 3);
    setVisibleCount(newCount);
    
    if (newCount >= reviews.length) {
      setShowVerifiedSection(true);
    }
  };

  const handleShowLess = () => {
    setVisibleCount(3);
    setShowVerifiedSection(false);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  // Group reviews by platform for stats
  const getPlatformStats = () => {
    const stats = {
      getyourguide: { count: 0, total: 0 },
      tripadvisor: { count: 0, total: 0 },
      google: { count: 0, total: 0 }
    };
    
    reviews.forEach(review => {
      if (stats[review.platform as keyof typeof stats]) {
        stats[review.platform as keyof typeof stats].count++;
        stats[review.platform as keyof typeof stats].total += review.rating;
      }
    });
    
    return stats;
  };

  const platformStats = getPlatformStats();

  if (loading) return null;

  return (
    <section className="py-24 sm:py-48 bg-white relative overflow-hidden" id="testimonials">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/[0.02] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center space-y-8 mb-24">
          
          
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-7xl font-black text-brand-text tracking-tighter leading-[0.85] animate-fadeInUp">
              What Our<br />
              <span className="text-brand-orange italic">Travelers Say</span>
            </h2>
            <div className="flex items-center justify-center space-x-4 pt-4 animate-fadeInUp delay-150">
              <div className="h-px w-10 bg-gray-200"></div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[9px]">Trusted by Travelers Worldwide</p>
              <div className="h-px w-10 bg-gray-200"></div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {reviews.slice(0, visibleCount).map((review, idx) => (
              <div 
                key={review.id} 
                itemScope 
                itemType="https://schema.org/Review"
                className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col group hover:shadow-[0_40px_100px_-20px_rgba(242,140,51,0.1)] hover:-translate-y-2 transition-all duration-700 animate-fadeInUp h-full"
                style={{ animationDelay: `${(idx % 3) * 100}ms` }}
              >
                {/* Header Row: Avatar/Name/Location LEFT, Stars RIGHT */}
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative shrink-0">
                      <img 
                        src={getInitialsAvatar(review.author_name)} 
                        className="w-12 h-12 rounded-2xl bg-gray-100 object-cover relative z-10 shadow-sm transition-transform duration-700 group-hover:scale-105" 
                        alt={review.author_name} 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-md z-20">
                        <Heart size={8} className="text-brand-orange" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex flex-col" itemProp="author" itemScope itemType="https://schema.org/Person">
                      <cite itemProp="name" className="not-italic font-black text-brand-text text-sm uppercase tracking-tighter leading-tight mb-0.5">{review.author_name}</cite>
                      <div className="flex items-center text-[8px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        <MapPin size={8} className="mr-1 text-brand-orange" />
                        {review.author_location || 'Bali'}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating Section - TOP RIGHT */}
                  <div className="flex items-center space-x-0.5 pt-1.5" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                    <meta itemProp="ratingValue" content={review.rating.toString()} />
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={i < review.rating ? "text-brand-orange fill-brand-orange" : "text-gray-100"} 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <p itemProp="reviewBody" className="text-brand-text text-base sm:text-lg font-bold leading-[1.6] tracking-tight group-hover:text-brand-orange transition-colors duration-500">
                    {review.content}
                  </p>
                </div>

                {/* Platform Badge */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-50">
                  <span className="inline-block px-3 py-1 bg-gray-50 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {review.platform === 'getyourguide' ? 'GetYourGuide' : 
                     review.platform === 'tripadvisor' ? 'TripAdvisor' : 'Google'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Verification Section - Shows when all reviews are loaded */}
        {showVerifiedSection && (
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* GetYourGuide */}
              <a 
                href="https://www.getyourguide.com/sai-bali-tour-s391689/?msockid=3c8484dd25456dae3bf7979424136c7a" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-5 sm:p-6 rounded-[2rem] border border-gray-100 hover:border-brand-orange hover:shadow-xl transition-all duration-500 flex flex-col items-center"
              >
                <img src="https://cdn.getyourguide.com/tf/assets/static/logos/gyg-logo.svg" alt="GetYourGuide" className="h-5 sm:h-6 mb-2 sm:mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-base sm:text-lg font-black text-brand-text tracking-tight mb-0.5">{averageRating} / 5.0</span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  {platformStats.getyourguide.count}+ reviews
                </span>
              </a>

              {/* TripAdvisor */}
              <a 
                href="https://www.tripadvisor.co.id/Attraction_Review-g297698-d8799749-Reviews-Sai_Bali_Tours-Nusa_Dua_Benoa_South_Kuta_Bali.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-5 sm:p-6 rounded-[2rem] border border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-500 flex flex-col items-center"
              >
                <div className="flex items-center space-x-2 text-green-600 mb-2 sm:mb-3">
                  <Award size={14} sm:size={16} />
                  <span className="font-black uppercase tracking-widest text-[7px] sm:text-[8px]">TripAdvisor</span>
                </div>
                <span className="text-base sm:text-lg font-black text-brand-text tracking-tight mb-0.5">
                  {(platformStats.tripadvisor.total / (platformStats.tripadvisor.count || 1)).toFixed(1)} / 5.0
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  {platformStats.tripadvisor.count}+ reviews
                </span>
              </a>

              {/* Google */}
              <a 
                href="https://www.google.com/maps/place/Sai+Bali+Tour/@-8.8211618,115.1929236,17z/data=!4m8!3m7!1s0x2dd2434284a1f56b:0x80b2e22013691a68!8m2!3d-8.8211618!4d115.1929236!9m1!1b1!16s%2Fg%2F11h6t70xn6?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group p-5 sm:p-6 rounded-[2rem] border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-500 flex flex-col items-center"
              >
                <div className="flex items-center space-x-2 text-blue-600 mb-2 sm:mb-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  <span className="font-black uppercase tracking-widest text-[7px] sm:text-[8px]">Google</span>
                </div>
                <span className="text-base sm:text-lg font-black text-brand-text tracking-tight mb-0.5">
                  {(platformStats.google.total / (platformStats.google.count || 1)).toFixed(1)} / 5.0
                </span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  {platformStats.google.count}+ reviews
                </span>
              </a>
            </div>

            {/* Total Reviews Summary */}
            <div className="mt-6 sm:mt-8">
              <div className="inline-flex items-center space-x-3 bg-brand-anchor/5 px-5 sm:px-6 py-2 sm:py-3 rounded-full">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} sm:size={12} className="text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <span className="w-px h-3 bg-gray-200"></span>
                <span className="text-[8px] sm:text-[9px] font-black text-brand-text uppercase tracking-widest">
                  {averageRating}/5 from {reviews.length}+ verified guests
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Load More / Show Less Buttons - Now at the very bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 sm:mt-16 lg:mt-20">
          {visibleCount < reviews.length && (
            <button 
              onClick={handleLoadMore}
              className="group relative flex items-center space-x-4 bg-brand-text text-white px-10 py-5 rounded-[2rem] shadow-2xl hover:bg-brand-orange transition-all duration-500 active:scale-95"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Read more chapters</span>
            </button>
          )}
          
          {visibleCount > 3 && showVerifiedSection && (
            <button 
              onClick={handleShowLess}
              className="group relative flex items-center space-x-4 bg-white text-brand-text border-2 border-gray-100 px-10 py-5 rounded-[2rem] shadow-lg hover:border-brand-orange hover:text-brand-orange transition-all duration-500 active:scale-95"
            >
              <Minus size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Show less</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewStrip;