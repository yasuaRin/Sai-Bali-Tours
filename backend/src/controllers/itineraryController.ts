import { Request, Response } from 'express';
import { generateItinerary } from '../services/geminiService';
import { getSiteContext } from '../services/contextService';

export async function createItinerary(req: Request, res: Response) {
  const { days, preferences, pace, companion, budget } = req.body;

  const tripDays = Math.min(Math.max(Number(days) || 3, 1), 10);
  const userPreferences = Array.isArray(preferences) ? preferences.join(', ') : preferences || 'Culture, Nature';
  const tripPace = pace || 'Balanced';
  const tripCompanion = companion || 'Couple';
  const tripBudget = budget || 'Premium';

  try {
    const siteContext = await getSiteContext();

    const systemInstruction = `
You are a travel planner for Sai Bali Tours. Build itineraries ONLY using the real tours/packages
listed below where relevant — reference them by name when an activity matches one. If nothing matches
for a particular slot, suggest a sensible nearby Bali activity, clearly logical in sequence (minimize travel back-and-forth).
Output must match the provided JSON schema exactly.

${siteContext}
`;

    const prompt = `
Create a ${tripDays}-day Bali itinerary.
Interests: ${userPreferences}
Pace: ${tripPace}
Traveling with: ${tripCompanion}
Budget style: ${tripBudget}
`;

    const itinerary = await generateItinerary(systemInstruction, prompt);
    res.json(itinerary);
  } catch (err) {
    console.error('Itinerary generation failed:', err);
    res.status(500).json({ error: 'Failed to generate itinerary. Please try again shortly.' });
  }
}