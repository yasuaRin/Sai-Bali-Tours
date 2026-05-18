import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { GalleryImage } from '../../services/aboutService';

interface AboutGalleryProps {
  items: GalleryImage[];
}

const AboutGallery: React.FC<AboutGalleryProps> = ({ items }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 4);

  if (!items.length) {
    return (
      <section className="py-24 sm:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center py-12 text-gray-400">Gallery images coming soon.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 sm:py-40 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left space-y-4 mb-20">
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <div className="w-12 h-px bg-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange">
              Snapshots of Excellence
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-brand-text tracking-tighter leading-[0.9] uppercase">
            Capturing the <span className="text-brand-orange italic">Essence.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl cursor-default ${
                  i % 2 !== 0 ? 'md:translate-y-12' : ''
                }`}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-anchor/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <span className="text-brand-orange font-black text-[10px] uppercase tracking-widest">
                    {item.tag}
                  </span>
                  <h4 className="text-white font-black text-xl uppercase tracking-tighter">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length > 4 && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex flex-col items-center space-y-4 text-brand-text hover:text-brand-orange transition-colors"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                {showAll ? 'Show Less' : 'Show More'}
              </span>
              <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:border-brand-orange transition-all duration-500">
                {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutGallery;