
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, MapPin } from 'lucide-react';

interface ShowcaseProps {
  title: string;
  category: string;
  description: string;
  image: string;
  reverse?: boolean;
  tours: any[];
  link: string;
}

const CategoryShowcase: React.FC<ShowcaseProps> = ({ title, category, description, image, reverse, tours, link }) => {
  const featured = tours[0];

  return (
    <section className="py-16 sm:py-24 overflow-hidden border-b border-gray-50 last:border-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
          
          {/* Narrative Column */}
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-3 text-brand-orange">
                <div className="w-10 h-[2px] bg-brand-orange"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">{category} Showcase</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-brand-text tracking-tighter leading-none">
                {title.split(' ')[0]} <br/>
                <span className="text-brand-orange italic">{title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xl">
                {description}
              </p>
            </div>

            {/* The #1 Pick Card */}
            {featured && (
              <Link 
                to={category === 'Adventure' ? '/adventures' : `/tour/${featured.slug}`}
                className="group relative block p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-brand-orange/30 hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-brand-orange text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                    <Star size={10} fill="currentColor" />
                    <span>Top Pick</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock size={12} className="text-brand-orange" />
                    <span>{featured.duration}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-black text-brand-text mb-2 group-hover:text-brand-orange transition-colors">{featured.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                  {featured.overview || featured.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-brand-orange font-black text-xs uppercase tracking-widest">
                    <span>View Selection</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                  <span className="text-brand-text font-black text-lg">{featured.price}</span>
                </div>
              </Link>
            )}

            <Link 
              to={link}
              className="inline-flex items-center space-x-4 text-brand-anchor font-black text-sm uppercase tracking-widest group"
            >
              <span>Explore All {category} Tours</span>
              <div className="w-8 h-[2px] bg-brand-anchor group-hover:w-16 group-hover:bg-brand-orange transition-all"></div>
            </Link>
          </div>

          {/* Visual Column */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] sm:aspect-square">
              <div className={`absolute inset-0 bg-brand-orange/5 rounded-[4rem] transition-transform duration-[2s] ${reverse ? '-rotate-3' : 'rotate-3'}`}></div>
              <div className="relative h-full w-full rounded-[4rem] overflow-hidden shadow-2xl">
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-[4s] hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-anchor/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white">
                  <div className="flex items-center space-x-3 mb-2 text-brand-accent">
                    <Shield size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Private & Premium</span>
                  </div>
                  <p className="text-xs font-medium text-white/80">Every featured experience includes a private vehicle and professional guide.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
