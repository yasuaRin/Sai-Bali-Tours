import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What makes Sai Bali Tours different from other operators?',
    answer: 'We are a fully licensed tour operator under PT. Bali Mertan Pertiwi. Unlike informal drivers, we provide insured, professional, and culturally immersive private experiences with indigenous Balinese guides.'
  },
  {
    question: 'Are your tours private or group-based?',
    answer: 'All our tours are 100% private. You will never be combined with strangers. This ensures a personalized pace, deeper cultural access, and complete flexibility in your itinerary.'
  },
  {
    question: 'How do I book a tour?',
    answer: 'Simply contact us via WhatsApp or email. We will design a custom itinerary based on your interests, then confirm availability and payment details within 24 hours.'
  },
  {
    question: 'What areas do you cover in Bali?',
    answer: 'We cover the entire island — from Ubud and Seminyak to the hidden gems of North and East Bali. Our guides are local experts who know every spiritual and scenic route.'
  },
  {
    question: 'Are entrance fees and meals included?',
    answer: 'Standard packages include private transport and a licensed guide. Entrance fees, meals, and activities can be bundled upon request for a seamless all-inclusive experience.'
  },
  {
    question: 'Is it safe to travel with Sai Bali Tours?',
    answer: 'Absolutely. All vehicles are regularly maintained, insured, and driven by professional local drivers. Our team is trained in first aid and guest safety protocols.'
  },
];

const AboutFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange">
            Your Questions
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-brand-text tracking-tighter leading-[0.9] uppercase">
            Frequently <span className="text-brand-orange italic">Asked.</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
            Everything you need to know before embarking on your Bali journey.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-base md:text-lg font-black text-brand-text pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
                >
                  <ChevronDown size={18} className="text-brand-orange" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-gray-500 font-medium leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFAQ;