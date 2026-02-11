// src/components/Reviews.tsx
import React from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews = [] }) => {
  // Default reviews if none provided
  const defaultReviews: Review[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      text: 'Absolutely breathtaking experience! The tour guides were knowledgeable and the views were unforgettable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d3?w=150&h=150&fit=crop&crop=face',
      country: 'Australia',
      featured: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      text: 'Professional service from start to finish. The sunset views at the temple were magical.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      country: 'Singapore',
      featured: true
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      text: 'Our family had the best vacation! The kids loved the rafting adventure. Highly recommended!',
      rating: 4,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      country: 'Spain',
      featured: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {displayReviews.map((review) => (
        <div key={review.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={16} className="text-brand-orange fill-brand-orange" />
            ))}
          </div>
          <p className="text-gray-500 italic mb-8 flex-1 leading-relaxed">"{review.text}"</p>
          <div className="flex items-center space-x-4">
            <img 
              src={review.avatar} 
              alt={review.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-bold text-brand-text">{review.name}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{review.country}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;