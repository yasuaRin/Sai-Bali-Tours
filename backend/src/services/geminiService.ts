import { GoogleGenAI, Type } from '@google/genai';

const MODEL = 'gemini-2.0-flash'; // verify current model name in Google AI Studio

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
  return new GoogleGenAI({ apiKey });
}

export async function askFaq(systemInstruction: string, question: string, history: { role: string; text: string }[]) {
  const ai = getClient();

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction },
  });

  return response.text || '';
}

export const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripName: { type: Type.STRING, description: 'An elegant, bespoke name for this itinerary.' },
    summary: { type: Type.STRING, description: 'A 2-3 sentence overview of this trip.' },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          title: { type: Type.STRING, description: 'Theme of the day.' },
          description: { type: Type.STRING, description: 'Brief overview of the day.' },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "e.g. '08:30 AM - 10:30 AM'" },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                locationName: { type: Type.STRING },
                iconType: {
                  type: Type.STRING,
                  description: "One of: 'culture', 'adventure', 'beach', 'nature', 'food', 'rest'",
                },
                tips: { type: Type.STRING },
              },
              required: ['time', 'title', 'description', 'locationName', 'iconType'],
            },
          },
        },
        required: ['dayNumber', 'title', 'description', 'activities'],
      },
    },
    totalEstimatedCostUSD: { type: Type.INTEGER },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        hotels: { type: Type.ARRAY, items: { type: Type.STRING } },
        packingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        localEtiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['hotels', 'packingTips', 'localEtiquette'],
    },
  },
  required: ['tripName', 'summary', 'days', 'totalEstimatedCostUSD', 'recommendations'],
};

export async function generateItinerary(systemInstruction: string, prompt: string) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: itinerarySchema,
    },
  });

  return JSON.parse(response.text || '{}');
}