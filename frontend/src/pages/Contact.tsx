// src/pages/Contact.tsx
// Contact page — direct channels (WhatsApp, Email, Call, IG, Facebook)
// No FAQ, no location, no booking CTA — zero duplication across pages
// Font: Inter (global) | Tailwind CSS | framer-motion

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, Sun, Clock,
  ArrowUpRight, Instagram, Facebook,
} from 'lucide-react';

// ── WhatsApp brand icon (lucide doesn't include it) ───────────────────────────
const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
import SEO from '../components/SEO';

// ── Animation helper ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Data ──────────────────────────────────────────────────────────────────────
const CHANNELS = [
  {
    href:    'https://wa.me/628123456789',
    icon:    WhatsAppIcon,
    label:   'WhatsApp',
    sub:     'Quick bookings · reply in under 15 min',
    iconBg:  '#dcfce7',
    iconCol: '#16a34a',
    tag:     'Fastest',
    tagCol:  '#16a34a',
  },
  {
    href:    'mailto:booking@saibalitours.com',
    icon:    Mail,
    label:   'Email',
    sub:     'Custom itineraries & detailed enquiries',
    iconBg:  '#eff6ff',
    iconCol: '#2563eb',
    tag:     'Detailed',
    tagCol:  '#2563eb',
  },
  {
    href:    'tel:+628123456789',
    icon:    Phone,
    label:   'Call Us',
    sub:     'Mon–Sun, 8 am – 8 pm Bali time',
    iconBg:  'rgba(242,140,51,0.12)',
    iconCol: '#F28C33',
    tag:     'Direct',
    tagCol:  '#F28C33',
  },
  {
    href:    'https://instagram.com/saibalitours',
    icon:    Instagram,
    label:   'Instagram',
    sub:     'Daily Bali moments & tour highlights',
    iconBg:  'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)',
    iconCol: '#fff',
    tag:     'Follow',
    tagCol:  '#ee2a7b',
    isGradient: true,
  },
  {
    href:    'https://facebook.com/saibalitours',
    icon:    Facebook,
    label:   'Facebook',
    sub:     'Reviews, updates & community stories',
    iconBg:  '#1877f2',
    iconCol: '#fff',
    tag:     'Like',
    tagCol:  '#1877f2',
    isGradient: true,
  },
];

const STANDARDS = [
  { label: 'Response Time', value: '< 15 Min'     },
  { label: 'Availability',  value: '24 / 7'        },
  { label: 'Tour Style',    value: '100% Private'  },
  { label: 'Fleet',         value: 'Premium Class' },
];

