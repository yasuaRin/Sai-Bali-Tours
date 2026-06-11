import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, MapPin, Award, Users, HeartHandshake, Star } from 'lucide-react';
import SEO from '../components/SEO';
import AboutIntro from '../components/about/AboutIntro';
import AboutFounder from '../components/about/AboutFounder';
import AboutAwards from '../components/about/AboutAwards';
import AboutFAQ from '../components/about/AboutFAQ';
import { getAwards, getGalleryImages, getAboutImages } from '../services/aboutService';
import type { Award as AwardType, GalleryImage, AboutImages } from '../services/aboutService';

const MISSION_POINTS = [
  { title: 'Private Bali Tour Experiences', desc: 'We design personalized Bali tours tailored to each traveler for a meaningful and memorable journey.' },
  { title: 'Licensed Bali Tour Operator', desc: 'Operating under PT. Bali Mertan Pertiwi with full legal compliance, safety, and professionalism.' },
  { title: 'Support Local Communities in Bali', desc: 'We create sustainable job opportunities and support local Balinese communities through responsible tourism.' },
  { title: 'Authentic Balinese Cultural Experiences', desc: 'We connect travelers with real Balinese culture, traditions, and everyday local life.' },
  { title: 'Luxury Bali Travel and Exploration', desc: 'We offer premium Bali travel experiences covering hidden gems, temples, waterfalls, and nature spots.' },
];


const MAP_IFRAME_SRC = [
  'https://www.google.com/maps/embed?pb=',
  '!1m18!1m12!1m3!1d527.7117121215329',
  '!2d115.19198123641459!3d-8.820825046530464',
  '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  '!3m3!1m2!1s0x2dd25d44821ad05d',
  '%3A0x9f62e07fe86aac89',
  '!2sPerumahan%20Nusa%20Puri%20Blok%20E-F',
  '!5e1!3m2!1sen!2sid!4v1780715490110!5m2!1sen!2sid',
].join('');

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [galleryItems, setGallery] = useState<GalleryImage[]>([]);
  const [images, setImages] = useState<AboutImages | null>(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLIFrameElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.src = MAP_IFRAME_SRC;
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [awardsData, galleryData, imagesData] = await Promise.all([
          getAwards(),
          getGalleryImages(),
          getAboutImages(),
        ]);
        setAwards(awardsData);
        setGallery(galleryData);
        setImages(imagesData);
      } catch (e) {
        console.error('Error loading about data:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#FF6B35]/20 border-t-[#FF6B35] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2B5869]">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white relative">
      <SEO
        title="About Sai Bali Tours | Licensed and Professional Bali Tour Operator"
        description="Premium private Bali tours by Sai Bali Tours. Managed by PT. Bali Mertan Pertiwi, we offer authentic cultural experiences and luxury travel in Bali since 2008."
        keywords="Bali tour operator, private Bali tours, Bali travel agency, Ubud travel agency, PT. Bali Mertan Pertiwi, Sai Bali Tours"
      />

      {/* Scroll progress bar — teal-blue */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
        style={{ scaleX, backgroundColor: '#2B5869' }}
      />

      <AboutIntro
        heroImage={
          images?.hero_image ||
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80'
        }
      />

      {/* ── VISION / MISSION ── */}
      <section
        className="py-20 lg:py-32 overflow-hidden relative"
        style={{ backgroundColor: '#f8f7f4' }}
        aria-label="Our Vision and Mission"
      >
        {/* Decorative teal block */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.04] pointer-events-none"
          style={{ backgroundColor: '#2B5869' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left sticky column */}
            <div className="lg:col-span-5 space-y-8 lg:space-y-12 lg:sticky lg:top-32">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 lg:w-12 h-px" style={{ backgroundColor: '#2B5869' }} />
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.4em]"
                    style={{ color: '#2B5869' }}
                  >
                    Our Compass
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight uppercase" style={{ color: '#2D2D2D' }}>
                  Purpose <br />
                  <span style={{ color: '#FF6B35' }} className="italic">Driven.</span>
                </h2>
                {/* Golden accent bar */}
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: '#FFC857' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B35' }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2B5869' }} />
                </div>
              </div>

              <div className="flex flex-col space-y-3 max-w-xs">
                {/* Vision tab */}
                <button
                  onClick={() => setActiveTab('vision')}
                  aria-selected={activeTab === 'vision'}
                  className="group flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300"
                  style={
                    activeTab === 'vision'
                      ? { backgroundColor: '#2B5869', borderColor: '#2B5869', boxShadow: '0 20px 40px rgba(43,88,105,0.25)' }
                      : { backgroundColor: '#fff', borderColor: '#e5e7eb' }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={
                      activeTab === 'vision'
                        ? { backgroundColor: 'rgba(255,107,53,0.2)', color: '#FF6B35' }
                        : { backgroundColor: '#f9fafb', color: '#9ca3af' }
                    }
                  >
                    <Globe size={20} />
                  </div>
                  <span
                    className="font-black uppercase tracking-widest text-sm transition-colors duration-300"
                    style={{ color: activeTab === 'vision' ? '#fff' : '#4b5563' }}
                  >
                    The Vision
                  </span>
                </button>

                {/* Mission tab */}
                <button
                  onClick={() => setActiveTab('mission')}
                  aria-selected={activeTab === 'mission'}
                  className="group flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300"
                  style={
                    activeTab === 'mission'
                      ? { backgroundColor: '#2B5869', borderColor: '#2B5869', boxShadow: '0 20px 40px rgba(43,88,105,0.25)' }
                      : { backgroundColor: '#fff', borderColor: '#e5e7eb' }
                  }
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={
                      activeTab === 'mission'
                        ? { backgroundColor: 'rgba(255,107,53,0.2)', color: '#FF6B35' }
                        : { backgroundColor: '#f9fafb', color: '#9ca3af' }
                    }
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <span
                    className="font-black uppercase tracking-widest text-sm transition-colors duration-300"
                    style={{ color: activeTab === 'mission' ? '#fff' : '#4b5563' }}
                  >
                    The Mission
                  </span>
                </button>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeTab === 'vision' && (
                  <motion.div
                    key="vision"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                      {/* Top accent stripe — teal to orange */}
                      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #2B5869, #FF6B35, #FFC857)' }} />
                      <div className="p-8 lg:p-12 space-y-8">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'rgba(43,88,105,0.1)', color: '#2B5869' }}
                          >
                            <Globe size={28} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#2B5869' }}>Our Vision</p>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Sai Bali Tours</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-2xl lg:text-3xl font-black uppercase tracking-tight leading-tight" style={{ color: '#2D2D2D' }}>
                            Bali's most trusted tour operator for{' '}
                            <span style={{ color: '#FF6B35' }} className="italic">
                              private, authentic travel experiences
                            </span>.
                          </h3>
                          <p className="text-gray-500 text-base lg:text-lg font-medium leading-relaxed">
                            We deliver high-integrity private Bali tours that respect the island's
                            cultural heritage while providing world-class, personalized service to
                            travelers worldwide.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {[
                            { heading: 'Integrity', body: 'Fully licensed under PT. Bali Mertan Pertiwi with transparent pricing and zero hidden fees.', color: '#2B5869' },
                            { heading: 'Authenticity', body: 'Real cultural immersion guided by Balinese locals who know the island intimately.', color: '#FF6B35' },
                            { heading: 'Excellence', body: 'Premium private vehicles, expert guides, and consistently 5-star rated service.', color: '#FFC857' },
                          ].map((pillar, i) => (
                            <motion.div
                              key={pillar.heading}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                              className="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                              style={{ backgroundColor: '#f8f7f4', borderLeft: `3px solid ${pillar.color}` }}
                            >
                              <h4
                                className="text-sm font-black uppercase tracking-widest mb-2"
                                style={{ color: pillar.color }}
                              >
                                {pillar.heading}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                {pillar.body}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </article>
                  </motion.div>
                )}

                {activeTab === 'mission' && (
                  <motion.div
                    key="mission"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="space-y-3"
                  >
                    {MISSION_POINTS.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="group flex items-start space-x-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        style={{ borderLeft: i % 2 === 0 ? '3px solid #2B5869' : '3px solid #FF6B35' }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300 group-hover:scale-110"
                          style={
                            i % 2 === 0
                              ? { backgroundColor: 'rgba(43,88,105,0.1)', color: '#2B5869' }
                              : { backgroundColor: 'rgba(255,107,53,0.1)', color: '#FF6B35' }
                          }
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-black uppercase tracking-tight mb-1 group-hover:text-[#FF6B35] transition-colors duration-300"
                            style={{ color: '#2D2D2D' }}
                          >
                            {point.title}
                          </h4>
                          <p className="text-gray-500 text-sm font-medium leading-relaxed">{point.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <AboutFounder
        founderImage={
          images?.founder_image ||
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80'
        }
      />

      <AboutAwards awards={awards} />

      {/* ── LOCATION ── */}
      <section
        className="py-20 lg:py-32 relative overflow-hidden"
        id="location"
        style={{ backgroundColor: '#f8f7f4' }}
        aria-label="Our location in Nusa Dua, Bali"
      >
        {/* Decorative teal circle */}
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-[0.06] pointer-events-none"
          style={{ backgroundColor: '#2B5869' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-px" style={{ backgroundColor: '#2B5869' }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#2B5869' }}>
                    Location
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase" style={{ color: '#2D2D2D' }}>
                  Find <span style={{ color: '#FF6B35' }} className="italic">Us.</span>
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                  Located in Nusa Dua, our headquarters coordinates all island adventures with easy access to Bali's best destinations.
                </p>
              </div>

              {/* Address card */}
              <div
                className="flex items-start space-x-4 p-5 rounded-2xl border"
                style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(43,88,105,0.1)', color: '#2B5869' }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-black mb-1" style={{ color: '#2D2D2D' }}>Sai Bali Tours — Nusa Dua</p>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Jalan Darmawangsa, Perum Nusa Puri No. 28,<br />
                    Gang Kelapa Blok, Nusa Dua Bali, Indonesia 80363
                  </p>
                </div>
              </div>

              {/* Info chips */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Mon–Sun, 8am–8pm', color: '#2B5869' },
                  { label: '+62 123 456 7890', color: '#FF6B35' },
                  { label: 'Free parking', color: '#FFC857' },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="text-xs font-semibold rounded-full px-4 py-1.5 border"
                    style={{
                      color: chip.color,
                      borderColor: chip.color,
                      backgroundColor: `${chip.color}10`,
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: map card */}
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid #e5e7eb' }}>

              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-white" style={{ borderBottom: '1px solid #f3f4f6' }}>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(43,88,105,0.1)', color: '#2B5869' }}
                  >
                    <MapPin size={13} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#2D2D2D' }}>Sai Bali Tours</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Perumahan+Nusa+Puri+Blok+E-F+Nusa+Dua+Bali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 text-xs font-bold rounded-lg px-3 py-1.5 transition-all duration-200 hover:opacity-80"
                  style={{ color: '#2B5869', border: '1px solid #2B5869', backgroundColor: 'rgba(43,88,105,0.05)' }}
                >
                  <Globe size={11} />
                  <span>Open in Maps</span>
                </a>
              </div>

              {/* iframe */}
              <div className="relative w-full" style={{ paddingBottom: '72%' }}>
                <iframe
                  ref={mapRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sai Bali Tours location in Nusa Dua, Bali"
                />
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white" style={{ borderTop: '1px solid #f3f4f6' }}>
                <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                  <ShieldCheck size={13} className="text-green-500" />
                  <span>Verified location</span>
                </div>
                <span className="text-xs text-gray-400 tabular-nums">8°49′15″S 115°11′31″E</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    
      <AboutFAQ />
    </div>
  );
};

export default About;