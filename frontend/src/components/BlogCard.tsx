import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get primary image or first image
  const getPrimaryImage = () => {
    if (post.images && post.images.length > 0) {
      const primary = post.images.find(img => img.is_primary);
      return primary?.image_url || post.images[0].image_url;
    }
    // Fallback if no images
    return 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/fallback.jpg';
  };

  // Get category from title
  const getCategory = () => {
    if (post.title.toLowerCase().includes('guide')) return 'Guides';
    if (post.title.toLowerCase().includes('waterfall')) return 'Adventure';
    if (post.title.toLowerCase().includes('etiquette')) return 'Culture';
    if (post.title.toLowerCase().includes('sunset')) return 'Lifestyle';
    return 'Travel Tips';
  };

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative flex flex-col h-full bg-[#0f0f0f] rounded-[1.75rem] overflow-hidden border border-white/[0.06] hover:border-brand-orange/30 transition-all duration-700 hover:shadow-[0_0_60px_-10px_rgba(242,140,51,0.25)]"
    >
      {/* Image Panel */}
      <div className="relative aspect-[3/2] overflow-hidden bg-[#1a1a1a]">
        <img
          src={getPrimaryImage()}
          alt={post.images?.find(img => img.is_primary)?.alt_text || post.title}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.src = 'https://gmcyxgjmlrytrwqgrona.supabase.co/storage/v1/object/public/website-assets/fallback.jpg';
          }}
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/10 to-transparent" />

        {/* Category pill – top left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-black/50 backdrop-blur-xl border border-white/10 text-brand-orange px-3 py-1.5 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-[0.35em]">
            <span className="w-1 h-1 rounded-full bg-brand-orange animate-pulse" />
            {getCategory()}
          </span>
        </div>

        {/* Index marker – top right (decorative) */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-7 h-7 rounded-full border border-white/10 bg-black/30 backdrop-blur-md flex items-center justify-center">
            <ArrowRight
              size={11}
              className="text-white/40 -rotate-45 group-hover:text-brand-orange group-hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Content Panel */}
      <div className="flex flex-col flex-1 px-5 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6 gap-3">
        {/* Date row */}
        <div className="flex items-center gap-1.5 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.35em] text-white/25">
          <Calendar size={9} className="text-brand-orange/60 shrink-0" />
          <span>{formatDate(post.published_at || post.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tighter leading-[1.1] line-clamp-2 group-hover:text-brand-orange transition-colors duration-500">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[11px] sm:text-xs text-white/35 font-medium leading-relaxed line-clamp-3 flex-1">
          {post.excerpt || post.content.substring(0, 120) + '...'}
        </p>

        {/* Bottom divider + CTA */}
        <div className="pt-4 mt-auto border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.35em] text-brand-orange/70 group-hover:text-brand-orange transition-colors duration-300">
            Read Article
          </span>

          {/* Animated arrow pill */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {/* Sliding underline track */}
            <span className="h-px bg-brand-orange/20 group-hover:bg-brand-orange/60 transition-all duration-500 w-0 group-hover:w-8" />
            <div className="w-7 h-7 rounded-full border border-white/10 bg-white/[0.04] group-hover:bg-brand-orange group-hover:border-brand-orange flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-[0_0_16px_rgba(242,140,51,0.4)]">
              <ArrowRight
                size={11}
                className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom edge glow on hover */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/0 to-transparent group-hover:via-brand-orange/40 transition-all duration-700" />
    </Link>
  );
};

export default BlogCard;