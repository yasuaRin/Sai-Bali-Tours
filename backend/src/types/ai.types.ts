export interface ItineraryRequest {
  destination: string;
  days: number;
  interests?: string;
  budget?: 'budget' | 'moderate' | 'luxury';
  userId?: string; // optional, to save the result
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface ItineraryResponse {
  destination: string;
  days: ItineraryDay[];
}

export interface FaqRequest {
  question: string;
}

export interface FaqResponse {
  answer: string;
  cached: boolean;
}