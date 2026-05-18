// backend/src/rss.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// RSS Feed endpoint
router.get('/rss.xml', async (req, res) => {
  try {
    // Get published blog posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Get site URL from environment or use default
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';

    // Build RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sai Bali Tours - Island Perspectives</title>
    <link>${siteUrl}/blog</link>
    <description>Curated stories, local secrets, and professional guides to help you navigate the heart and soul of Bali.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => {
      const pubDate = new Date(post.published_at || post.created_at).toUTCString();
      const description = post.excerpt || post.content.substring(0, 200) + '...';
      const url = `${siteUrl}/blog/${post.slug}`;
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    // Send as XML
    res.type('application/xml').send(rss);
  } catch (error) {
    console.error('RSS Error:', error);
    res.status(500).send('Error generating RSS feed');
  }
});

export default router;