// ── Eyebrow ───────────────────────────────────────────────────────────────────
const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-5 h-px bg-brand-orange" />
    <span className={`text-[10px] font-semibold uppercase tracking-[0.4em] ${light ? 'text-brand-orange/90' : 'text-brand-secondary'}`}>
      {children}
    </span>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const Contact: React.FC = () => {
  const [baliTime, setBaliTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setBaliTime(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Makassar',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f8f7f4]"
      itemScope
      itemType="https://schema.org/ContactPage"
    >
      <SEO
        title="Contact Sai Bali Tours | Book a Private Bali Tour"
        description="Reach Sai Bali Tours via WhatsApp, email, phone, Instagram or Facebook. Licensed private tour operator in Bali — fast replies, custom itineraries, zero hidden fees."
        keywords="contact Sai Bali Tours, book private Bali tour, Bali tour enquiry, WhatsApp Bali tour, Nusa Dua tour operator"
      />

      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-secondary via-brand-orange to-brand-accent" />

      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4px)]">

        {/* ══════════════════════════ LEFT — dark brand panel */}
        <section
          className="relative flex flex-col justify-center px-8 sm:px-14 py-20 lg:py-28 overflow-hidden bg-[#1c2b33]"
          aria-label="Contact introduction"
        >
          {/* Ambient glows */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(242,140,51,0.08), transparent 65%)' }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(43,88,105,0.35), transparent 70%)' }} />

          <div className="relative z-10 max-w-lg space-y-12">

            {/* Headline */}
            <motion.div {...fadeUp(0)}>
              <Eyebrow light>Get In Touch</Eyebrow>
              <h1
                className="leading-none text-white"
                style={{ fontWeight: 800, fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', letterSpacing: '-0.03em' }}
                itemProp="name"
              >
                {"Let's"}{' '}
                <span className="text-brand-orange">Connect.</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/40 max-w-sm">
                Our local Balinese team is ready to help you plan an unforgettable private
                experience — personally, fast, and with zero hassle.
              </p>
            </motion.div>

            {/* Live clock + weather */}
            <motion.div
              {...fadeUp(0.1)}
              className="grid grid-cols-2 gap-4 pt-10 border-t border-white/[0.08]"
            >
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-brand-orange" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-white/30">Bali Time</span>
                </div>
                <span
                  className="tabular-nums font-bold text-white leading-none"
                  style={{ fontSize: '1.3rem', letterSpacing: '-0.02em' }}
                >
                  {baliTime}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25">GMT+8</span>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <Sun size={12} className="text-brand-accent" />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-white/30">Weather</span>
                </div>
                <span
                  className="font-bold text-white leading-none"
                  style={{ fontSize: '1.3rem', letterSpacing: '-0.02em' }}
                >
                  28°C
                </span>
                <span className="text-[10px] text-white/30">Sunny & Warm</span>
              </div>
            </motion.div>

            {/* Service standards */}
            <motion.div
              {...fadeUp(0.18)}
              className="pt-10 border-t border-white/[0.08]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-orange/70 mb-5">
                Our Standards
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {STANDARDS.map((s) => (
                  <div key={s.label}>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mb-1">{s.label}</p>
                    <p className="font-bold text-white" style={{ fontSize: '1rem', letterSpacing: '-0.02em' }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              {...fadeUp(0.24)}
              className="pt-10 border-t border-white/[0.08]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25 mb-3">
                Trusted By Travellers
              </p>
              <p className="text-sm leading-relaxed text-white/40">
                Operated by{' '}
                <span className="text-white font-semibold">PT. Bali Mertan Pertiwi</span>,
                we've guided guests from over 30 countries through Bali's most iconic and hidden destinations.
              </p>
            </motion.div>

          </div>
        </section>

        {/* ══════════════════════════ RIGHT — all channels */}
        <section
          className="flex flex-col justify-center px-8 sm:px-14 py-20 lg:py-28 overflow-y-auto bg-[#f8f7f4]"
          aria-label="Contact options"
        >
          <div className="max-w-xl mx-auto w-full">

            <motion.div {...fadeUp(0.05)}>
              <Eyebrow>Reach Us</Eyebrow>
              <h2
                className="leading-tight text-brand-text mb-2"
                style={{ fontWeight: 800, fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)', letterSpacing: '-0.03em' }}
              >
                All Channels.
              </h2>
              <p className="text-sm text-gray-400 mb-10">
                Message, call, or follow — pick what works best for you.
              </p>

              <div className="space-y-3">
                {CHANNELS.map(({ href, icon: Icon, label, sub, iconBg, iconCol, tag, tagCol, isGradient }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={isGradient ? '_blank' : undefined}
                    rel={isGradient ? 'noopener noreferrer' : undefined}
                    {...fadeUp(0.05 + i * 0.06)}
                    whileHover={{ x: 4 }}
                    className="group flex items-center justify-between p-5 rounded-xl border border-[#ede9e2] bg-white hover:shadow-[0_6px_24px_rgba(43,88,105,0.1)] transition-shadow duration-200"
                    style={{ boxShadow: '0 2px 12px rgba(43,88,105,0.05)' }}
                    aria-label={`${isGradient ? 'Follow us on' : 'Contact via'} ${label}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-[10px]"
                        style={{ background: iconBg, color: iconCol }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-brand-text">{label}</span>
                          <span
                            className="text-[8px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-[3px]"
                            style={{ color: tagCol, backgroundColor: `${tagCol}18` }}
                          >
                            {tag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={15}
                      className="text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Contact;