// src/services/aboutService.ts
//
// ─── PURPOSE ──────────────────────────────────────────────────────────────────
// Single source of truth for all Supabase queries used by the About page.
// Components and pages never import `supabase` directly — they call these
// functions instead. This means:
//   • DB column names are only spelled out in one place
//   • If a table or column renames, you fix it here — not across 4 components
//   • Every query has consistent error handling and return shapes
//   • Unit tests can mock this module without touching Supabase internals

import { supabase } from '../lib/supabaseClient';

// =============================================================================
// TYPES
// =============================================================================
// Each type maps 1-to-1 with the columns we SELECT from each table.
// We don't use `*` in types — explicit columns prevent surprise fields
// from leaking into the UI when the DB schema changes.

// ── awards ────────────────────────────────────────────────────────────────────
// DB columns: id, year, title, organization, icon_type, image_url,
//             sort_order, created_at
// We omit `created_at` — it's internal bookkeeping, not display data.
export interface Award {
  id: number;
  year: string;
  title: string;
  organization: string;
  description: string;   // ← was missing in the original; the Awards grid renders this
  icon_type: string;
  image_url: string;
  sort_order: number;
}

// ── gallery_images ────────────────────────────────────────────────────────────
export interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  tag: string;
  sort_order: number;
}

// ── about_content (single row) ────────────────────────────────────────────────
export interface AboutImages {
  hero_image: string;
  corporate_image: string;
  founder_image: string;
}

// ── company_info (single row) ─────────────────────────────────────────────────
// Previously fetched inline in About.tsx — moved here so all DB access
// is centralised in this file.
export interface CompanyInfo {
  whatsapp_number: string;
  email_address: string;
  instagram_handle: string | null;
  facebook_handle: string | null;
  address: string | null;
}

// ── company_values ────────────────────────────────────────────────────────────
// Previously fetched inline in About.tsx — moved here for the same reason.
export interface CompanyValue {
  id: number;
  icon_name: string;
  title: string;
  description: string;
  sort_order: number;
}

// =============================================================================
// HELPERS
// =============================================================================
// A tiny logger so every query failure is logged consistently.
// Pass the table name and the Supabase error object.
// Returns the fallback value so callers can write: `return handleError(...)`
function handleError<T>(table: string, error: unknown, fallback: T): T {
  console.error(`[aboutService] Failed to fetch "${table}":`, error);
  return fallback;
}

// =============================================================================
// FETCH FUNCTIONS
// =============================================================================

// ── getAwards ─────────────────────────────────────────────────────────────────
// Returns all awards ordered by sort_order ascending.
// Returns [] on error so the Awards section is simply hidden (it renders
// conditionally: `awards.length > 0 && <section>...`).
export const getAwards = async (): Promise<Award[]> => {
  const { data, error } = await supabase
    .from('awards')
    .select('id, year, title, organization, description, icon_type, image_url, sort_order')
    .order('sort_order', { ascending: true });

  if (error) return handleError('awards', error, []);
  return data ?? [];
};

// ── getGalleryImages ──────────────────────────────────────────────────────────
// Returns all gallery images ordered by sort_order ascending.
// Returns [] on error — GallerySection renders an "images coming soon"
// empty state when the array is empty.
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('id, image_url, title, tag, sort_order')
    .order('sort_order', { ascending: true });

  if (error) return handleError('gallery_images', error, []);
  return data ?? [];
};

// ── getAboutImages ────────────────────────────────────────────────────────────
// Returns the single about_content row (hero/corporate/founder image URLs).
//
// WHY maybeSingle() instead of single():
// `.single()` throws a Postgres error when the table has 0 rows (PGRST116).
// `.maybeSingle()` returns null instead — safe even on an empty table.
// `.limit(1)` is a safety net: if someone accidentally inserts a second row,
// we still get a predictable single result rather than a Supabase error.
export const getAboutImages = async (): Promise<AboutImages | null> => {
  const { data, error } = await supabase
    .from('about_content')
    .select('hero_image, corporate_image, founder_image')
    .limit(1)
    .maybeSingle();

  if (error) return handleError('about_content', error, null);
  return data;
};

// ── getCompanyInfo ────────────────────────────────────────────────────────────
// Returns the single company_info row (contact details, social handles).
// Previously fetched inline in About.tsx — centralised here.
//
// Same maybeSingle() reasoning as getAboutImages.
export const getCompanyInfo = async (): Promise<CompanyInfo | null> => {
  const { data, error } = await supabase
    .from('company_info')
    .select('whatsapp_number, email_address, instagram_handle, facebook_handle, address')
    .limit(1)
    .maybeSingle();

  if (error) return handleError('company_info', error, null);
  return data;
};

// ── getCompanyValues ──────────────────────────────────────────────────────────
// Returns all company_values rows ordered by sort_order ascending.
// Previously fetched inline in About.tsx — centralised here.
// Returns [] on error — Values section is hidden when the array is empty.
export const getCompanyValues = async (): Promise<CompanyValue[]> => {
  const { data, error } = await supabase
    .from('company_values')
    .select('id, icon_name, title, description, sort_order')
    .order('sort_order', { ascending: true });

  if (error) return handleError('company_values', error, []);
  return data ?? [];
};