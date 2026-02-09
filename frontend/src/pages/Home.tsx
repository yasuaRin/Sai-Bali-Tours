import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { CuratedTour, Testimonial } from '../types';
import { tourService } from '../services/tourService';
import { testimonialService } from '../services/testimonialService';
import { useSourceTracking } from '../hooks/useSourceTracking';

export default function Home() {
  useSourceTracking();
  
  const [curatedTours, setCuratedTours] = useState<CuratedTour[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tours, testimonials] = await Promise.all([
          tourService.getCuratedTours(),
          testimonialService.getFeaturedTestimonials()
        ]);
        setCuratedTours(tours);
        setTestimonials(testimonials);
      } catch (error) {
        console.error('Error fetching ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-purple-600 text-xl">Loading Bali experiences...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Bali Tours & Travel | Authentic Experiences Since 2008</title>
        <meta name="description" content="Premium Bali tours crafted by local experts. Private, flexible, and deeply authentic experiences since 2008." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(https://images.unsplash.com/photo-1537996119755-2f1655c50c8c?auto=format&fit=crop&w=1920&q=80)' 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-indigo-900/90" />
          </div>
          <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Discover the Soul of Bali
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Intimate journeys crafted by local experts since 2008
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/tours" 
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition text-lg shadow-lg"
              >
                Explore Tours
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
              >
                Our Story
              </Link>
            </div>
          </div>
        </section>

        {/* The Difference Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-16">The Bali Tours Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-600 font-bold text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Authentic Roots</h3>
                <p className="text-gray-600">Born and raised in Ubud, our guides share Bali through local eyes, not tourist brochures.</p>
              </div>
              <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-600 font-bold text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Private Comfort</h3>
                <p className="text-gray-600">Maximum 8 guests per tour. Your pace, your itinerary, your sanctuary.</p>
              </div>
              <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-600 font-bold text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Flexible Pace</h3>
                <p className="text-gray-600">No rigid schedules. We adapt to your rhythm, from dawn temple visits to sunset cocktails.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Showcases */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-16">Curated Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {curatedTours.map((item) => (
                <Link 
                  key={item.tour_id} 
                  to={`/tours/${item.tour_slug}`}
                  className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition group border border-gray-100"
                >
                  <div className="text-purple-600 font-semibold uppercase text-sm mb-4 flex items-center gap-2">
                    {item.category_vibe === 'adrenaline' ? (
                      <>
                        <span>🔥</span> Raw Thrills
                      </>
                    ) : item.category_vibe === 'serene' ? (
                      <>
                        <span>🧘</span> Serene Escape
                      </>
                    ) : item.category_vibe === 'cultural' ? (
                      <>
                        <span>🏮</span> Cultural Immersion
                      </>
                    ) : (
                      <>
                        <span>✨</span> Premium Experience
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition">
                    {item.tour_title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">{item.tour_short_description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-bold text-purple-600 text-lg">From ${item.tour_starting_price}</span>
                    <span className="text-purple-600 font-medium">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Strip */}
        <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Trusted by Travelers Worldwide</h2>
              <div className="flex gap-2 justify-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      <span className="text-purple-600 font-bold text-2xl">
                        {testimonial.author_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-bold text-lg">{testimonial.author_name}</h4>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{testimonial.author_location}</span>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-lg">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} PT. Bali Mertan Pertiwi. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}