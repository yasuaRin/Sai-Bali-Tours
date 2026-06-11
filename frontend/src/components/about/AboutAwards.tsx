import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, ChevronLeft, ChevronRight, Star, Award, Medal } from 'lucide-react';
import type { Award as AwardType } from '../../services/aboutService';

interface AboutAwardsProps {
  awards: AwardType[];
}

const SLIDE_DURATION = 4000; // auto-advance every 4s

const AboutAwards: React.FC<AboutAwardsProps> = ({ awards }) => {
  const [current, setCurrent]           = useState(0);
  const [direction, setDirection]       = useState(1); // 1 = forward, -1 = backward
  const [selectedAward, setSelectedAward] = useState<AwardType | null>(null);
  const [paused, setPaused]             = useState(false);
  const [hoveredCard, setHoveredCard]   = useState(false);

  const total = awards.length;

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1,  1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, paused, total]);

  if (total === 0) return null;

  const slideVariants = {
    enter:  (dir: number) => ({ x: dir > 0 ?  80 : -80, opacity: 0, scale: 0.96 }),
    center: {                   x: 0,              opacity: 1, scale: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -80 :  80, opacity: 0, scale: 0.96 }),
  };

  const award = awards[current];

  // Helper to get icon based on award type
  const getAwardIcon = (title: string, iconType?: string) => {
    if (iconType === 'trophy') return <Trophy size={48} className="text-brand-orange" />;
    if (title.toLowerCase().includes('nomination')) return <Medal size={48} className="text-brand-orange" />;
    return <Award size={48} className="text-brand-orange" />;
  };

  return (
    <section
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
      aria-label="Awards and industry recognition for Sai Bali Tours"
    >
      {/* Subtle bg accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-anchor/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <div className="w-10 h-px bg-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange">
                Recognition
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-brand-text tracking-tighter leading-[0.9] uppercase"
            >
              Awards &<br />
              <span className="text-brand-orange italic">Accolades.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <p className="text-gray-500 font-medium leading-relaxed text-base lg:text-lg hover:text-brand-anchor transition-colors duration-300">
              Recognized by leading global travel platforms for delivering exceptional
              private Bali tours, cultural integrity, and world-class hospitality since 2010.
            </p>
          </motion.div>
        </div>

        {/* ── Slideshow ── */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main slide card */}
          <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-2xl bg-white transition-all duration-500 hover:shadow-3xl">
            <AnimatePresence custom={direction} mode="wait">
              <motion.article
                key={award.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px] lg:min-h-[560px] transition-all duration-500"
                aria-label={`${award.title} — ${award.organization} ${award.year}`}
                onMouseEnter={() => setHoveredCard(true)}
                onMouseLeave={() => setHoveredCard(false)}
              >
                {/* Left — image panel */}
                <div
                  className="relative bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-10 lg:p-16 cursor-pointer group min-h-[280px] lg:min-h-full transition-all duration-500 hover:from-brand-orange/5 hover:to-brand-anchor/5"
                  onClick={() => setSelectedAward(award)}
                >
                  {/* Decorative corner accents with hover effect */}
                  <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-brand-orange/30 rounded-tl-lg transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-brand-orange/30 rounded-tr-lg transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-brand-orange/30 rounded-bl-lg transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-10 group-hover:h-10" />
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-brand-orange/30 rounded-br-lg transition-all duration-300 group-hover:border-brand-orange/60 group-hover:w-10 group-hover:h-10" />

                  {award.image_url ? (
                    <img
                      src={award.image_url}
                      alt={`${award.title} award certificate — Sai Bali Tours`}
                      className="max-h-64 lg:max-h-80 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700 group-hover:drop-shadow-xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-brand-orange/10 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-orange/20 group-hover:scale-110">
                      {getAwardIcon(award.title, award.icon_type)}
                    </div>
                  )}

                  {/* Click to enlarge hint */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange/80 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      Click to enlarge
                    </span>
                  </div>
                </div>

                {/* Right — content panel with hover background change */}
                <div 
                  className={`flex flex-col justify-center p-10 lg:p-16 space-y-6 transition-all duration-500 ${
                    hoveredCard 
                      ? 'bg-gradient-to-br from-brand-orange/5 via-white to-brand-anchor/5' 
                      : 'bg-white'
                  }`}
                >
                  {/* Counter badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-anchor text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:bg-brand-orange hover:scale-105">
                      <Trophy size={11} />
                      <span>{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
                    </div>
                    {award.year && (
                      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-orange/10 transition-all duration-300 hover:bg-brand-orange/20 hover:scale-105">
                        <Star size={9} className="text-brand-orange transition-all duration-300 group-hover:rotate-12" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
                          {award.year}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl font-black text-brand-text uppercase tracking-tighter leading-tight transition-all duration-300 hover:text-brand-orange hover:translate-x-1">
                      {award.title}
                    </h3>
                    {award.organization && (
                      <p className="text-brand-orange text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-brand-anchor hover:translate-x-1">
                        {award.organization}
                      </p>
                    )}
                    {award.description && (
                      <div className={`pt-2 border-t transition-all duration-300 ${
                        hoveredCard ? 'border-brand-orange/20' : 'border-gray-100'
                      }`}>
                        <p className={`text-base font-medium leading-relaxed transition-all duration-300 hover:translate-x-1 ${
                          hoveredCard ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700'
                        }`}>
                          {award.description}
                        </p>
                      </div>
                    )}
                    {!award.description && (
                      <div className={`pt-2 border-t transition-all duration-300 ${
                        hoveredCard ? 'border-brand-orange/20' : 'border-gray-100'
                      }`}>
                        <p className={`text-base font-medium leading-relaxed italic transition-all duration-300 ${
                          hoveredCard ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                        }`}>
                          {award.year === '2022' && 'Recognition for outstanding service and guest satisfaction in Bali\'s private tour industry'}
                          {award.year === '2025' && 'Celebrating excellence in sustainable tourism and authentic Balinese experiences'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="pt-4 space-y-3">
                    <div className="h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        key={`${current}-progress`}
                        className="h-full bg-gradient-to-r from-brand-orange to-brand-anchor rounded-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: paused ? undefined : 1 }}
                        transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                      />
                    </div>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                      {awards.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i, i > current ? 1 : -1)}
                          aria-label={`Go to award ${i + 1}`}
                          className={`transition-all duration-300 rounded-full ${
                            i === current
                              ? 'w-6 h-2 bg-gradient-to-r from-brand-orange to-brand-anchor'
                              : 'w-2 h-2 bg-gray-200 hover:bg-brand-orange/40 hover:scale-125'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous award"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-brand-anchor hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:scale-110 transition-all duration-300 z-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Next award"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-brand-anchor hover:bg-brand-orange hover:text-white hover:border-brand-orange hover:scale-110 transition-all duration-300 z-20"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

      </div>

      {/* ── Detail modal with hover effects ── */}
      <AnimatePresence>
        {selectedAward && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Award detail: ${selectedAward.title}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAward(null)}
              className="absolute inset-0 bg-brand-anchor/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              <button
                onClick={() => setSelectedAward(null)}
                aria-label="Close award detail"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 hover:scale-110 hover:rotate-90 flex items-center justify-center transition-all duration-300"
              >
                <X size={16} className="text-brand-anchor" />
              </button>

              {selectedAward.image_url && (
                <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8 hover:from-brand-orange/5 hover:to-brand-anchor/5 transition-all duration-500">
                  <img
                    src={selectedAward.image_url}
                    alt={`${selectedAward.title} — ${selectedAward.organization}`}
                    className="w-full h-full object-contain drop-shadow-md hover:drop-shadow-xl hover:scale-105 transition-all duration-500"
                  />
                </div>
              )}

              <div className="p-7 space-y-4 border-t border-gray-100 hover:border-brand-orange/20 transition-all duration-500">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedAward.year && (
                    <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-orange/20 hover:scale-105 transition-all duration-300">
                      {selectedAward.year}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-brand-anchor/5 text-brand-anchor text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 hover:bg-brand-anchor/10 hover:scale-105 transition-all duration-300">
                    <Trophy size={10} /> Award
                  </span>
                </div>
                <h3 className="text-xl font-black text-brand-text uppercase tracking-tighter leading-tight hover:text-brand-orange hover:translate-x-1 transition-all duration-300">
                  {selectedAward.title}
                </h3>
                {selectedAward.organization && (
                  <p className="text-brand-orange text-xs font-black uppercase tracking-widest hover:text-brand-anchor hover:translate-x-1 transition-all duration-300">
                    {selectedAward.organization}
                  </p>
                )}
                {selectedAward.description && (
                  <div className="pt-2 border-t border-gray-100 hover:border-brand-orange/20 transition-all duration-300">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed hover:text-gray-700 transition-all duration-300">
                      {selectedAward.description}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutAwards;