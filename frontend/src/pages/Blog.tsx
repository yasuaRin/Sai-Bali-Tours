// src/pages/Blog.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Calendar, ChevronRight, Search, Tag, Filter, Clock, User } from 'lucide-react';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import { getHeroImage, getThumbnailImage } from '../utils/imageOptimizer';

const BUCKET_URL = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/blog';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getPublishedPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map(post => post.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (post.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = useMemo(() => {
    return posts.length > 0 ? posts[0] : null;
  }, [posts]);

  const getPrimaryImage = (post: BlogPost): string => {
    if (post.images && post.images.length > 0) {
      const primary = post.images.find(img => img.is_primary);
      return primary?.image_url || post.images[0].image_url;
    }
    if (post.image) return post.image;
    return `${BUCKET_URL}/fallback.jpg`;
  };

  const getOptimizedHeroImage = (post: BlogPost): string => {
    return getHeroImage(getPrimaryImage(post));
  };

  const getCategoryFromTitle = (title: string): string => {
    if (title.toLowerCase().includes('prepare') || title.toLowerCase().includes('things to know')) return 'Travel Tips';
    if (title.toLowerCase().includes('waterfall')) return 'Adventure';
    if (title.toLowerCase().includes('temple') || title.toLowerCase().includes('etiquette')) return 'Culture';
    if (title.toLowerCase().includes('sunset')) return 'Lifestyle';
    return 'Travel Tips';
  };

  const getReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(4, Math.ceil(wordCount / wordsPerMinute));
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

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-brand-orange animate-spin" />
          <p className="text-xs sm:text-sm text-gray-400">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-24 lg:py-32 overflow-hidden bg-brand-anchor">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#F28C33_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 sm:w-10 h-px bg-brand-orange/50"></div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-brand-orange">
                <Tag size={14} className="fill-current" />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em]">The Bali Journal</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85]">
              Island <br />
              <span className="text-brand-orange italic relative inline-block">
                Perspectives.
                <div className="absolute -bottom-2 sm:-bottom-3 md:-bottom-4 left-0 w-full h-1 sm:h-1.5 md:h-2 bg-brand-orange/20 blur-sm"></div>
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">
              Curated stories, local secrets, and professional guides to help you navigate the heart and soul of Bali.
            </p>
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="sticky top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-center justify-between">
            {/* Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1 lg:pb-0">
              <div className="flex items-center space-x-1 sm:space-x-2 pr-3 sm:pr-4 border-r border-gray-100 mr-2 sm:mr-3 shrink-0">
                <Filter size={14} className="text-gray-400" />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Filter</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                    selectedCategory === cat
                      ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                      : 'bg-white border-gray-100 text-gray-500 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 xl:w-96 group">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search the journal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-5 md:pr-6 py-2.5 sm:py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold focus:bg-white focus:border-brand-orange/20 focus:ring-0 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Featured Post — only shown when no search/filter active */}
          {searchQuery === '' && selectedCategory === 'All' && featuredPost && (
            <div className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 items-center">
                {/* Image */}
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="lg:col-span-7 relative group block"
                >
                  <div className="relative aspect-[16/10] md:aspect-[16/9] lg:aspect-square rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-xl sm:shadow-2xl bg-gray-100">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
                    <img
                      src={getOptimizedHeroImage(featuredPost)}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 relative z-10"
                      onError={(e) => { e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`; }}
                      loading="eager"
                      fetchpriority="high"
                    />
                    <div className="absolute inset-0 bg-brand-anchor/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  </div>
                  <div className="absolute -bottom-4 sm:-bottom-5 md:-bottom-6 -right-4 sm:-right-5 md:-right-6 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center leading-tight">Must<br/>Read</span>
                  </div>
                </Link>

                {/* Text */}
                <div className="lg:col-span-5 space-y-5 sm:space-y-6 md:space-y-8">
                  <div className="flex items-center space-x-3 sm:space-x-4 text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]">
                    <span>{getCategoryFromTitle(featuredPost.title)}</span>
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-orange/20"></span>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Clock size={12} />
                      <span>{getReadTime(featuredPost.content)} Min Read</span>
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-text tracking-tighter leading-[0.95] hover:text-brand-orange transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500 font-medium leading-relaxed">
                    {featuredPost.excerpt || featuredPost.content.substring(0, 150) + '...'}
                  </p>
                  <div className="pt-2 sm:pt-3 md:pt-4">
                    <Link to={`/blog/${featuredPost.slug}`} className="group flex items-center space-x-4 sm:space-x-5 md:space-x-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-brand-anchor flex items-center justify-center text-white group-hover:bg-brand-orange transition-colors duration-300 shadow-xl">
                        <ArrowRight size={22} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Continue Reading</span>
                        <span className="text-xs sm:text-sm font-black text-brand-text">Full Article</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {filteredPosts.length > 0 ? (
              filteredPosts
                .filter(post => searchQuery !== '' || selectedCategory !== 'All' || (featuredPost && post.id !== featuredPost.id))
                .slice(0, visibleCount)
                .map((post, idx) => (
                  // ✅ THE FIX: Entire card is now wrapped in a Link
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col h-full animate-fadeInUp"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 sm:mb-8 md:mb-10 shadow-md sm:shadow-lg bg-gray-100">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
                      <img
                        src={getThumbnailImage(getPrimaryImage(post))}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 relative z-10"
                        onError={(e) => { e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`; }}
                        loading="lazy"
                        width="400"
                        height="300"
                      />
                      <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-20">
                        <span className="px-3 sm:px-4 py-1 sm:py-1.5 md:py-2 bg-white/90 backdrop-blur-md text-brand-text rounded-full text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                          {getCategoryFromTitle(post.title)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow space-y-4 sm:space-y-5 md:space-y-6">
                      <div className="flex items-center justify-between text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Calendar size={10} className="text-brand-orange" />
                          <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Clock size={10} className="text-brand-orange" />
                          <span>{getReadTime(post.content)} Min</span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-brand-text tracking-tight group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed line-clamp-3 font-medium">
                        {post.excerpt || post.content.substring(0, 120) + '...'}
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-5 md:pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          <User size={14} className="text-brand-orange" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400">Written By</span>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-black text-brand-text">Sai Bali Team</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-gray-100 flex items-center justify-center text-brand-anchor group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="col-span-full py-20 sm:py-24 md:py-32 text-center">
                <div className="max-w-md mx-auto space-y-6 sm:space-y-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                    <Search size={28} className="text-gray-300" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-text tracking-tight">No results found</h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">We couldn't find any articles matching your current search or filters.</p>
                  </div>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-brand-anchor text-white rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-brand-orange transition-all shadow-lg sm:shadow-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Load More */}
          {visibleCount < filteredPosts.length && (
            <div className="flex justify-center mt-12 sm:mt-16 md:mt-20">
              <button
                onClick={handleLoadMore}
                className="group inline-flex items-center space-x-2 bg-brand-text text-white px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-full text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-brand-orange transition-all duration-500 shadow-lg sm:shadow-xl"
              >
                <span>Load More Articles</span>
                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Post Count */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-4 sm:mt-5 md:mt-6 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Showing {Math.min(visibleCount, filteredPosts.length)} of {filteredPosts.length} articles
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-orange rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20 relative overflow-hidden shadow-xl sm:shadow-2xl">
            <div className="absolute top-0 right-0 w-40 sm:w-48 md:w-56 lg:w-64 h-40 sm:h-48 md:h-56 lg:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl sm:blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                  Stay in the <br />
                  <span className="italic opacity-80">Bali Loop.</span>
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-medium max-w-md leading-relaxed">
                  Join our monthly newsletter for exclusive travel guides, seasonal deals, and local stories delivered straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 sm:px-6 md:px-7 lg:px-8 py-3 sm:py-3.5 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl bg-white border-none text-xs sm:text-sm font-bold focus:ring-4 focus:ring-white/20 transition-all"
                />
                <button className="px-6 sm:px-7 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 bg-brand-anchor text-white rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-all shadow-lg sm:shadow-xl whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;