import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Star, X } from 'lucide-react';
import type { Award as AwardType } from '../../services/aboutService';

const iconMap: Record<string, React.ComponentType<any>> = {
  star: Star,
  trophy: Trophy,
  award: Award,
};

interface AboutAwardsProps {
  awards: AwardType[];
}

const AboutAwards: React.FC<AboutAwardsProps> = ({ awards }) => {
  const [selectedAward, setSelectedAward] = useState<AwardType | null>(null);

  if (!awards.length) return null;

  return (
    <section className="py-24 bg-white border-y border-gray-100" id="awards">
      <div className="max-w-7xl mx-auto px-6">
        <header className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start mb-20 md:mb-32">
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-[1px] bg-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange">
                Industry Credentials
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-brand-text tracking-tighter uppercase leading-[0.9]"
            >
              Recognized <br />
              <span className="text-gray-300">Excellence.</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-full justify-center md:border-l md:border-gray-100 md:pl-16"
          >
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm text-sm md:text-base">
              Our curated collection of industry accolades reflects our unwavering
              focus on premium safety standards and authentic cultural representation
              since 2008.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {awards.map((award) => {
            const IconComponent = iconMap[award.icon_type] || Award;

            return (
              <motion.article
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: award.sort_order * 0.1 }}
                onClick={() => setSelectedAward(award)}
                className="group cursor-pointer space-y-6"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img
                    src={award.image_url}
                    alt={award.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm z-10">
                    <span className="text-[10px] font-black text-brand-text">{award.year}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-brand-orange">
                    <div className="p-2 rounded-full bg-brand-orange/5">
                      <IconComponent size={14} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                      {award.organization}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-brand-text uppercase tracking-tighter leading-tight group-hover:text-brand-orange transition-colors">
                    {award.title}
                  </h3>
                  {award.description && (
                    <p className="text-gray-500 text-sm font-medium">{award.description}</p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAward && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAward(null)}
              className="absolute inset-0 bg-brand-anchor/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden relative shadow-2xl z-10 flex flex-col"
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-brand-anchor shadow-sm"
              >
                <X size={20} />
              </button>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={selectedAward.image_url}
                  alt={selectedAward.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-widest rounded-md">
                      Official Archive
                    </span>
                    <span className="text-xs font-black text-gray-300">{selectedAward.year}</span>
                  </div>
                  <h3 className="text-3xl font-black text-brand-text uppercase tracking-tighter leading-none">
                    {selectedAward.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {selectedAward.organization}
                  </p>
                </div>
                {selectedAward.description && (
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {selectedAward.description}
                  </p>
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