
import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Heart, Sparkles, Globe, Map, ArrowRight, ExternalLink } from 'lucide-react';

const AboutContact: React.FC = () => {
  return (
    <div className="pt-20 bg-white">
      {/* Premium Hero Section */}
      <section className="bg-brand-anchor py-24 sm:py-32 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                <Sparkles size={14} />
                <span>Our Heritage</span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
                Authentic <br /><span className="text-brand-orange italic">Bali Roots.</span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl font-medium leading-relaxed">
                Since 2010, Sai Bali Tours has been the trusted bridge between world travelers and the true spiritual essence of our island home.
              </p>
            </div>
            <div className="hidden lg:block relative group">
              <div className="absolute inset-0 bg-brand-orange/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80" 
                className="w-80 h-80 object-cover rounded-[4rem] border-4 border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl"
                alt="Sai Bali Founder"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80" 
                className="rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative z-10"
                alt="Bali Temple"
              />
              <div className="absolute bottom-10 right-10 bg-white p-8 rounded-3xl shadow-2xl z-20">
                <div className="text-4xl font-black text-brand-orange mb-1">15+</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Years of Trust</div>
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl font-black text-brand-text tracking-tighter leading-tight">
                  Local Expertise, <br/><span className="text-brand-orange italic">Premium Standards.</span>
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  Founded in Ubud, the cultural heart of the island, Sai Bali Tours began as a small family operation with a large vision: to provide travelers with the honesty, safety, and deep local insight they deserve.
                </p>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  Managed by <span className="text-brand-text font-black">PT. Bali Mertan Pertiwi</span>, we have evolved into a premier tour operator, yet we remain deeply committed to our founding values of sustainable tourism and personal service.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-text text-sm uppercase tracking-tight">Eco Conscious</h4>
                    <p className="text-xs text-gray-400 mt-1">Supporting local communities and environment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-text text-sm uppercase tracking-tight">Fully Licensed</h4>
                    <p className="text-xs text-gray-400 mt-1">Official PT. registered business entity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-4">The Sai Bali Promise</div>
            <h2 className="text-3xl sm:text-5xl font-black text-brand-text tracking-tighter leading-none">
              Travel Without <span className="text-brand-orange italic">Worry.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: 'Bespoke Care', 
                desc: 'Every tour is 100% private. We don\'t do shared buses; we do personal connections.' 
              },
              { 
                icon: Map, 
                title: 'Curated Paths', 
                desc: 'Our itineraries are tested weekly to ensure we bypass crowds and hit peak moments.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Peace of Mind', 
                desc: 'From airport pickup to final drop-off, your safety and comfort are our absolute priority.' 
              }
            ].map((feature, i) => (
              <div key={i} className="group p-12 bg-white rounded-[3rem] border border-gray-100 hover:border-brand-orange/20 shadow-sm hover:shadow-2xl transition-all duration-500 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-brand-orange mb-10 mx-auto group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-inner">
                  <feature.icon size={36} />
                </div>
                <h4 className="text-2xl font-black text-brand-text mb-4 uppercase tracking-tight">{feature.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Connect Section - Contact & Social Cards */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-brand-orange font-black uppercase tracking-[0.4em] text-[10px] mb-4">Connect with Us</div>
            <h2 className="text-4xl sm:text-6xl font-black text-brand-text tracking-tighter leading-none mb-6">
              Get in <span className="text-brand-orange italic">Touch.</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              We're available 24/7 to assist with your Bali adventure. Choose your preferred way to reach out or follow our journey online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* WhatsApp Card */}
            <a 
              href="https://wa.me/628123456789" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-20 h-20 bg-green-50 rounded-[1.5rem] flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Phone size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Instant Chat</h4>
                <h3 className="text-2xl font-black text-brand-text mb-4 tracking-tight">WhatsApp Support</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                  Perfect for quick questions, live booking support, and custom itinerary adjustments.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-lg font-black text-brand-text">+62 812 3456 789</span>
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a 
              href="mailto:booking@saibalitours.com"
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-20 h-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Mail size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Corporate Inquiries</h4>
                <h3 className="text-2xl font-black text-brand-text mb-4 tracking-tight">Email Booking</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                  Best for detailed group requests, package collaborations, and pre-arrival confirmations.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-lg font-black text-brand-text">booking@saibalitours.com</span>
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>

            {/* Office Card */}
            <div className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-brand-orange mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <MapPin size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Physical Location</h4>
                <h3 className="text-2xl font-black text-brand-text mb-4 tracking-tight">Our Bali Office</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                  Visit us in the heart of Ubud for a personal consultation on your dream island journey.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-lg font-black text-brand-text">Jl. Raya Ubud, Bali</span>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center hover:bg-brand-anchor transition-all shadow-lg"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Instagram Card */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-20 h-20 bg-pink-50 rounded-[1.5rem] flex items-center justify-center text-pink-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Instagram size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Visual Gallery</h4>
                <h3 className="text-2xl font-black text-brand-text mb-4 tracking-tight">Instagram</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                  Follow for daily island inspiration, guest highlights, and behind-the-scenes Bali magic.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-lg font-black text-brand-text">@saibalitours</span>
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>

            {/* Facebook Card */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Facebook size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Community</h4>
                <h3 className="text-2xl font-black text-brand-text mb-4 tracking-tight">Facebook</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                  Join our community of Bali lovers for tips, reviews, and exclusive bundle offers.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-lg font-black text-brand-text">Sai Bali Tours</span>
                <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center group-hover:rotate-45 transition-transform shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </a>
            
            {/* Review Trust Card */}
            <div className="group bg-brand-anchor p-10 rounded-[3rem] shadow-xl transition-all duration-500 flex flex-col justify-between border border-white/10">
              <div>
                <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-brand-orange mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Globe size={36} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200/50 mb-2">Global Trust</h4>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">TripAdvisor</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
                  Ranked #1 for private tours in Ubud. Read what thousands of happy travelers say about us.
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-lg font-black text-white">4.9 / 5.0 Rating</span>
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:bg-brand-orange transition-all">
                  <ExternalLink size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;
