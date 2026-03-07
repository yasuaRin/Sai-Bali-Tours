
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, Compass, Package, MessageSquare, Phone, Calendar, Users, Heart, DollarSign, RotateCcw, ChevronLeft, Map, Zap, Clock, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import MoodExplorer from './TourFinder';

type ChatView = 'main' | 'planning' | 'packages' | 'discovery';
type PlanningStep = 'dates' | 'people' | 'interests' | 'budget';

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ChatView>('main');
  const [planningStep, setPlanningStep] = useState<PlanningStep>('dates');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am your Bali AI Guide. How can I help you plan your perfect trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, currentView]);

  // Listen for external triggers to start the personalized plan
  useEffect(() => {
    const handleTriggerPlan = () => {
      setIsOpen(true);
      setCurrentView('discovery');
    };

    window.addEventListener('open-bali-planner', handleTriggerPlan);
    return () => window.removeEventListener('open-bali-planner', handleTriggerPlan);
  }, []);

  const resetChat = () => {
    setCurrentView('main');
    setPlanningStep('dates');
    setMessages([{ role: 'bot', text: 'Hello! I am your Bali AI Guide. How can I help you plan your perfect trip today?' }]);
    setIsTyping(false);
    setInput('');
  };

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input;
    if (!userMessage.trim()) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    setIsTyping(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a professional travel assistant for Sai Bali Tours. 
          The company offers Combination Tours, Full Day Tours, Half Day Tours, and Adventures.
          Keep answers concise and guide users towards booking via WhatsApp.`
        }
      });

      const botText = response.text || 'I am sorry, I am having trouble connecting. Please contact us via WhatsApp!';
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Something went wrong. Feel free to message our team on WhatsApp!' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'plan') {
      setCurrentView('discovery');
    } else if (action === 'packages') {
      setCurrentView('packages');
      setMessages(prev => [
        ...prev,
        { role: 'user', text: '📦 Browse Tour Packages' },
        { role: 'bot', text: 'Which type of experience are you looking for? Select a category to see all our available tours:' }
      ]);
    } else if (action === 'question') {
      inputRef.current?.focus();
    } else if (action === 'whatsapp') {
      window.open('https://wa.me/628123456789', '_blank');
    }
  };

  const handleCategoryNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      
      {/* Mood Discovery FAB */}
      <div className="relative group">
        <div className="absolute -left-36 top-1/2 -translate-y-1/2 px-4 py-2 bg-brand-anchor text-white rounded-xl shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-4 group-hover:translate-x-0">
           <span className="text-[10px] font-black uppercase tracking-widest">Mood Explorer</span>
        </div>
        <button 
          onClick={() => {
            setIsOpen(true);
            setCurrentView('discovery');
          }}
          className="bg-white text-brand-orange w-12 h-12 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center border border-brand-orange/20"
        >
          <Sparkles size={20} fill="currentColor" className="animate-pulse" />
        </button>
      </div>

      {/* Main Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-orange text-white w-16 h-16 rounded-full shadow-3xl hover:scale-110 transition-all flex items-center justify-center relative group"
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] sm:w-[420px] h-[640px] bg-white rounded-[2.5rem] shadow-3xl flex flex-col overflow-hidden border border-gray-100 animate-fadeInUp origin-bottom-right">
          {/* Header */}
          <div className="bg-brand-anchor p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              {currentView !== 'main' ? (
                <button onClick={resetChat} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors">
                  <ChevronLeft size={18} />
                </button>
              ) : (
                <div className="bg-brand-orange p-2 rounded-xl">
                  <Bot size={20} />
                </div>
              )}
              <div>
                <h3 className="font-black text-xs tracking-tight uppercase">Bali AI Guide</h3>
                <div className="flex items-center text-[9px] text-orange-200/80 font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={resetChat} className="text-white/40 hover:text-white p-1 transition-colors" title="Reset/Back">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-1 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Views */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 custom-scrollbar relative">
            
            {/* Discovery / Personalized Section View */}
            {currentView === 'discovery' ? (
              <div className="h-full bg-white animate-fadeIn">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center space-x-2 text-brand-orange mb-1">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Personalized Explorer</span>
                  </div>
                  <h4 className="text-xl font-black text-brand-text tracking-tight">Find Your Bali Mood</h4>
                </div>
                <div className="p-0 overflow-y-auto no-scrollbar">
                  <MoodExplorer onAction={() => setIsOpen(false)} />
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                    <div className={`max-w-[85%] px-5 py-3.5 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                      m.role === 'user' ? 'bg-brand-orange text-white rounded-tr-none shadow-lg' : 'bg-white text-brand-text rounded-tl-none border border-gray-100 shadow-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}

                {/* Main Menu Options */}
                {currentView === 'main' && messages.length <= 2 && (
                  <div className="grid grid-cols-1 gap-2 pt-2 animate-fadeIn">
                    <button onClick={() => handleQuickAction('plan')} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all text-left group">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                        <Compass size={20} className="text-brand-orange group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-brand-text">🧭 Personalized Travel Plan</span>
                        <span className="text-[10px] text-gray-400 font-medium">Visual AI Discovery Tool</span>
                      </div>
                    </button>
                    <button onClick={() => handleQuickAction('packages')} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all text-left group">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <Package size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-brand-text">📦 Browse Tour Packages</span>
                        <span className="text-[10px] text-gray-400 font-medium">Ready-to-book itineraries</span>
                      </div>
                    </button>
                    <button onClick={() => handleQuickAction('question')} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all text-left group">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                        <MessageSquare size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-brand-text">💬 Ask a Question</span>
                        <span className="text-[10px] text-gray-400 font-medium">Chat with our AI Assistant</span>
                      </div>
                    </button>
                    <button onClick={() => handleQuickAction('whatsapp')} className="flex items-center space-x-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all text-left group">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                        <Phone size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <span className="block text-xs font-black text-brand-text">📞 Talk to Human</span>
                        <span className="text-[10px] text-gray-400 font-medium">Direct WhatsApp Support</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Category Nav View */}
                {currentView === 'packages' && (
                  <div className="grid grid-cols-1 gap-2 pt-2 animate-fadeIn">
                    {[
                      { path: '/tours/combination', label: 'Combination Tours', icon: Zap, color: 'text-brand-orange' },
                      { path: '/tours/full-day', label: 'Full Day Tours', icon: Map, color: 'text-blue-500' },
                      { path: '/tours/half-day', label: 'Half Day Tours', icon: Clock, color: 'text-purple-500' },
                      { path: '/adventures', label: 'Adventure Sports', icon: Compass, color: 'text-green-500' }
                    ].map((cat) => (
                      <button 
                        key={cat.path}
                        onClick={() => handleCategoryNav(cat.path)} 
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-orange hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <cat.icon size={16} className={cat.color} />
                          <span className="text-xs font-bold">{cat.label}</span>
                        </div>
                        <ChevronLeft size={14} className="rotate-180 opacity-40 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
                      Typing...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2 shrink-0">
            <div className="relative flex-1">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Bali tours..."
                disabled={currentView === 'discovery'}
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none transition-all disabled:opacity-50"
              />
            </div>
            <button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || currentView === 'discovery'}
              className="bg-brand-orange text-white p-3 rounded-2xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
