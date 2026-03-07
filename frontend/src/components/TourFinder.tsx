// src/components/TourFinder.tsx
import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Zap, Coffee, Clock, ArrowRight, Camera, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTourByMood } from '../services/tourService'; // Import function directly, not the object

interface TourItem {
  id: number;
  title: string;
  image: string;
  price: string;
  duration: string;
  category: string;
  slug?: string;
  overview?: string;
}

interface MoodExplorerProps {
  onAction?: () => void;
}

const MoodExplorer: React.FC<MoodExplorerProps> = ({ onAction }) => {
  const [activeMood, setActiveMood] = useState<string>('Culture');
  const [recommendation, setRecommendation] = useState<TourItem | null>(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { id: 'Culture', icon: Compass, label: 'The Seeker', desc: 'Ancient temples & heritage', mood_tag: 'cultural' },
    { id: 'Adrenaline', icon: Zap, label: 'The Explorer', desc: 'Volcanoes & river drops', mood_tag: 'adrenaline' },
    { id: 'Relax', icon: Coffee, label: 'The Relaxer', desc: 'Jungles & sunsets', mood_tag: 'relax' },
    { id: 'Photography', icon: Camera, label: 'The Creator', desc: 'Iconic Instagram spots', mood_tag: 'scenic' }
  ];

  // Fetch recommendation based on mood
  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        // Try to get tour by mood from your service
        const moodTag = moods.find(m => m.id === activeMood)?.mood_tag || activeMood.toLowerCase();
        const tour = await getTourByMood(moodTag); // Call function directly
        
        if (tour) {
          setRecommendation({
            id: tour.id,
            title: tour.title,
            image: tour.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
            price: `From $${tour.starting_price || 99}`,
            duration: tour.duration || 'Full Day',
            category: tour.category?.name || 'Tour',
            slug: tour.slug,
            overview: tour.short_description || undefined
          });
        } else {
          // Fallback recommendation
          setRecommendation(getDefaultRecommendation(activeMood));
        }
      } catch (error) {
        console.error('Error fetching recommendation:', error);
        setRecommendation(getDefaultRecommendation(activeMood));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [activeMood]);

  // Default recommendations based on mood
  const getDefaultRecommendation = (mood: string): TourItem => {
    const defaults: Record<string, TourItem> = {
      'Culture': {
        id: 1,
        title: 'Uluwatu Temple Sunset Tour',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        price: 'From $79',
        duration: 'Half Day',
        category: 'Cultural',
        overview: 'Visit the stunning Uluwatu Temple and witness the famous Kecak dance at sunset.'
      },
      'Adrenaline': {
        id: 2,
        title: 'ATV Quad Bike Adventure',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        price: 'From $89',
        duration: 'Half Day',
        category: 'Adventure',
        overview: 'Ride through rice fields, bamboo forests, and rivers on this thrilling ATV adventure.'
      },
      'Relax': {
        id: 3,
        title: 'Ubud Spa & Rice Terraces',
        image: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?auto=format&fit=crop&w=800&q=80',
        price: 'From $69',
        duration: 'Full Day',
        category: 'Relaxation',
        overview: 'Relax with a traditional Balinese massage and visit the stunning Tegallalang Rice Terraces.'
      },
      'Photography': {
        id: 4,
        title: 'Instagram Bali: Gates & Waterfalls',
        image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
        price: 'From $99',
        duration: 'Full Day',
        category: 'Photography',
        overview: 'Visit Bali\'s most photogenic spots including the Handara Gate, Lempuyang, and hidden waterfalls.'
      }
    };
    return defaults[mood] || defaults['Culture'];
  };

  const currentRecommendation = recommendation || getDefaultRecommendation(activeMood);

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Mood Selector Grid */}
      <div className="p-4 grid grid-cols-2 gap-2 bg-gray-50/50">
        {moods.map((mood) => (
          <button 
            key={mood.id}
            onClick={() => setActiveMood(mood.id)}
            className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 border ${
              activeMood === mood.id 
                ? 'bg-white shadow-md border-brand-orange/20' 
                : 'bg-transparent border-transparent hover:bg-gray-100/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
              activeMood === mood.id ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              <mood.icon size={18} />
            </div>
            <div className={`text-[9px] font-black uppercase tracking-widest text-center ${activeMood === mood.id ? 'text-brand-orange' : 'text-gray-400'}`}>
              {mood.label}
            </div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        /* Result Card */
        <div className="p-4 bg-white">
          <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden group mb-4 shadow-sm">
            <img 
              src={currentRecommendation.image} 
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
              alt={currentRecommendation.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-4">
              <div className="bg-brand-orange text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md">
                {currentRecommendation.price}
              </div>
            </div>
          </div>
          
          <div className="px-1">
            <div className="flex items-center space-x-2 text-brand-orange mb-2">
              <Heart size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">Top Pick for You</span>
            </div>
            <h4 className="text-xl font-black text-brand-text leading-tight mb-2 tracking-tight">{currentRecommendation.title}</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
              {currentRecommendation.overview}
            </p>
            
            <div className="flex items-center justify-between mb-6 text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-4">
              <div className="flex items-center">
                <Clock size={12} className="mr-1.5 text-brand-orange" />
                {currentRecommendation.duration}
              </div>
              <div className="flex items-center">
                <Sparkles size={12} className="mr-1.5 text-brand-accent" />
                Premium Quality
              </div>
            </div>

            <Link 
              to={`/tour/${currentRecommendation.slug || currentRecommendation.id}`}
              onClick={onAction}
              className="group flex items-center justify-between bg-brand-anchor text-white px-6 py-4 rounded-xl hover:bg-brand-orange transition-all duration-300 shadow-xl"
            >
              <span className="text-xs font-black uppercase tracking-widest">View Full Itinerary</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodExplorer;