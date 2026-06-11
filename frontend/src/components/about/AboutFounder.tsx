import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface AboutFounderProps {
  founderImage: string;
}

const AboutFounder: React.FC<AboutFounderProps> = ({ founderImage }) => {
  return (
    <section className="py-24 bg-brand-anchor relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">

          <div className="lg:col-span-6 relative mb-12 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative"
            >
              <img
                src={founderImage}
                alt="Wayan Mudita founder of Sai Bali Tours private Bali tour company in Karangasem"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-2 sm:-bottom-10 sm:-right-10 lg:-right-16 w-36 h-36 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-white shadow-2xl rounded-full z-20 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 text-center border border-gray-100"
            >
              <Quote className="text-brand-orange mb-2 sm:mb-3 lg:mb-4 w-4 sm:w-6 h-4 sm:h-6" />
              <p className="text-[9px] sm:text-xs lg:text-sm font-bold italic text-brand-text leading-tight">
                "Bali is not only a destination — it is a story, a culture, and a way of life meant to be shared with the world."
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-px bg-brand-orange" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-orange">
                  How It Started
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight uppercase">
                From a Villager <br />
                <span className="text-brand-orange italic underline decoration-brand-orange/20 underline-offset-8">
                  to a Founder
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed text-justify">
                Born and raised in a small village in Karangasem, Bali, Wayan Mudita began his
                journey with a simple dream to build a trusted Bali tourism company from
                the ground up while preserving the island's natural beauty, traditions,
                and cultural heritage.
              </p>

              <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed text-justify">
                Through dedication and deep local knowledge, he founded Sai Bali Tours to
                provide authentic Bali private tours, cultural experiences, and meaningful
                travel journeys that connect visitors with the true spirit of Bali.
              </p>

            
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutFounder;