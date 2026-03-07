// src/pages/BlogDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Calendar, ArrowLeft, Share2, User, Clock, MessageCircle, Maximize2, CheckCircle2, ArrowRight } from 'lucide-react';
import { blogService } from '../services/blogService';
import type { BlogPost, BlogImage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const BUCKET_URL = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/blog';

// Define the InteractivePoint type
interface InteractivePoint {
  title: string;
  description: string;
  image: string;
}

// Extend BlogPost type to include interactive_points
interface ExtendedBlogPost extends BlogPost {
  interactive_points?: string | InteractivePoint[] | null;
}

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ExtendedBlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [completedPoints, setCompletedPoints] = useState<Set<number>>(new Set());
  const [interactivePoints, setInteractivePoints] = useState<InteractivePoint[]>([]);

  // Check if this is the Nyepi blog (id: 2)
  const isNyepiBlog = post?.id === 2;

  useEffect(() => {
    if (!loading && post) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [loading, post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current post and all posts in parallel
        const [currentPost, allPostsData] = await Promise.all([
          slug ? blogService.getPostBySlug(slug) : Promise.resolve(null),
          blogService.getPublishedPosts()
        ]);
        
        setPost(currentPost as ExtendedBlogPost);
        setAllPosts(allPostsData);
        
        // Parse interactive_points if it exists and is a string
        if (currentPost) {
          const points = (currentPost as any).interactive_points;
          if (points) {
            try {
              // If it's a string, parse it; if it's already an array, use it directly
              const parsedPoints = typeof points === 'string' ? JSON.parse(points) : points;
              setInteractivePoints(parsedPoints);
            } catch (e) {
              console.error('Error parsing interactive points:', e);
              setInteractivePoints([]);
            }
          } else {
            setInteractivePoints([]);
          }
        }
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const togglePoint = (idx: number) => {
    const newSet = new Set(completedPoints);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCompletedPoints(newSet);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCoverImage = (): BlogImage | undefined => {
    return post?.images?.find(img => img.is_primary === true);
  };

  const getSectionImages = (): BlogImage[] => {
    if (!post?.images) return [];
    return post.images
      .filter(img => img.is_primary !== true)
      .sort((a, b) => a.sequence - b.sequence);
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

  const getRelatedPosts = (): BlogPost[] => {
    if (!post || allPosts.length === 0) return [];
    
    const currentCategory = getCategoryFromTitle(post.title);
    
    // Find posts with similar category, excluding current post
    const related = allPosts
      .filter(p => p.id !== post.id)
      .filter(p => getCategoryFromTitle(p.title) === currentCategory)
      .slice(0, 3);
    
    // If not enough related posts by category, add recent posts
    if (related.length < 3) {
      const remaining = 3 - related.length;
      const recent = allPosts
        .filter(p => p.id !== post.id && !related.some(r => r.id === p.id))
        .slice(0, remaining);
      return [...related, ...recent];
    }
    
    return related;
  };

  const getPrimaryImage = (post: BlogPost): string => {
    if (post.images && post.images.length > 0) {
      const primary = post.images.find(img => img.is_primary);
      return primary?.image_url || post.images[0].image_url;
    }
    if (post.image) return post.image;
    return `${BUCKET_URL}/fallback.jpg`;
  };

  const formatContent = (content: string) => {
    if (!content) return null;
    
    const sections = content.split(/(?=\d+\.\s+)/g);
    const sectionImages = getSectionImages();
    let imageIndex = 0;
    
    return sections.map((section, index) => {
      const numberMatch = section.match(/^(\d+)\.\s+(.*?)(?=\n|$)/s);
      
      if (numberMatch) {
        const sectionNumber = parseInt(numberMatch[1]);
        const sectionImage = sectionImages[imageIndex];
        
        if (sectionImages.length > imageIndex) {
          imageIndex++;
        }
        
        const title = numberMatch[2].split('\n')[0];
        const restContent = section.substring(numberMatch[0].length);
        
        return (
          <div key={index} className="mb-10 sm:mb-12 md:mb-16 last:mb-0">
            {/* Section Title with Number */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-brand-orange text-white font-black text-base sm:text-lg md:text-xl shrink-0">
                {sectionNumber}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-text flex-1 leading-tight">
                {formatBoldText(title)}
              </h2>
            </div>
            
            {/* Section Image */}
            {sectionImage && (
              <div className="flex justify-center my-8">
                <div className="relative group cursor-pointer w-full max-w-[400px]" onClick={() => setSelectedImage(sectionImage.image_url)}>
                  <div className="relative bg-white p-3 pb-6 rounded-2xl shadow-lg border border-gray-100 w-full">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
                      <img 
                        src={sectionImage.image_url}
                        alt={sectionImage.alt_text || `Section ${sectionNumber}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`;
                        }}
                      />
                    </div>
                    
                    <button 
                      className="absolute bottom-10 right-5 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 hover:bg-brand-orange hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(sectionImage.image_url);
                      }}
                    >
                      <Maximize2 size={14} />
                    </button>
                    
                    {sectionImage.caption && (
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-3 italic text-center px-2 font-medium line-clamp-2">
                        {sectionImage.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Section Content */}
            <div className="pl-10 sm:pl-11 md:pl-14">
              {restContent.split('\n').map((line, lineIdx) => {
                if (!line.trim()) return null;
                
                if (line.trim().startsWith('-')) {
                  const bulletContent = line.trim().substring(1).trim();
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-orange mt-2 sm:mt-2.5 shrink-0" />
                      <h3 className="text-sm sm:text-base text-gray-500 leading-relaxed flex-1">
                        {formatBoldText(bulletContent)}
                      </h3>
                    </div>
                  );
                }
                
                if (line.includes(':')) {
                  const parts = line.split(':');
                  return (
                    <p key={lineIdx} className="text-sm sm:text-base text-gray-500 leading-relaxed mb-2 sm:mb-3">
                      <span className="font-black text-brand-text">{parts[0]}:</span>
                      {formatBoldText(parts.slice(1).join(':'))}
                    </p>
                  );
                }
                
                return (
                  <p key={lineIdx} className="text-sm sm:text-base text-gray-500 leading-relaxed mb-2 sm:mb-3">
                    {formatBoldText(line)}
                  </p>
                );
              })}
            </div>
          </div>
        );
      }
      
      // Introduction text
      return (
        <div key={index} className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-500 font-bold leading-relaxed">
          {section.split('\n').map((line, lineIdx) => {
            if (!line.trim()) return null;
            return (
              <p key={lineIdx} className="mb-3 sm:mb-4">
                {formatBoldText(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const formatBoldText = (text: string) => {
    if (!text) return text;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={index} className="font-black text-brand-text">{part.slice(2, -2)}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const coverImage = getCoverImage();
  const relatedPosts = getRelatedPosts();
  const readTime = post ? getReadTime(post.content) : 0;
  const category = post ? getCategoryFromTitle(post.title) : '';
  const sectionImages = getSectionImages();

  if (loading) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-xl sm:text-2xl font-black mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-brand-orange hover:underline text-sm sm:text-base">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Special layout for Nyepi blog (id: 2) - keeping only the hero background
  if (isNyepiBlog) {
    return (
      <div className="pt-20 sm:pt-24 bg-white">
        {/* Hero Section - Nyepi Special Background (kept) */}
        <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] flex items-end overflow-hidden bg-brand-anchor">
          <div className="absolute inset-0 z-0">
            <img 
              src={coverImage?.image_url || getPrimaryImage(post)} 
              alt={post.title} 
              className="w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor via-brand-anchor/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 md:px-6 pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
            <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]">
                <span>Culture</span>
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-orange/40"></span>
                <div className="flex items-center space-x-1 sm:space-x-2 text-white/60">
                  <Clock size={12} />
                  <span>{readTime} Min Read</span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.95] max-w-4xl">
                {post.title}
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-medium max-w-2xl">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 pt-2 sm:pt-3 md:pt-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <User size={16} className="text-brand-orange" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40">Written By</span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-black text-white">Sai Bali Team</span>
                  </div>
                </div>
                <div className="h-5 sm:h-6 md:h-7 lg:h-8 w-px bg-white/10"></div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Calendar size={16} className="text-brand-orange" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40">Published</span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-black text-white">{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section - Using the same layout as first blog */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-600 leading-relaxed space-y-6 sm:space-y-8 text-base sm:text-lg md:text-xl font-medium">
                {formatContent(post.content)}
              </div>
            </div>
          </div>
        </section>

        {/* Related Stories Section */}
        {relatedPosts.length > 0 && (
          <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-text text-center mb-10 sm:mb-12 md:mb-16">
                Related Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {relatedPosts.map(related => (
                  <Link 
                    key={related.id} 
                    to={`/blog/${related.slug}`} 
                    className="group block transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-100"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={getPrimaryImage(related)} 
                        alt={related.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`;
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-brand-text rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                          {getCategoryFromTitle(related.title)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-6 md:p-7 bg-white">
                      <div className="flex items-center justify-between mb-3 text-[7px] sm:text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Calendar size={8} sm:size={10} md:size={12} className="text-brand-orange" />
                          <span>{formatDate(related.published_at || related.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Clock size={8} sm:size={10} md:size={12} className="text-brand-orange" />
                          <span>{getReadTime(related.content)} Min</span>
                        </div>
                      </div>

                      <h4 className="text-base sm:text-lg md:text-xl font-black text-brand-text group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight mb-3">
                        {related.title}
                      </h4>
                      
                      <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-3 mb-4">
                        {related.excerpt || related.content.substring(0, 100) + '...'}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                            <User size={10} sm:size={12} className="text-brand-orange" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-widest text-gray-400">Written By</span>
                            <span className="text-[7px] sm:text-[8px] font-black text-brand-text">Sai Bali Team</span>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-brand-anchor group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all">
                          <ArrowRight size={10} sm:size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-10 sm:mt-12 md:mt-14">
                <Link 
                  to="/blog" 
                  className="inline-block px-8 sm:px-10 py-3 sm:py-4 border-2 border-brand-anchor text-brand-anchor rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-brand-anchor hover:text-white transition-all"
                >
                  View All Stories
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Share Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 flex justify-center space-x-4 lg:hidden z-50">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.excerpt || 'Check out this article',
                  url: window.location.href,
                });
              }
            }}
            className="flex-1 max-w-[200px] flex items-center justify-center space-x-2 bg-brand-orange text-white py-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-brand-orange/90"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
          <button className="flex-1 max-w-[200px] flex items-center justify-center space-x-2 bg-brand-anchor text-white py-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-brand-anchor/90">
            <MessageCircle size={14} />
            <span>Comment</span>
          </button>
        </div>

        {/* Image Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-4xl">&times;</span>
            </button>
            <img 
              src={selectedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain animate-in zoom-in duration-500"
            />
          </div>
        )}
      </div>
    );
  }

  // Default layout for all other blogs
  return (
    <div className="pt-20 sm:pt-24 bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 mb-4 sm:mb-5 md:mb-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-1.5 sm:space-x-2 text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors text-gray-400 hover:text-brand-orange group"
        >
          <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Journal</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={coverImage?.image_url || getPrimaryImage(post)}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor via-brand-anchor/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 md:px-6 pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
          <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em]">
              <span>{category}</span>
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-orange/40"></span>
              <div className="flex items-center space-x-1 sm:space-x-2 text-white/60">
                <Clock size={12} />
                <span>{readTime} Min Read</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter leading-[0.95] max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 pt-2 sm:pt-3 md:pt-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <User size={16} className="text-brand-orange" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40">Written By</span>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-black text-white">Sai Bali Team</span>
                </div>
              </div>
              <div className="h-5 sm:h-6 md:h-7 lg:h-8 w-px bg-white/10"></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Calendar size={16} className="text-brand-orange" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[6px] sm:text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40">Published</span>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-black text-white">{formatDate(post.published_at || post.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section - WITH GRAY BACKGROUND */}
      <section className="py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6">
          {/* Main Article */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-6 sm:space-y-8 text-base sm:text-lg md:text-xl font-large text-justify">
              {formatContent(post.content)}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Guide Section - Pulled closer with less top margin */}
      {interactivePoints.length > 0 && !isNyepiBlog && (
        <div className="max-w-4xl mx-auto px-4 sm:px-5 md:px-6 -mt-5">
          <div className="grid grid-cols-1 gap-6">
            {interactivePoints.map((point, idx) => {
              const isCompleted = completedPoints.has(idx);
              return (
                <motion.div
                  key={idx}
                  layout
                  onClick={() => togglePoint(idx)}
                  className={`group relative flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-brand-anchor border-brand-anchor shadow-2xl shadow-brand-anchor/20' 
                      : 'bg-white border-gray-100 hover:border-brand-orange/30 hover:shadow-xl'
                  }`}
                >
                  <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={point.image} 
                      alt={point.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isCompleted ? 'scale-110 opacity-40 grayscale' : 'group-hover:scale-110'
                      }`}
                      onError={(e) => {
                        e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`;
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xl font-black tracking-tight transition-colors ${
                        isCompleted ? 'text-white' : 'text-brand-text'
                      }`}>
                        {point.title}
                      </h4>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? 'bg-white text-brand-anchor' : 'bg-gray-100 text-gray-300'
                      }`}>
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                    <p className={`font-medium leading-relaxed transition-colors text-justify [text-align-last:left] ${
                      isCompleted ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {point.description}
                    </p>
                    {isCompleted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-orange bg-white/10 px-4 py-2 rounded-full"
                      >
                        <span>Point Understood</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion Reward Card */}
          {completedPoints.size === interactivePoints.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-8 bg-brand-orange rounded-[2.5rem] text-center space-y-4 shadow-2xl shadow-brand-orange/30"
            >
              <h4 className="text-2xl font-black text-white tracking-tight">You're Ready to Visit!</h4>
              <p className="text-white/80 font-medium">
                You've reviewed all the essential etiquette points. Have a respectful and meaningful temple visit.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Related Stories Section - Light themed cards */}
      {relatedPosts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-text text-center mb-10 sm:mb-12 md:mb-16">
              Related Stories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {relatedPosts.map(related => (
                <Link 
                  key={related.id} 
                  to={`/blog/${related.slug}`} 
                  className="group block transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-100"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={getPrimaryImage(related)} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `${BUCKET_URL}/fallback.jpg`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-brand-text rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                        {getCategoryFromTitle(related.title)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 sm:p-6 md:p-7 bg-white">
                    <div className="flex items-center justify-between mb-3 text-[7px] sm:text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Calendar size={8} sm:size={10} md:size={12} className="text-brand-orange" />
                        <span>{formatDate(related.published_at || related.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Clock size={8} sm:size={10} md:size={12} className="text-brand-orange" />
                        <span>{getReadTime(related.content)} Min</span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg md:text-xl font-black text-brand-text group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight mb-3">
                      {related.title}
                    </h4>
                    
                    <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-3 mb-4">
                      {related.excerpt || related.content.substring(0, 100) + '...'}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                          <User size={10} sm:size={12} className="text-brand-orange" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-widest text-gray-400">Written By</span>
                          <span className="text-[7px] sm:text-[8px] font-black text-brand-text">Sai Bali Team</span>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-brand-anchor group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all">
                        <ArrowRight size={10} sm:size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10 sm:mt-12 md:mt-14">
              <Link 
                to="/blog" 
                className="inline-block px-8 sm:px-10 py-3 sm:py-4 border-2 border-brand-anchor text-brand-anchor rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-brand-anchor hover:text-white transition-all"
              >
                View All Stories
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Mobile Share Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 flex justify-center space-x-4 lg:hidden z-50">
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: post.title,
                text: post.excerpt || 'Check out this article',
                url: window.location.href,
              });
            }
          }}
          className="flex-1 max-w-[200px] flex items-center justify-center space-x-2 bg-brand-orange text-white py-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-brand-orange/90"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
        <button className="flex-1 max-w-[200px] flex items-center justify-center space-x-2 bg-brand-anchor text-white py-3 rounded-full text-[8px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-brand-anchor/90">
          <MessageCircle size={14} />
          <span>Comment</span>
        </button>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
            onClick={() => setSelectedImage(null)}
          >
            <span className="text-4xl">&times;</span>
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-full object-contain animate-in zoom-in duration-500"
          />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;