// src/pages/Home.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Star, ShieldCheck, Calendar, ArrowUpRight } from 'lucide-react';
import { 
  getFeaturedTourPerCategory,
  getPopularTours,
  getPackages 
} from '../services/tourService';
import { blogService } from '../services/blogService';
import type { Tour, Package } from '../services/tourService';
import type { BlogPost } from '../types';

import HeroCarousel from '../components/HeroCarousel';
import ReviewStrip from '../components/ReviewStrip';
import TourCard from '../components/TourCard';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [signatureTours, setSignatureTours] = useState<Tour[]>([]);
  const [featuredPackage, setFeaturedPackage] = useState<Package | null>(null);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  const featuredHomePost = useMemo(() => {
    return latestPosts.length > 0 ? latestPosts[0] : null;
  }, [latestPosts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          signatureData,
          packagesData,
          blogData
        ] = await Promise.all([
          getFeaturedTourPerCategory(),
          getPackages(),
          blogService.getLatestPosts(1)
        ]);

        setSignatureTours(signatureData);
        setLatestPosts(blogData);
        if (packagesData.length > 0) setFeaturedPackage(packagesData[0]);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-brand-orange animate-spin" />
          <div className="space-y-1 text-center">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] text-brand-anchor">Sai Bali Tours</p>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">Curating your tropical journey...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 bg-white">
      <HeroCarousel />

      {/* Signature Tours Section */}
      {signatureTours.length > 0 && (
        <section id="signature-tours" className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-b from-white to-gray-50/30 relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] xs:text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] xl:text-[14rem] font-serif text-brand-orange/[0.03] select-none pointer-events-none whitespace-nowrap rotate-12"
            aria-hidden="true"
          >
            ᬲᬿ ᬩᬮᬶ
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-brand-text tracking-tighter leading-[0.85]">
                  Signature <br />
                  <span className="text-brand-orange italic relative inline-block">
                    Experiences.
                    <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 w-full h-1 sm:h-1.5 md:h-2 bg-brand-orange/20 blur-sm"></div>
                    <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 w-full h-3 sm:h-4 md:h-5 bg-orange-300/30 blur-md"></div>
                  </span>
                </h2>
                <div className="pt-4 sm:pt-5 md:pt-6">
                  <span className="text-xs sm:text-sm md:text-base text-gray-400 font-medium block">
                    Our most requested itineraries for the current season
                  </span>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 md:mt-10">
                <Link
                  to="/tour/category/all"
                  className="inline-flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-brand-anchor font-black text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest group border-b-2 border-brand-anchor/10 pb-1 sm:pb-2 hover:border-brand-orange transition-all"
                >
                  <span>Browse Full Catalog</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
              {signatureTours.map((tour, idx) => (
                <div key={tour.id} className="relative group animate-fadeInUp" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-orange border border-gray-100 shadow-md sm:shadow-xl z-10 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <div className="transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rounded-2xl sm:group-hover:rounded-3xl">
                    <TourCard tour={tour} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog & Insights Section */}
      {featuredHomePost && (
        <section className="py-12 md:py-16 lg:py-20 bg-brand-anchor relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/[0.02] -skew-x-12 translate-x-1/4"></div>
          <div className="absolute top-1/2 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-brand-orange/10 rounded-full blur-[100px] md:blur-[150px] -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-white/5 rounded-full blur-[80px] md:blur-[100px] translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 lg:mb-20 space-y-6 sm:space-y-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85] relative">
                Island <br />
                <span className="text-brand-orange italic relative inline-block">
                  Insights
                  <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 w-full h-1 sm:h-1.5 md:h-2 bg-brand-orange/20 blur-sm"></div>
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
                Beyond tourist spots, our editors uncover Bali's true culture, safety, and hidden sides.
              </p>
            </div>

            <div className="max-w-5xl mx-auto relative">
              <div className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 hidden xl:block">
                <div className="vertical-text text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.8em] lg:tracking-[1em] text-white/10 select-none whitespace-nowrap">
                  Editorial Selection • Editorial Selection
                </div>
              </div>

              <div className="group cursor-pointer animate-fadeIn relative">
                <div className="absolute -inset-3 sm:-inset-4 bg-brand-orange/20 rounded-[2rem] sm:rounded-[3rem] blur-2xl sm:blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <Link
                  to={`/blog/${featuredHomePost.slug}`}
                  className="block relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-white/10 bg-brand-anchor"
                >
                  <img
                    src={featuredHomePost.image || `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/website-assets/blog/default-cover.png`}
                    alt={featuredHomePost.title}
                    className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor via-brand-anchor/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700"></div>
                  <div className="absolute inset-0 bg-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-20">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-black uppercase tracking-widest shadow-2xl rotate-2 sm:rotate-3 group-hover:rotate-0 transition-transform duration-500 flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-brand-orange rounded-full animate-pulse"></div>
                      <span>Latest Insight</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 md:p-8 lg:p-12 xl:p-16 z-10">
                    <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.35em] lg:tracking-[0.4em]">
                        <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-brand-orange text-white rounded-full shadow-lg shadow-brand-orange/20">
                          {featuredHomePost.category || 'Article'}
                        </span>
                        <span className="text-white/60 flex items-center space-x-1 sm:space-x-2">
                          <Calendar size={10} />
                          <span>
                            {new Date(featuredHomePost.published_at || featuredHomePost.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white tracking-tighter leading-[0.85] group-hover:text-brand-orange transition-colors duration-500 line-clamp-2 sm:line-clamp-3">
                        {featuredHomePost.title}
                      </h3>

                      <div className="pt-2 sm:pt-3 md:pt-4 lg:pt-6 xl:pt-8 flex items-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 text-white font-black text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs uppercase tracking-widest group/btn">
                          <span className="border-b-2 border-brand-orange/50 pb-0.5 sm:pb-1 md:pb-1.5 lg:pb-2 group-hover/btn:border-brand-orange transition-colors">
                            Read Full Story
                          </span>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-brand-orange group-hover/btn:border-brand-orange transition-all duration-500 shadow-xl">
                            <ArrowUpRight size={10} className="text-brand-orange group-hover/btn:text-white group-hover/btn:rotate-45 transition-transform" />
                          </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-3 text-white/40 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">
                          <div className="w-4 sm:w-5 md:w-6 lg:w-8 h-px bg-white/20"></div>
                          <span>5 Min Read</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </Link>
              </div>

              <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 border-t border-white/5 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8">
                  <div className="flex -space-x-1.5 sm:-space-x-2 md:-space-x-2.5 lg:-space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full border-2 border-brand-anchor overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] font-bold uppercase tracking-widest">
                    Joined by <span className="text-white">1,200+</span> readers this week
                  </p>
                </div>

                <Link
                  to="/blog"
                  className="group/all flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-4 bg-white/5 hover:bg-brand-orange px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 xl:py-4 rounded-xl sm:rounded-2xl border border-white/10 hover:border-brand-orange transition-all duration-500"
                >
                  <span className="text-white text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-black uppercase tracking-widest">
                    Explore Journal Archive
                  </span>
                  <ArrowRight size={12} className="text-brand-orange group-hover/all:text-white group-hover/all:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Package Section */}
      {featuredPackage && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-white overflow-hidden border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center">

              {/* Image Column */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute -top-6 sm:-top-8 md:-top-10 -left-6 sm:-left-8 md:-left-10 w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-28 sm:h-32 md:h-40 lg:h-48 xl:h-56 bg-brand-orange/5 rounded-full blur-[40px] sm:blur-[50px] md:blur-[60px] lg:blur-[80px]"></div>
                <div className="relative group rounded-2xl sm:rounded-3xl md:rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[450px] xl:h-[500px] 2xl:h-[600px]">
                  <img
                    src={featuredPackage.image}
                    alt={featuredPackage.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] sm:duration-[2s] md:duration-[3s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-3 sm:left-4 md:left-5 lg:left-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl text-white">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1 text-brand-accent">
                        <ShieldCheck size={12} />
                        <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px] font-black uppercase tracking-widest">Full Concierge</span>
                      </div>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs font-medium text-white/80">
                        Private vehicle, driver, and hotel inclusions standard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-10 order-1 lg:order-2">
                <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                  <div className="flex items-center space-x-2 text-brand-orange">
                    <Star size={12} fill="currentColor" />
                    <span className="text-brand-orange font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] md:tracking-[0.4em] text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px]">
                      Featured Service
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-brand-text tracking-tighter leading-none">
                    Luxury Stay & <br />
                    <span className="text-brand-orange italic">Tour Package.</span>
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-xl">
                    Experience the ultimate Bali getaway. Our stay-and-tour bundles handle everything from airport pickup to your private pool villa and custom day trips.
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] xl:rounded-[3rem] border border-gray-100 shadow-md sm:shadow-lg md:shadow-xl lg:shadow-2xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-brand-text mb-0.5 sm:mb-1 tracking-tight">
                        {featuredPackage.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-brand-orange text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest">
                        <Calendar size={10} />
                        <span>{featuredPackage.duration_nights} Nights / {featuredPackage.duration_days} Days</span>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <span className="block text-[6px] sm:text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                        Price From
                      </span>
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-brand-orange">
                        ${featuredPackage.price_estimate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link
                      to="/packages"
                      className="flex-1 flex items-center justify-center space-x-2 bg-brand-anchor text-white py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-black text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-md group"
                    >
                      <span>Full Details</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link><a
                    
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in the " + featuredPackage.title + " package.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-brand-orange text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-brand-anchor transition-all shadow-md"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ReviewStrip />
    </div>
  );
};

export default Home;