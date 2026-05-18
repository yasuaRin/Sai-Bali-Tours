// src/components/HeroCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHeroImage } from '../utils/imageOptimizer';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    image: 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/hero/balinese-welcome-hospitality.png',
    title: 'Welcome to',
    subtitle: 'Sai Bali Tours',
    aksara: 'ᬲᬿ ᬩᬮᬶ ᬢᭀᬉᬃᬲ᭄',
    desc: 'Your Satisfaction is Our Priority',
    alt: 'Balinese women in traditional kebaya and sarong offering a warm welcome with prayer offerings - authentic cultural hospitality in Bali'
  },
  {
    image: 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/hero/private-tour-bali.png',
    title: '100% Private',
    subtitle: 'Expeditions',
    desc: 'Forget crowded buses. Experience Bali in the comfort of your own private, air-conditioned premium vehicle with a personal chauffeur who caters to your pace.',
    alt: 'Private luxury air-conditioned vehicle with personal chauffeur driving through lush Balinese jungle - exclusive private tour experience'
  },
  {
    image: 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/hero/kecak-dance.jpg',
    title: 'Bespoke',
    subtitle: 'Itinerary Design',
    desc: 'Your time is precious. We craft unique paths that skip the tourist traps, allowing you to experience the authentic heartbeat of Bali on your own terms.',
    alt: 'Balinese men performing traditional Kecak fire dance with intricate hand movements and ceremonial attire at Uluwatu Temple'
  },
  {
    image: 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/hero/balinese-lifting-offerings.jpg',
    title: 'The Soul of',
    subtitle: 'Real Bali',
    desc: 'From secret waterfalls to sacred ceremonies, we open doors that others cannot, sharing deep cultural heritage passed through generations.',
    alt: 'Balinese women gracefully carrying towering fruit and flower offerings (banten) on their heads during a temple ceremony - authentic cultural tradition'
  }
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSignature = () => {
    const element = document.getElementById('signature-tours');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative h-[60vh] xs:h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-screen w-full bg-brand-anchor overflow-hidden">
      {slides.map((slide, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${
            idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          {/* Image with responsive opacity */}
          <img 
            src={getHeroImage(slide.image)}
            className="w-full h-full object-cover opacity-60 xs:opacity-65 sm:opacity-70 md:opacity-75" 
            alt={slide.alt} 
            loading={idx === 0 ? "eager" : "lazy"}
          />
          
          {/* Gradient overlay - responsive */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-anchor/20 xs:from-brand-anchor/25 sm:from-brand-anchor/30 via-transparent to-brand-anchor/40 xs:to-brand-anchor/45 sm:to-brand-anchor/50"></div>
          
          {/* Content container - fully responsive */}
          <div className="absolute inset-0 flex items-center justify-center px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10">
            <div className="w-full max-w-4xl xs:max-w-5xl sm:max-w-6xl mx-auto text-center space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              
              {/* Title and subtitle - responsive text sizes */}
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                <div className="space-y-1 xs:space-y-2">
                  <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tighter uppercase opacity-0 animate-fadeInUp">
                    {slide.title}
                  </h2>
                  <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-brand-orange italic drop-shadow-2xl uppercase tracking-tighter leading-none opacity-0 animate-fadeInUp delay-150">
                    {slide.subtitle}
                  </h1>
                </div>
                
                {/* Aksara script - responsive size and spacing */}
                {slide.aksara && (
                  <div className="animate-fadeIn delay-300">
                    <span className="text-white/30 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-serif tracking-[0.5rem] xs:tracking-[0.75rem] sm:tracking-[1rem] block py-1 xs:py-2">
                      {slide.aksara}
                    </span>
                  </div>
                )}

                {/* USP tag - responsive */}
                <div className="flex items-center justify-center pt-1 xs:pt-2 animate-fadeIn delay-500">
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-brand-orange uppercase tracking-[0.3em] xs:tracking-[0.4em] sm:tracking-[0.5em] drop-shadow-md">
                    {slide.usp}
                  </span>
                </div>
              </div>
              
              {/* Description - responsive */}
              <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-100 max-w-lg xs:max-w-xl sm:max-w-2xl mx-auto font-medium leading-relaxed px-2 xs:px-4 opacity-0 animate-fadeInUp delay-300">
                {slide.desc}
              </p>

              {/* CTA Button - responsive */}
              <div className="flex items-center justify-center pt-2 xs:pt-3 sm:pt-4 opacity-0 animate-fadeInUp delay-500">
                <button 
                  onClick={scrollToSignature}
                  className="inline-flex items-center space-x-2 xs:space-x-3 sm:space-x-4 bg-brand-orange text-white px-4 xs:px-5 sm:px-6 md:px-7 lg:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-xl xs:rounded-xl sm:rounded-2xl font-black text-xs xs:text-sm sm:text-base hover:bg-orange-600 shadow-lg xs:shadow-xl transition-all hover:-translate-y-1 sm:hover:-translate-y-2 active:scale-95 group"
                >
                  <span>Begin Your Journey</span>
                  <ArrowRight size={16} xs:size={18} sm:size={20} className="group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators - responsive */}
      <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 xs:space-x-3 sm:space-x-4 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-700 rounded-full ${
              idx === current 
                ? 'w-6 xs:w-8 sm:w-10 md:w-12 bg-brand-orange shadow-md xs:shadow-lg' 
                : 'w-1.5 xs:w-2 sm:w-2.5 md:w-3 bg-white/20 hover:bg-white/40'
            } h-1 xs:h-1.5 sm:h-2`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;