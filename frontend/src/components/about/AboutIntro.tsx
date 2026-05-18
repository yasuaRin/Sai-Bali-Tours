import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Counter from './Counter';

interface AboutIntroProps {
  heroImage: string;
}

const AboutIntro: React.FC<AboutIntroProps> = ({ heroImage }) => {
  return (
    <section
      className="pt-24 sm:pt-32 lg:pt-48 pb-20 lg:pb-32 bg-white overflow-hidden relative"
      aria-labelledby="about-heading"
    >
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-anchor/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

          {/* ── Image Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] rounded-full bg-brand-orange/5 blur-3xl" />
            </div>

            {/* Main circle */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl relative bg-gray-100 group flex-shrink-0">
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-anchor/20 z-10 rounded-full" />
              {/* Subtle border ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-brand-orange/15 z-20 pointer-events-none" />
              {/* Inner shadow for 3D feel */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.08)] z-20 pointer-events-none" />

              <img
                src={heroImage}
                alt="Sai Bali Tours private Bali tour operator and tourism company in Ubud, Bali"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Small location dot */}
            <div className="absolute -bottom-1 right-2 sm:-bottom-2 sm:right-4 lg:bottom-0 lg:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-30 border border-gray-100">
              <MapPin size={14} className="text-brand-orange sm:w-4 sm:h-4" />
            </div>
          </motion.div>

          {/* ── Text Column ── */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <header className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Accent line + label */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 sm:w-10 lg:w-12 h-px bg-brand-orange" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-brand-orange">
                  About Sai Bali Tours
                </span>
              </div>

              {/* Main heading */}
              <h1
                id="about-heading"
                className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-brand-text tracking-tighter leading-tight uppercase"
              >
                Private Bali Tours &
                <br />
                <span className="text-brand-orange italic">Authentic Bali Experiences.</span>
              </h1>
            </header>

            {/* Decorative divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-brand-orange/20 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/40" />
              <div className="h-px flex-1 bg-gradient-to-l from-brand-orange/20 to-transparent" />
            </div>

            {/* Paragraphs — justified */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-5 text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 font-medium leading-relaxed text-justify">
              <p>
                Sai Bali Tours is a licensed Bali tourism company based in Ubud, Bali,
                specializing in private Bali tours, cultural experiences, Bali holiday
                packages, and personalized travel services for international travelers.
              </p>
              <p>
                Operated under{' '}
                <span className="text-brand-text font-black">PT. Bali Mertan Pertiwi</span>,
                we have provided professional Bali tour services, trusted local guides,
                and customized Bali vacation experiences since 2008.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4">
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-lg sm:text-xl lg:text-3xl font-black text-brand-text">2008</p>
                <p className="text-[7px] sm:text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Years of Experience
                </p>
              </div>
              <div className="w-px h-6 sm:h-8 lg:h-10 bg-gray-200" />
              <div className="space-y-0.5 sm:space-y-1">
                <Counter value={500} suffix="+" />
                <p className="text-[7px] sm:text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Verified Traveler Reviews
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutIntro;