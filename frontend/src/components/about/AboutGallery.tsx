// src/components/about/AboutGallery.tsx
// Refined editorial gallery — warm cream palette, Playfair Display headlines
// Clean 6-card grid + expand, filter tabs, lightbox. No visual overload.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import type { GalleryImage } from '../../services/aboutService';

interface AboutGalleryProps {
  items: GalleryImage[];
}

const FEATURE_COUNT = 6;

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FilterTabs: React.FC<{
  tags: string[];
  active: string;
  onChange: (t: string) => void;
}> = ({ tags, active, onChange }) => (
  <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter gallery by category">
    {['All', ...tags].map((tag) => {
      const on = active === tag;
      return (
        <button
          key={tag}
          role="tab"
          aria-selected={on}
          onClick={() => onChange(tag)}
          className="text-[10px] font-semibold uppercase tracking-[0.2em] px-5 py-2 transition-all duration-250"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            border: on ? '1px solid #FF6B35' : '1px solid rgba(43,88,105,0.18)',
            backgroundColor: on ? '#FF6B35' : 'transparent',
            color: on ? '#fff' : '#2B5869',
            borderRadius: '2px',
            boxShadow: on ? '0 2px 12px rgba(255,107,53,0.2)' : 'none',
          }}
        >
          {tag}
        </button>
      );
    })}
  </div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────────────
