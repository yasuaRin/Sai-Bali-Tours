// src/pages/TourDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTourBySlug } from '../services/tourService';
import type { Tour } from '../services/tourService';
import { Clock, Tag, MapPin, Check, X, Phone, Loader2 } from 'lucide-react';

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getTourBySlug(id).then(data => {
        setTour(data);
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching tour:', error);
        setTour(null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
      </div>
    );
  }

  if (!tour) return <Navigate to="/" />;

  return (
    <div className="pt-20">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img src={tour.image} className="w-full h-full object-cover" alt={tour.title} />
          <div className="absolute inset-0 bg-brand-anchor/60"></div>
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-widest mb-4">
              {tour.category?.name}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {tour.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white font-medium">
              <div className="flex items-center space-x-2">
                <Clock className="text-brand-accent" size={20} />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="text-brand-accent" size={20} />
                <span>{tour.price}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-brand-accent" size={20} />
                <span>Multiple Locations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-6">Tour <span className="text-brand-orange">Overview</span></h2>
                <p className="text-gray-600 leading-loose text-lg mb-8">{tour.overview}</p>
                
                {/* Accommodation Options (Conditional for Room + Tour) */}
                {tour.hotel_options && (
                  <div className="mb-10 space-y-4">
                    <h3 className="text-xl font-bold text-brand-text">Accommodation Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.hotel_options.map((opt, idx) => (
                        <div key={idx} className="p-6 bg-brand-anchor/5 rounded-2xl border border-brand-anchor/10">
                          <div className="text-brand-orange font-black text-xs uppercase tracking-widest mb-2">Option {idx + 1}</div>
                          <p className="text-brand-text font-bold text-sm mb-2">{opt.hotel}</p>
                          <div className="text-brand-orange font-black text-lg">{opt.cost}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Notes (Conditional) */}
                {tour.notes && (
                  <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <p className="text-brand-orange text-xs font-black uppercase tracking-widest mb-1">Important Notes</p>
                    <p className="text-brand-text text-sm font-medium italic">{tour.notes}</p>
                  </div>
                )}

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                  {tour.highlights.map((h, idx) => (
                    <motion.div 
                      key={h} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                      <span className="font-semibold text-brand-text">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Itinerary Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-bold mb-10">Planned <span className="text-brand-orange">Itinerary</span></h2>
                <div className="space-y-0">
                  {tour.itinerary.map((step, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex group"
                    >
                      <div className="flex flex-col items-center mr-8">
                        <div className="w-4 h-4 rounded-full bg-brand-orange ring-4 ring-orange-100 z-10"></div>
                        {idx !== tour.itinerary.length - 1 && <div className="w-0.5 h-full bg-gray-200"></div>}
                      </div>
                      <div className="pb-12 pt-0.5">
                        <div className="text-sm font-bold text-brand-orange mb-1">{step.time}</div>
                        <h4 className="text-xl font-bold text-brand-text mb-2">{step.activity}</h4>
                        <p className="text-gray-500 text-sm italic">Professional guidance and comfortable transportation provided.</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 rounded-3xl p-8 border border-green-100"
                >
                  <h3 className="text-xl font-bold text-green-800 mb-6">Price Includes</h3>
                  <ul className="space-y-4">
                    {tour.inclusions.map(inc => (
                      <li key={inc} className="flex items-start space-x-3 text-green-700">
                        <Check size={18} className="mt-1 flex-shrink-0" />
                        <span className="font-medium">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 rounded-3xl p-8 border border-red-100"
                >
                  <h3 className="text-xl font-bold text-red-800 mb-6">Price Excludes</h3>
                  <ul className="space-y-4">
                    {tour.exclusions.map(exc => (
                      <li key={exc} className="flex items-start space-x-3 text-red-700">
                        <X size={18} className="mt-1 flex-shrink-0" />
                        <span className="font-medium">{exc}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky top-28 bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl space-y-8"
              >
                <div>
                  <div className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-1">Starting Price</div>
                  <div className="text-4xl font-bold text-brand-orange">{tour.price}</div>
                  <div className="text-gray-500 text-xs mt-2">*Price may vary based on group size</div>
                </div>

                <div className="space-y-4">
                  <motion.a 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://wa.me/628123456789" 
                    className="w-full flex items-center justify-center space-x-3 bg-brand-orange text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200"
                  >
                    <Phone size={20} />
                    <span>Book via WhatsApp</span>
                  </motion.a>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-brand-secondary text-brand-secondary py-5 rounded-2xl font-bold hover:bg-brand-secondary hover:text-white transition"
                  >
                    Email Inquiry
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourDetail;