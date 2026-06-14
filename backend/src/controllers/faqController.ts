import { Request, Response } from 'express';
import { askFaq } from '../services/geminiService';
import { getSiteContext } from '../services/contextService';
import { supabase } from '../lib/supabaseClient';

export async function answerFaq(req: Request, res: Response) {
  const { question, history } = req.body as {
    question?: string;
    history?: { role: 'user' | 'bot'; text: string }[];
  };

  if (!question?.trim()) {
    return res.status(400).json({ error: 'question is required' });
  }

  const normalized = question.trim().toLowerCase();

  // Only use cache for first-turn questions (no history) to keep conversations contextual
  if (!history || history.length === 0) {
    const { data: cached } = await supabase
      .from('faq_cache')
      .select('answer')
      .eq('question', normalized)
      .maybeSingle();

    if (cached) {
      return res.json({ answer: cached.answer, cached: true });
    }
  }

  try {
    const siteContext = await getSiteContext();
    const systemInstruction = `
You are the AI concierge for Sai Bali Tours. Use ONLY the information below to answer.
If asked about something not covered, politely say you'll connect them with the team on WhatsApp.
Keep answers under 4 short paragraphs, warm and professional, no emojis.

${siteContext}
`;

    const answer = await askFaq(systemInstruction, question, history || []);

    if (!history || history.length === 0) {
      supabase.from('faq_cache').insert({ question: normalized, answer }).then(({ error }) => {
        if (error) console.error('Failed to cache FAQ:', error);
      });
    }

    res.json({ answer, cached: false });
  } catch (err) {
    console.error('FAQ generation failed:', err);
    res.status(500).json({ error: 'Failed to get answer' });
  }
}