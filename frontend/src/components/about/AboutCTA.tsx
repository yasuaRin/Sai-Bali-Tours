import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

const AboutCTA: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 bg-brand-anchor relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange">
            Begin Your Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase">
            Ready to Experience <br />
            <span className="text-brand-orange italic">Authentic Bali?</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
            Let our indigenous guides craft your perfect private itinerary.
            Your journey into the heart of Bali begins with a single message.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-sm hover:bg-brand-orange/90 transition-all shadow-xl hover:shadow-2xl"
            >
              <MessageCircle size={20} />
              WhatsApp Us
              <ArrowRight size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCTA;