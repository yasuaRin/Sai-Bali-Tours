import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { tourService } from '../services/tourService';
import { testimonialService } from '../services/testimonialService';
import HeroCarousel from '../components/HeroCarousel';
import ReviewStrip from '../components/ReviewStrip';
import CategoryShowcase from '../components/CategoryShowcase';
import ExperienceDiscovery from '../components/ExperienceDiscovery';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import VisualExperienceGallery from '../components/VisualExperienceGallery';

export default function Home() {
  const [tours, setTours] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tourData, testimonialData] = await Promise.all([
          tourService.getCuratedTours(),
          testimonialService.getFeaturedTestimonials()
        ]);
        setTours(tourData);
        setTestimonials(testimonialData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-orange text-xl font-bold">Loading Bali magic...</div>
      </div>
    );
  }

  // Helper function to get initial
  const getInitial = (name: string | undefined) => {
    return name?.charAt(0)?.toUpperCase() || 'G';
  };

  return (
    <>
      <Helmet>
        <title>Sai Bali Tours | Premium Bali Experience</title>
        <meta name="description" content="Authentic Bali tours crafted by local experts since 2008" />
      </Helmet>
      
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-brand-anchor text-white py-20 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
              Discover the Soul of Bali
            </h1>
            <p className="text-xl mb-8 opacity-90 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              Intimate journeys crafted by local experts since 2008
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <a href="/tours" className="bg-brand-orange hover:bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold transition">
                Explore Tours
              </a>
              <a href="/about" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition">
                Our Story
              </a>
            </div>
          </div>
        </section>

        {/* Tours Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-brand-text">Featured Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours?.map((tour) => (
                <div key={tour.tour_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="text-brand-orange font-bold mb-2">
                    {tour.category_vibe === 'adrenaline' ? '🔥 Adventure' : '✨ Experience'}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tour.tour_title || 'Bali Tour'}</h3>
                  <p className="text-gray-600 mb-4">{tour.tour_short_description || 'Experience the beauty of Bali'}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-brand-orange">
                      From ${tour.tour_starting_price || '99'}
                    </span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-brand-secondary/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-brand-text">Traveler Stories</h2>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center mr-3">
                      {/* FIXED LINE - Added optional chaining */}
                      <span className="text-white font-bold">
                        {getInitial(testimonial.author_name)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.author_name || 'Guest'}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.author_location || 'Bali, Indonesia'}
                      </p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">"{testimonial.content || 'Great experience!'}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}