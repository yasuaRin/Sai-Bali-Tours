import React, { useEffect, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { getGalleryImages } from '../services/tourService';

const VisualExperienceGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getGalleryImages()
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const fallbackImage = 'https://hocwvwfsvgycpjlwgiby.supabase.co/storage/v1/object/public/website-assets/fallback.jpg';

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="py-12 sm:py-16 md:py-20 text-center">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 animate-spin mx-auto text-brand-orange" />
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-orange/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <Camera size={12} sm:size={14} className="text-brand-orange" />
            <span className="text-brand-orange font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] md:tracking-[0.4em] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px]">
              The Lens of Bali
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-brand-text">
            Capture the <span className="text-brand-orange italic">Moment.</span>
          </h2>
        </div>

        {/* Gallery Grid - Fully Responsive */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1 sm:gap-1.5 md:gap-2 max-w-5xl mx-auto">
          {images.slice(0, 10).map((img, idx) => {
            // Determine column span based on position for visual interest
            let colSpan = 'col-span-1';
            if (idx === 0 || idx === 7) {
              colSpan = 'col-span-2 row-span-2';
            } else if (idx === 3 || idx === 5) {
              colSpan = 'col-span-2 sm:col-span-1';
            }

            return (
              <div 
                key={img.id || idx}
                className={`group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 cursor-pointer ${colSpan} aspect-square`}
              >
                <img 
                  src={imageErrors[idx] ? fallbackImage : img.url} 
                  className="w-full h-full object-cover transition-transform duration-500 sm:duration-700 group-hover:scale-110" 
                  alt={img.title || 'Bali experience'}
                  onError={() => handleImageError(idx)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-anchor/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-full text-white transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <Camera size={12} sm:size={14} md:size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Link */}
        {images.length > 10 && (
          <div className="text-center mt-6 sm:mt-8 md:mt-10">
            <button className="inline-flex items-center space-x-2 text-brand-orange font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:underline">
              <span>View Full Gallery</span>
              <Camera size={10} sm:size={11} md:size={12} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VisualExperienceGallery;