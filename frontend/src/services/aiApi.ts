export interface Activity {
  time: string;
  title: string;
  description: string;
  locationName: string;
  iconType: string;
  tips?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  description: string;
  activities: Activity[];
}

export interface ItineraryResult {
  tripName: string;
  summary: string;
  days: DayPlan[];
  totalEstimatedCostUSD: number;
  recommendations: {
    hotels: string[];
    packingTips: string[];
    localEtiquette: string[];
  };
}

export interface ItineraryParams {
  days: number;
  preferences: string;
  pace: string;
  companion: string;
  budget: string;
}

export interface FaqMessage {
  role: 'user' | 'bot';
  text: string;
}

export interface FaqResponse {
  answer: string;
  cached: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getItinerary(params: ItineraryParams): Promise<ItineraryResult> {
  const res = await fetch(`${BASE_URL}/itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate itinerary');
  }
  return res.json();
}

export async function askFaq(question: string, history: FaqMessage[]): Promise<FaqResponse> {
  const res = await fetch(`${BASE_URL}/faq`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to get answer');
  }
  return res.json();
}