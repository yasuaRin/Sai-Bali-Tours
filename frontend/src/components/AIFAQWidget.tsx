import { useState, FormEvent } from 'react';
import { askFaq } from '../services/aiApi';

export default function AIFAQWidget() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const data = await askFaq(question);
      setAnswer(data.answer);
    } catch {
      setAnswer('Sorry, I could not get an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Still have questions?</h3>
      <form onSubmit={handleAsk}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your trip..."
          aria-label="Ask a question"
        />
        <button type="submit" disabled={loading}>{loading ? 'Thinking...' : 'Ask'}</button>
      </form>
      {answer && <p>{answer}</p>}
    </div>
  );
}