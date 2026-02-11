import React, { useState, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';

// Define type locally
interface GalleryImage {
  url: string;
  title: string;
  alt_text?: string;
}

const VisualExperienceGallery: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use hardcoded images since getGalleryImages doesn't exist
    const defaultImages: GalleryImage[] = [
      { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80', title: 'Water Temple' },
      { url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80', title: 'Volcano Sunrise' },
      { url: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?auto=format&fit=crop&w=400&q=80', title: 'Rice Terraces' },
      { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80', title: 'Beach Sunset' },
      { url: 'https://images.unsplash.com/photo-1552465011-b4e30bf7349d?auto=format&fit=crop&w=400&q=80', title: 'Monkey Forest' },
      { url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80', title: 'Traditional Dance' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80', title: 'Jungle Adventure' },
      { url: 'https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=400&q=80', title: 'Balinese Culture' },
      { url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=400&q=80', title: 'Island Life' },
      { url: 'https://images.unsplash.com/photo-1516496636080-14fb876e029d?auto=format&fit=crop&w=400&q=80', title: 'Tropical Paradise' }
    ];
    
    // Simulate loading delay
    setTimeout(() => {
      setGalleryImages(defaultImages);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Loader2 className="animate-spin mx-auto text-brand-orange" size={32} />
          <p className="mt-4 text-gray-500">Loading gallery...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-2">The Lens of Bali</div>
        <h2 className="text-2xl sm:text-4xl font-black text-brand-text">Capture the <span className="text-brand-orange italic">Moment.</span></h2>
      </div>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              className={`group relative overflow-hidden rounded-[1rem] bg-gray-100 cursor-pointer ${
                idx === 0 || idx === 7 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'
              }`}
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={img.title} 
              />
              <div className="absolute inset-0 bg-brand-anchor/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white transform scale-50 group-hover:scale-100 transition-all">
                  <Camera size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisualExperienceGallery;