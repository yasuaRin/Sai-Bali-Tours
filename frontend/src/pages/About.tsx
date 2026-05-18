import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Globe, ShieldCheck, MapPin, Award, Users, HeartHandshake
} from 'lucide-react';
import SEO from '../components/SEO';
import AboutIntro from '../components/about/AboutIntro';
import AboutFounder from '../components/about/AboutFounder';
import AboutAwards from '../components/about/AboutAwards';
import AboutGallery from '../components/about/AboutGallery';
import AboutFAQ from '../components/about/AboutFAQ';
import AboutCTA from '../components/about/AboutCTA';
import { getAwards, getGalleryImages, getAboutImages } from '../services/aboutService';
import type { Award as AwardType, GalleryImage, AboutImages } from '../services/aboutService';

const MISSION_POINTS = [
  { title: 'Private Bali Tour Experiences', desc: 'We design personalized Bali tours tailored to each traveler for a meaningful and memorable journey.' },
  { title: 'Licensed Bali Tour Operator', desc: 'Operating under PT. Bali Mertan Pertiwi with full legal compliance, safety, and professionalism.' },
  { title: 'Support Local Communities in Bali', desc: 'We create sustainable job opportunities and support local Balinese communities through responsible tourism.' },
  { title: 'Authentic Balinese Cultural Experiences', desc: 'We connect travelers with real Balinese culture, traditions, and everyday local life.' },
  { title: 'Luxury Bali Travel & Exploration', desc: 'We offer premium Bali travel experiences covering hidden gems, temples, waterfalls, and nature spots.' },
];

const WHY_REASONS = [
  { icon: ShieldCheck, title: 'Licensed Experts', description: 'Fully certified operator (PT. Bali Mertan Pertiwi).' },
  { icon: MapPin, title: 'Customized Tours', description: 'Bespoke itineraries tailored to your unique interests.' },
  { icon: Award, title: 'Cultural Knowledge', description: 'Deep indigenous wisdom shared by local guides.' },
  { icon: Users, title: 'Professional Guides', description: 'Multilingual cultural ambassadors.' },
  { icon: ShieldCheck, title: 'Safety First', description: 'Meticulously maintained premium vehicles.' },
  { icon: HeartHandshake, title: 'Premium Service', description: 'True Balinese hospitality at every step.' },
];

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [galleryItems, setGallery] = useState<GalleryImage[]>([]);
  const [images, setImages] = useState<AboutImages | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white relative">
      <SEO
        title="About Sai Bali Tours | Licensed & Professional Bali Tour Operator"
        description="Premium private Bali tours by Sai Bali Tours. Managed by PT. Bali Mertan Pertiwi, we offer authentic cultural experiences and luxury travel in Bali since 2008."
        keywords="Bali tour operator, private Bali tours, Bali travel agency, Ubud travel agency, PT. Bali Mertan Pertiwi, Sai Bali Tours"
      />

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-brand-orange z-[100] origin-left" style={{ scaleX }} />

      <AboutIntro heroImage={images?.hero_image || 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80'} />

      {/* ── VISION / MISSION ── */}
      <section className="py-20 lg:py-32 bg-gray-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 space-y-8 lg:space-y-12 lg:sticky lg:top-32">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 lg:w-12 h-px bg-brand-orange" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Our Compass</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-brand-text tracking-tighter leading-tight uppercase">
                  Purpose <br /><span className="text-brand-orange italic">Driven.</span>
                </h2>
              </div>
              <div className="flex flex-col space-y-4 max-w-xs">
                <button onClick={() => setActiveTab('vision')} className={`group flex items-center justify-between p-4 lg:p-6 rounded-2xl border transition-all duration-500 ${activeTab === 'vision' ? 'bg-brand-anchor border-brand-anchor shadow-2xl scale-105' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center space-x-4">
                    <Globe className={activeTab === 'vision' ? 'text-brand-orange' : 'text-gray-400'} size={24} />
                    <span className={`font-black uppercase tracking-widest text-sm ${activeTab === 'vision' ? 'text-white' : 'text-gray-400'}`}>The Vision</span>
                  </div>
                </button>
                <button onClick={() => setActiveTab('mission')} className={`group flex items-center justify-between p-4 lg:p-6 rounded-2xl border transition-all duration-500 ${activeTab === 'mission' ? 'bg-brand-anchor border-brand-anchor shadow-2xl scale-105' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center space-x-4">
                    <ShieldCheck className={activeTab === 'mission' ? 'text-brand-orange' : 'text-gray-400'} size={24} />
                    <span className={`font-black uppercase tracking-widest text-sm ${activeTab === 'mission' ? 'text-white' : 'text-gray-400'}`}>The Mission</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeTab === 'vision' ? (
                  <motion.div key="vision" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-8 lg:p-20 rounded-[2rem] lg:rounded-[3rem] shadow-2xl border border-gray-50">
                    <div className="space-y-8 lg:space-y-12">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-orange/10 rounded-2xl lg:rounded-3xl flex items-center justify-center text-brand-orange"><Globe size={32} /></div>
                      <div className="space-y-6">
                        <h4 className="text-3xl lg:text-4xl font-black text-brand-text uppercase tracking-tight leading-tight">
                          To become Bali's most trusted tour operator for{' '}
                          <span className="text-brand-orange">authentic travel experiences</span>.
                        </h4>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed">
                          We set the benchmark for high-integrity Bali tourism — where every journey respects the island's heritage while delivering world-class service.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="mission" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 gap-6">
                    {MISSION_POINTS.map((point, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="group p-6 lg:p-8 bg-white rounded-2xl lg:rounded-3xl border border-gray-50 shadow-xl flex items-start space-x-4">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-brand-orange/10 rounded-xl flex-shrink-0 flex items-center justify-center text-brand-orange">
                          <span className="text-lg font-black">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-brand-text uppercase mb-1">{point.title}</h4>
                          <p className="text-gray-500 text-sm font-medium">{point.desc}</p>
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

      <AboutFounder founderImage={images?.founder_image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80'} />

      <AboutAwards awards={awards} />

      <section className="py-20 lg:py-32 bg-white relative overflow-hidden" id="location">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-8 lg:space-y-10">
              <div className="space-y-4">
                <div className="flex items-center space-x-4"><div className="w-10 h-px bg-brand-orange" /><span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">Location</span></div>
                <h2 className="text-4xl md:text-5xl font-black text-brand-text uppercase">Find <span className="text-brand-orange italic">Us.</span></h2>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">Located in the cultural sanctuary of Ubud, our headquarters coordinates all island adventures.</p>
              <div className="flex items-start space-x-4 pt-8 border-t border-gray-100">
                <MapPin size={24} className="text-brand-orange flex-shrink-0 mt-0.5" />
                <p className="text-gray-500 font-bold">Jalan Raya Ubud, Kabupaten Gianyar<br />Bali, Indonesia 80571</p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="w-full aspect-square sm:aspect-[4/3] rounded-[3rem_8rem_4rem_10rem] overflow-hidden shadow-2xl relative">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126305.808003666!2d115.20465243178712!3d-8.506853600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23d739f223fd3%3A0x5030bf45204b340!2sUbud%2C%20Gianyar%20Regency%2C%20Bali!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale hover:grayscale-0 transition-all duration-1000 scale-125" title="Sai Bali Tours location in Ubud" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 lg:mb-20">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-4"><div className="w-10 h-[1px] bg-brand-orange" /><span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-orange">Advantages</span></div>
              <h2 className="text-4xl md:text-5xl font-black text-brand-text leading-tight uppercase">The Gold Standard <br /><span className="text-brand-orange italic">Of Bali Luxury.</span></h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_REASONS.map((reason, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500"><reason.icon size={28} /></div>
                <h3 className="text-xl font-black text-brand-text mb-3 uppercase">{reason.title}</h3>
                <p className="text-gray-500 text-sm font-medium">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AboutFAQ />
      <AboutCTA />
      <AboutGallery items={galleryItems} />
    </div>
  );
};

export default About;