import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ─── FAQ data ─────────────────────────────────────────────────────────────────
// Keyword-rich Q&A targeting Bali tour operator search intent.
const FAQS = [
  {
    q: 'What types of private Bali tours do you offer?',
    a: 'We specialise in fully customised private day tours, multi-day Bali packages, cultural immersion experiences, temple circuits, volcano treks, waterfall routes, and rice terrace walks — all tailored to your schedule and interests.',
  },
  {
    q: 'How do I book a private tour with Sai Bali Tours?',
    a: 'You can reach us directly via WhatsApp for instant support, or send a detailed inquiry by email. We typically confirm bookings within 24 hours and provide a personalised itinerary draft within 48 hours.',
  },
  {
    q: 'Are your Bali tour prices inclusive of entrance fees?',
    a: 'Our quoted prices cover a licensed private driver-guide, air-conditioned private vehicle, bottled water, and hotel pick-up and drop-off. Temple entrance fees and personal expenses are additional and vary by site.',
  },
  {
    q: 'Can you accommodate families, solo travelers, and large groups?',
    a: 'Absolutely. We cater to solo travelers, couples, families with children, and groups of up to 15 guests. Each itinerary is designed around your group size, physical comfort level, and specific interests.',
  },
  {
    q: 'What makes Sai Bali Tours different from other Bali tour operators?',
    a: 'Every guide is a Balinese local with certified cultural knowledge. We never use scripted tourist routes — each tour is built around genuine local insight, sustainable travel practices, and a commitment to supporting Balinese communities.',
  },
];

// ─── JSON-LD schema for Google FAQ rich results ───────────────────────────────
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

// ─── Component ────────────────────────────────────────────────────────────────
const AboutFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-24 sm:py-32 bg-white" aria-labelledby="faq-heading">

      {/* JSON-LD — injected once, read by Google for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-px bg-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange">
              Common Questions
            </span>
            <div className="w-12 h-px bg-brand-orange" />
          </div>
          <h2
            id="faq-heading"
            className="text-4xl md:text-6xl font-black text-brand-text tracking-tighter leading-[0.9] uppercase"
          >
            Frequently Asked{' '}
            <span className="text-brand-orange italic">Questions.</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            Everything you need to know about booking a private Bali tour with Sai Bali Tours.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === i
                  ? 'border-brand-orange/30 shadow-lg bg-white'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              {/* Question button */}
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between p-6 lg:p-8 text-left group"
              >
                <span className={`font-black text-base lg:text-lg uppercase tracking-tight pr-4 transition-colors duration-300 ${
                  openIndex === i ? 'text-brand-orange' : 'text-brand-text group-hover:text-brand-orange'
                }`}>
                  {faq.q}
                </span>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                  openIndex === i
                    ? 'bg-brand-orange text-white rotate-180'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange'
                }`}>
                  <ChevronDown size={18} />
                </div>
              </button>

              {/* Answer — animated expand/collapse */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                      {/* Divider */}
                      <div className="w-full h-px bg-gray-100 mb-5" />
                      <p className="text-gray-500 font-medium leading-relaxed text-base">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutFAQ;