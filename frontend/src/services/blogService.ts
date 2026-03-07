import { supabase } from '../lib/supabaseClient';
import type { BlogPost, BlogImage } from '../types';

// Define and export the blogService object
export const blogService = {
  async getPublishedPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          images:blog_images(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(post => ({
        ...post,
        excerpt: post.excerpt || post.content.substring(0, 150) + '...',
        images: post.images || []
      }));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          images:blog_images(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  },

  async getLatestPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          images:blog_images(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return (data || []).map(post => ({
        ...post,
        excerpt: post.excerpt || post.content.substring(0, 120) + '...',
        images: post.images || []
      }));
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      return [];
    }
  }
};