const Lightbox: React.FC<{
  items: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ items, index, onClose, onPrev, onNext }) => {
  const item = items[index];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', fn);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn); };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(8,12,14,0.97)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label={`Viewing: ${item.title}`}
    >
      {/* Header bar */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 z-20">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] mb-0.5" style={{ color: '#FF6B35', fontFamily: "'DM Sans', sans-serif" }}>
            {item.tag}
          </p>
          <p className="text-white font-semibold text-sm tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            {item.title}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ color: '#FFC857' }}>{String(index + 1).padStart(2, '0')}</span>
            {' / '}
            {String(items.length).padStart(2, '0')}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center transition-colors duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '2px', color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.color = '#FF6B35'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Image */}
      <motion.div
        key={index}
        className="flex items-center justify-center px-20"
        style={{ maxHeight: '78vh', maxWidth: '88vw' }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image_url}
          alt={item.title}
          className="max-h-[78vh] max-w-full object-contain"
          style={{ borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)' }}
          itemProp="contentUrl"
        />
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/10">
        <motion.div
          className="h-full"
          style={{ backgroundColor: '#FF6B35', width: `${((index + 1) / items.length) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>

      {/* Prev / Next */}
      {([
        { label: 'Previous photo', Icon: ChevronLeft, pos: 'left-4', fn: onPrev },
        { label: 'Next photo',     Icon: ChevronRight, pos: 'right-4', fn: onNext },
      ] as const).map(({ label, Icon, pos, fn }) => (
        <button
          key={label}
          onClick={(e) => { e.stopPropagation(); fn(); }}
          aria-label={label}
          className={`absolute top-1/2 -translate-y-1/2 ${pos} w-10 h-10 flex items-center justify-center transition-all duration-200`}
          style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '2px', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; e.currentTarget.style.color = '#FF6B35'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <Icon size={18} />
        </button>
      ))}
    </motion.div>
  );
};

// ─── Gallery Card ─────────────────────────────────────────────────────────────
const GalleryCard: React.FC<{
  item: GalleryImage;
  displayIndex: number;
  globalIndex: number;
  className?: string;
  isHero?: boolean;
  onOpen: () => void;
}> = ({ item, displayIndex, globalIndex, className = '', isHero, onOpen }) => {
  const [hov, setHov] = useState(false);

  return (
    <motion.figure
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: displayIndex * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={{ borderRadius: '3px', backgroundColor: '#dedad4' }}
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      aria-label={`Open photo: ${item.title}`}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      itemScope itemType="https://schema.org/ImageObject"
    >
      {/* Photo */}
      <img
        src={item.image_url}
        alt={item.title}
        className="w-full h-full object-cover"
        style={{
          transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1), filter 0.45s ease',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          filter: hov ? 'saturate(1.05) brightness(1.02)' : 'saturate(0.82) brightness(0.93)',
        }}
        loading="lazy"
        itemProp="contentUrl"
      />

      {/* Number badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="text-[8px] font-semibold tracking-[0.3em] uppercase px-2 py-0.5"
          style={{ backgroundColor: '#2B5869', color: '#FFC857', borderRadius: '2px', fontFamily: "'DM Sans', sans-serif" }}
        >
          {String(globalIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Expand icon */}
      <div
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: '#FF6B35',
          borderRadius: '2px',
          opacity: hov ? 1 : 0,
          transform: hov ? 'scale(1)' : 'scale(0.85)',
        }}
      >
        <ArrowUpRight size={13} color="#fff" />
      </div>

      {/* Caption gradient */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{
          transition: 'opacity 0.35s ease',
          opacity: isHero || hov ? 1 : 0,
          background: 'linear-gradient(to top, rgba(20,30,36,0.85) 0%, rgba(20,30,36,0.18) 55%, transparent 100%)',
        }}
      >
        <div
          className="px-4 py-4"
          style={{ transition: 'transform 0.35s ease', transform: hov || isHero ? 'translateY(0)' : 'translateY(5px)' }}
        >
          {item.tag && (
            <p className="text-[8px] font-semibold uppercase tracking-[0.35em] mb-1" style={{ color: '#FF6B35', fontFamily: "'DM Sans', sans-serif" }}>
              {item.tag}
            </p>
          )}
          <h3
            className="text-white font-semibold leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: isHero ? '1.2rem' : '0.875rem' }}
            itemProp="name"
          >
            {item.title}
          </h3>
        </div>
      </div>
    </motion.figure>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AboutGallery: React.FC<AboutGalleryProps> = ({ items }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const hy = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const allTags = Array.from(new Set(items.map((i) => i.tag).filter(Boolean)));
  const filtered = activeTag === 'All' ? items : items.filter((i) => i.tag === activeTag);
  const featured = filtered.slice(0, FEATURE_COUNT);
  const overflow = filtered.slice(FEATURE_COUNT);

  const open  = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const prev  = useCallback(() => setLightboxIndex((p) => p === null ? null : (p - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next  = useCallback(() => setLightboxIndex((p) => p === null ? null : (p + 1) % filtered.length), [filtered.length]);

  useEffect(() => { setShowAll(false); setLightboxIndex(null); }, [activeTag]);

  if (items.length === 0) {
    return (
      <section className="py-24 text-center" style={{ backgroundColor: '#f8f7f4' }} aria-label="Photo gallery">
        <Camera size={28} color="#2B5869" style={{ margin: '0 auto 12px', opacity: 0.35 }} />
        <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: '#2B5869', opacity: 0.4, fontFamily: "'DM Sans', sans-serif" }}>
          Gallery coming soon
        </p>
      </section>
    );
  }

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox items={filtered} index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>

      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: '#f8f7f4' }}
        aria-label="Sai Bali Tours photo gallery"
        itemScope itemType="https://schema.org/ImageGallery"
      >
        {/* Top rule */}
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(43,88,105,0.25), transparent)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-20 lg:pb-32">

          {/* ── Header ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-8 mb-14">
            <motion.div style={{ y: hy }} className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ backgroundColor: '#FF6B35' }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: '#2B5869', fontFamily: "'DM Sans', sans-serif" }}>
                  Visual Journal
                </span>
              </div>
              <h2
                className="font-semibold leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontFamily: "'Playfair Display', Georgia, serif", color: '#2D2D2D' }}
              >
                Moments{' '}
                <em style={{ color: '#FF6B35', fontStyle: 'italic' }}>Captured.</em>
              </h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: '#6b7280', fontFamily: "'DM Sans', sans-serif" }}>
                Every frame tells a story — sacred temples, golden rice terraces, and the warm welcome of Balinese families.
              </p>
            </motion.div>

            <div className="lg:col-span-4 flex flex-col lg:items-end gap-3">
              <span className="text-5xl font-semibold tabular-nums leading-none" style={{ fontFamily: "'Playfair Display', serif", color: '#2B5869' }}>
                {items.length}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.35em]" style={{ color: 'rgba(43,88,105,0.4)', fontFamily: "'DM Sans', sans-serif" }}>
                curated frames
              </span>
            </div>
          </div>

          {/* ── Divider rule ── */}
          <div className="mb-10 h-px" style={{ backgroundColor: 'rgba(43,88,105,0.1)' }} />

          {/* ── Filter tabs ── */}
          {allTags.length > 0 && (
            <FilterTabs tags={allTags} active={activeTag} onChange={setActiveTag} />
          )}

          {/* ── Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {/* 6-card editorial grid */}
              <div className="grid grid-cols-12 gap-2" style={{ gridAutoRows: '250px' }}>
                {featured[0] && (
                  <GalleryCard item={featured[0]} displayIndex={0} globalIndex={0}
                    className="col-span-12 md:col-span-7 row-span-2" isHero onOpen={() => open(0)} />
                )}
                {featured[1] && (
                  <GalleryCard item={featured[1]} displayIndex={1} globalIndex={1}
                    className="col-span-12 md:col-span-5" onOpen={() => open(1)} />
                )}
                {featured[2] && (
                  <GalleryCard item={featured[2]} displayIndex={2} globalIndex={2}
                    className="col-span-12 md:col-span-5" onOpen={() => open(2)} />
                )}
                {featured[3] && (
                  <GalleryCard item={featured[3]} displayIndex={3} globalIndex={3}
                    className="col-span-12 md:col-span-4" onOpen={() => open(3)} />
                )}
                {featured[4] && (
                  <GalleryCard item={featured[4]} displayIndex={4} globalIndex={4}
                    className="col-span-12 md:col-span-4" onOpen={() => open(4)} />
                )}
                {featured[5] && (
                  <GalleryCard item={featured[5]} displayIndex={5} globalIndex={5}
                    className="col-span-12 md:col-span-4" onOpen={() => open(5)} />
                )}
              </div>

              {/* Overflow */}
              <AnimatePresence>
                {showAll && overflow.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2" style={{ gridAutoRows: '210px' }}>
                      {overflow.map((item, i) => (
                        <GalleryCard key={item.id} item={item}
                          displayIndex={i} globalIndex={FEATURE_COUNT + i}
                          className="w-full h-full"
                          onOpen={() => open(FEATURE_COUNT + i)} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* ── Footer ── */}
          <div className="mt-8 pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ borderTop: '1px solid rgba(43,88,105,0.1)' }}
          >
            {/* Dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {Array.from({ length: Math.min(filtered.length, 14) }).map((_, i) => {
                const vis = showAll ? filtered.length : FEATURE_COUNT;
                const on = i < Math.min(vis, 14);
                return (
                  <div key={i} className="rounded-full transition-all duration-300" style={{
                    width: on ? '7px' : '5px', height: on ? '7px' : '5px',
                    backgroundColor: on ? '#FF6B35' : 'rgba(43,88,105,0.18)',
                  }} />
                );
              })}
              <span className="ml-3 text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(43,88,105,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
                {showAll ? filtered.length : Math.min(FEATURE_COUNT, filtered.length)} shown
              </span>
            </div>

            {/* Expand CTA */}
            {filtered.length > FEATURE_COUNT && (
              <button
                onClick={() => setShowAll(!showAll)}
                aria-label={showAll ? 'Show fewer photos' : `View all ${filtered.length} photos`}
                className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] px-6 py-3 transition-all duration-250"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  border: '1px solid #2B5869',
                  borderRadius: '2px',
                  color: showAll ? '#fff' : '#2B5869',
                  backgroundColor: showAll ? '#2B5869' : 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2B5869'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { if (!showAll) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#2B5869'; } }}
              >
                <Camera size={13} />
                <span>{showAll ? 'Show Less' : `View All ${filtered.length} Photos`}</span>
                <ArrowUpRight size={12} />
              </button>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutGallery;