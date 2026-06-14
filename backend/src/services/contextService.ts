import { supabase } from '../lib/supabaseClient';

let cachedContext: string | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const COMPANY_INFO = `
Company: Sai Bali Tours (operated by PT. Bali Mertan Pertiwi)
WhatsApp / Phone: ${process.env.WHATSAPP_NUMBER || '+62 812-3456-789'}
Website: ${process.env.SITE_URL || 'https://saibalitours.com'}
Service style: 100% private transport, air-conditioned vehicles, licensed English-speaking Balinese drivers/guides, transparent pricing with no hidden fees.
`;

async function fetchToursSummary(): Promise<string> {
  const { data, error } = await supabase
    .from('tours')
    .select('title, short_description, duration, starting_price, location, activity_level, mood_tags, category:tour_categories(name)')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .limit(20);

  if (error || !data) return '';

  return data
    .map((t: any) => {
      const category = t.category?.name ? ` [${t.category.name}]` : '';
      const price = t.starting_price ? `From $${t.starting_price}` : '';
      return `- ${t.title}${category} — ${t.duration || 'Full Day'}, ${price}. ${t.short_description || ''}`.trim();
    })
    .join('\n');
}

async function fetchPackagesSummary(): Promise<string> {
  const { data, error } = await supabase
    .from('packages')
    .select('title, overview, duration_days, duration_nights, price_estimate')
    .eq('status', 'active')
    .limit(10);

  if (error || !data || data.length === 0) return '';

  return data
    .map((p: any) => `- ${p.title} (${p.duration_days}D/${p.duration_nights}N) — Est. $${p.price_estimate}. ${p.overview || ''}`.trim())
    .join('\n');
}

/**
 * Returns a text block summarizing the company + real available tours/packages.
 * Cached for 1 hour to avoid hammering Supabase on every AI request.
 */
export async function getSiteContext(): Promise<string> {
  const now = Date.now();
  if (cachedContext && now - cachedAt < CACHE_TTL_MS) {
    return cachedContext;
  }

  const [tours, packages] = await Promise.all([fetchToursSummary(), fetchPackagesSummary()]);

  cachedContext = `
${COMPANY_INFO}

AVAILABLE TOURS:
${tours || 'No tours currently listed.'}

AVAILABLE MULTI-DAY PACKAGES:
${packages || 'No packages currently listed.'}
`.trim();

  cachedAt = now;
  return cachedContext;
}