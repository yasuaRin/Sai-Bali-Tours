import { useState, useRef, useEffect } from 'react';
import {
  X, Send, Bot, Phone, RotateCcw, ChevronLeft,
  Map, Zap, Sparkles, HelpCircle, BookOpen, Calendar, ShieldCheck,
  Compass, Check, Loader2, Footprints, AlertTriangle,
  Maximize2, Minimize2, Edit, Plus, Trash2, CheckCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { askFaq } from '../services/aiApi';

import type {
  Activity,
  DayPlan,
  ItineraryResult,
  FaqMessage,
  FaqResponse
} from '../services/aiApi';

type TabView = 'itinerary' | 'faq';
type ItineraryStep = 'form' | 'loading' | 'result';

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '628123456789';

const INSTANT_FAQS = [
  {
    question: 'Is transport private?',
    answer: 'Yes — all our vehicles are 100% private, never shared with strangers. Clean, air-conditioned MPVs/SUVs with a licensed local driver.',
  },
  {
    question: 'Are there hidden fees?',
    answer: 'No. Pricing is fully transparent — no booking fees or surprise charges. Entrance tickets and meals are paid on-site.',
  },
  {
    question: 'How do I book a tour?',
    answer: 'Use the WhatsApp button on this site to message our team directly, or build a custom itinerary above and send it to us.',
  },
];

const COMPANIONS = [
  { id: 'solo', label: 'Solo Traveler', desc: 'Indulge in absolute self-discovery' },
  { id: 'couple', label: 'Couple / Honeymoon', desc: 'Romantic and private scenic vistas' },
  { id: 'family', label: 'Family with Kids', desc: 'Safe, educational, relaxed pacing' },
  { id: 'friends', label: 'Group of Friends', desc: 'Fun-filled action and photogenic views' },
];

const BUDGET_OPTIONS = [
  { id: 'comfort', label: 'Comfort Care', desc: 'Curated value with top-tier private driver' },
  { id: 'premium', label: 'Premium Select', desc: 'Stellar boutique guides and luxury MPV' },
  { id: 'luxury', label: 'Signature VIP', desc: 'Ultimate lavish stays and VIP priority access' },
];

const PACING_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed and Easy', desc: '1-2 scenic highlights with plenty of leisure' },
  { id: 'balanced', label: 'Balanced Pacing', desc: 'Comfortable tempo, perfect blend of sights' },
  { id: 'active', label: 'Packed Adventure', desc: 'Capture sunset and sunrise highlights' },
];

const CHIP_PREFERENCES = [
  { id: 'culture', label: 'Heritage and Ubud Culture' },
  { id: 'adventure', label: 'Volcano and Hiking' },
  { id: 'water', label: 'Snorkeling and Beaches' },
  { id: 'thrill', label: 'Rafting and ATV Rides' },
  { id: 'romantic', label: 'Sunset and Swing' },
  { id: 'wellness', label: 'Spa and Fine Dining' },
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('itinerary');

  const [days, setDays] = useState<number>(3);
  const [companion, setCompanion] = useState<string>('couple');
  const [budget, setBudget] = useState<string>('premium');
  const [pace, setPace] = useState<string>('balanced');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['culture', 'romantic']);
  const [itineraryStep, setItineraryStep] = useState<ItineraryStep>('form');
  const [itineraryResult, setItineraryResult] = useState<ItineraryResult | null>(null);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);

  const [faqInput, setFaqInput] = useState('');
  const [faqHistory, setFaqHistory] = useState<FaqMessage[]>([
    { role: 'bot', text: 'Hi! I can help with tour info, pricing, or planning your trip. What would you like to know?' },
  ]);
  const [isFaqTyping, setIsFaqTyping] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [faqHistory, isFaqTyping]);

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleTripNameChange = (name: string) => {
    if (!itineraryResult) return;
    setItineraryResult({ ...itineraryResult, tripName: name });
  };

  const handleSummaryChange = (summary: string) => {
    if (!itineraryResult) return;
    setItineraryResult({ ...itineraryResult, summary });
  };

  const handleTotalCostChange = (cost: number) => {
    if (!itineraryResult) return;
    setItineraryResult({ ...itineraryResult, totalEstimatedCostUSD: cost });
  };

  const handleDayTitleChange = (dayIdx: number, newTitle: string) => {
    if (!itineraryResult) return;
    const updatedDays = [...itineraryResult.days];
    if (updatedDays[dayIdx]) {
      updatedDays[dayIdx] = { ...updatedDays[dayIdx], title: newTitle };
      setItineraryResult({ ...itineraryResult, days: updatedDays });
    }
  };

  const handleDayDescriptionChange = (dayIdx: number, newDesc: string) => {
    if (!itineraryResult) return;
    const updatedDays = [...itineraryResult.days];
    if (updatedDays[dayIdx]) {
      updatedDays[dayIdx] = { ...updatedDays[dayIdx], description: newDesc };
      setItineraryResult({ ...itineraryResult, days: updatedDays });
    }
  };

  const handleActivityChange = (dayIdx: number, actIdx: number, field: keyof Activity, value: string) => {
    if (!itineraryResult) return;
    const updatedDays = [...itineraryResult.days];
    if (updatedDays[dayIdx]?.activities[actIdx]) {
      const updatedActivities = [...updatedDays[dayIdx].activities];
      updatedActivities[actIdx] = { ...updatedActivities[actIdx], [field]: value };
      updatedDays[dayIdx] = { ...updatedDays[dayIdx], activities: updatedActivities };
      setItineraryResult({ ...itineraryResult, days: updatedDays });
    }
  };

  const handleDeleteActivity = (dayIdx: number, actIdx: number) => {
    if (!itineraryResult) return;
    const updatedDays = [...itineraryResult.days];
    if (updatedDays[dayIdx]) {
      const updatedActivities = updatedDays[dayIdx].activities.filter((_, idx) => idx !== actIdx);
      updatedDays[dayIdx] = { ...updatedDays[dayIdx], activities: updatedActivities };
      setItineraryResult({ ...itineraryResult, days: updatedDays });
    }
  };

  const handleAddActivity = (dayIdx: number) => {
    if (!itineraryResult) return;
    const updatedDays = [...itineraryResult.days];
    if (updatedDays[dayIdx]) {
      const newActivity: Activity = {
        time: '10:00 AM - 12:00 PM',
        title: 'New Custom Destination',
        description: 'Add a personalized description of this stop.',
        locationName: 'Bali landmark',
        iconType: 'culture',
        tips: '',
      };
      updatedDays[dayIdx] = { ...updatedDays[dayIdx], activities: [...updatedDays[dayIdx].activities, newActivity] };
      setItineraryResult({ ...itineraryResult, days: updatedDays });
    }
  };

  const handleRecommendationChange = (
    section: 'hotels' | 'packingTips' | 'localEtiquette',
    idx: number,
    value: string
  ) => {
    if (!itineraryResult) return;
    const sectionList = [...itineraryResult.recommendations[section]];
    sectionList[idx] = value;
    setItineraryResult({
      ...itineraryResult,
      recommendations: { ...itineraryResult.recommendations, [section]: sectionList },
    });
  };

  const handleAddRecommendation = (section: 'hotels' | 'packingTips' | 'localEtiquette') => {
    if (!itineraryResult) return;
    setItineraryResult({
      ...itineraryResult,
      recommendations: {
        ...itineraryResult.recommendations,
        [section]: [...itineraryResult.recommendations[section], 'New recommendation'],
      },
    });
  };

  const handleDeleteRecommendation = (section: 'hotels' | 'packingTips' | 'localEtiquette', idx: number) => {
    if (!itineraryResult) return;
    setItineraryResult({
      ...itineraryResult,
      recommendations: {
        ...itineraryResult.recommendations,
        [section]: itineraryResult.recommendations[section].filter((_, i) => i !== idx),
      },
    });
  };

  const handleGenerateItinerary = async () => {
    setItineraryStep('loading');
    setItineraryResult(null);
    setItineraryError(null);
    setSelectedDayIndex(0);

    const preferenceLabels = CHIP_PREFERENCES.filter((p) => selectedPrefs.includes(p.id))
      .map((p) => p.label)
      .join(', ');

    try {
      const data = await getItinerary({
        days,
        preferences: preferenceLabels || 'Culture, Nature',
        pace: PACING_OPTIONS.find((p) => p.id === pace)?.label || 'Balanced',
        companion: COMPANIONS.find((c) => c.id === companion)?.label || 'Couple',
        budget: BUDGET_OPTIONS.find((b) => b.id === budget)?.label || 'Premium',
      });
      setItineraryResult(data);
      setItineraryStep('result');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setItineraryError(message);
      setItineraryStep('form');
    }
  };

  const clearItinerary = () => {
    setItineraryStep('form');
    setItineraryResult(null);
    setItineraryError(null);
    setIsEditing(false);
  };

  const handleSendFaq = async (customQuestion?: string) => {
    const userQuestion = customQuestion || faqInput;
    if (!userQuestion.trim()) return;
    if (!customQuestion) setFaqInput('');
    const historyBeforeSend = faqHistory;
    setFaqHistory((prev) => [...prev, { role: 'user', text: userQuestion }]);
    setIsFaqTyping(true);
    try {
      const { answer } = await askFaq(userQuestion, historyBeforeSend);
      setFaqHistory((prev) => [...prev, { role: 'bot', text: answer }]);
    } catch {
      setFaqHistory((prev) => [
        ...prev,
        { role: 'bot', text: `Sorry, something went wrong. Please contact us on WhatsApp +${WHATSAPP_NUMBER}.` },
      ]);
    } finally {
      setIsFaqTyping(false);
    }
  };

  const getVibeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'culture': return <BookOpen size={16} className="text-amber-500" />;
      case 'adventure': return <Zap size={16} className="text-brand-orange" />;
      case 'beach':
      case 'water': return <Compass size={16} className="text-blue-500" />;
      case 'nature': return <Map size={16} className="text-emerald-500" />;
      case 'food': return <Sparkles size={16} className="text-amber-600" />;
      default: return <Compass size={16} className="text-brand-orange" />;
    }
  };

  const getChipIcon = (id: string) => {
    switch (id) {
      case 'culture': return <BookOpen size={14} className="text-amber-500 mr-2 shrink-0" />;
      case 'adventure': return <Zap size={14} className="text-brand-orange mr-2 shrink-0" />;
      case 'water': return <Compass size={14} className="text-blue-500 mr-2 shrink-0" />;
      case 'thrill': return <Zap size={14} className="text-red-500 mr-2 shrink-0" />;
      case 'romantic': return <Sparkles size={14} className="text-rose-500 mr-2 shrink-0" />;
      case 'wellness': return <ShieldCheck size={14} className="text-emerald-500 mr-2 shrink-0" />;
      default: return <Compass size={14} className="text-gray-400 mr-2 shrink-0" />;
    }
  };

  const openWhatsAppItinerary = () => {
    if (!itineraryResult) return;
    let daysDescription = '';
    itineraryResult.days.forEach((day) => {
      daysDescription += `\n*Day ${day.dayNumber}: ${day.title}*\n`;
      day.activities.forEach((act) => {
        daysDescription += `- ${act.time}: ${act.title} at ${act.locationName}\n`;
      });
    });
    const summaryMsg =
      `Hi! I built a custom itinerary on your website:\n` +
      `*Trip Name*: ${itineraryResult.tripName}\n` +
      `*Summary*: ${itineraryResult.summary}\n` +
      `${daysDescription}\n` +
      `Could you confirm pricing and availability for this plan?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summaryMsg)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3" id="ai-planner-widget">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-orange text-white px-5 sm:px-6 h-16 rounded-3xl shadow-[0_20px_50px_rgba(242,140,51,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="bg-white/20 p-2 rounded-xl">
          {isOpen ? <X size={18} /> : <Compass size={18} className="animate-spin-slow" />}
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] font-black uppercase tracking-wider leading-none">AI Assistant</span>
          <span className="text-xs font-black tracking-tight leading-none mt-1">FAQ and Planner</span>
        </div>
      </button>

      {/* Floating Panel */}
      {isOpen && (
        <div
          className={`absolute bottom-20 right-0 h-[82vh] max-h-[740px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-gray-100 animate-fadeInUp origin-bottom-right transition-all duration-300 ${
            isExpanded ? 'w-[92vw] lg:w-[1050px] xl:w-[1180px]' : 'w-[92vw] sm:w-[480px] md:w-[560px]'
          }`}
        >
          {/* Header */}
          <div className="bg-brand-anchor p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-orange p-2.5 rounded-2xl shadow-lg">
                <Bot size={22} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-xs tracking-tight uppercase leading-none">Bali Travel AI</h3>
                <p className="text-[9px] text-orange-200 uppercase tracking-widest mt-1.5 font-bold flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Live trip data
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden md:block text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-100 shrink-0 bg-gray-50/50">
            {(['itinerary', 'faq'] as TabView[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 flex items-center justify-center space-x-2 transition-all ${
                  activeTab === tab ? 'border-brand-orange text-brand-orange bg-white' : 'border-transparent text-gray-400 hover:text-brand-text'
                }`}
              >
                {tab === 'itinerary' ? <Calendar size={13} /> : <HelpCircle size={13} />}
                <span>{tab === 'itinerary' ? 'Itinerary Generator' : 'Smart FAQ Guide'}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/30 relative flex flex-col">

            {/* ── ITINERARY TAB ── */}
            {activeTab === 'itinerary' && (
              <div className={`flex-1 flex flex-col ${isExpanded ? 'lg:flex-row lg:overflow-hidden' : ''}`}>

                {/* FORM */}
                {itineraryStep === 'form' && (
                  <>
                    <div className={`space-y-6 text-brand-text ${isExpanded ? 'lg:w-[45%] lg:border-r lg:border-gray-100 lg:overflow-y-auto lg:h-full p-5 sm:p-6 lg:p-8' : 'p-5 sm:p-6 flex-1'}`}>
                      <div className="bg-brand-highlight/20 p-4 rounded-2xl border border-brand-orange/10 flex items-start space-x-3">
                        <Sparkles className="text-brand-orange shrink-0 mt-0.5" size={18} />
                        <div className="text-left">
                          <h4 className="text-xs font-black uppercase tracking-wider text-brand-orange">AI Destination Planner</h4>
                          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mt-1">
                            Build a personalized day-by-day route using our real tours and packages.
                          </p>
                        </div>
                      </div>

                      {itineraryError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold p-3 rounded-xl">
                          {itineraryError}
                        </div>
                      )}

                      {/* Duration */}
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration of stay (Days)</label>
                          <span className="text-sm font-black text-brand-orange bg-orange-50 px-3 py-1 rounded-xl">{days} Days</span>
                        </div>
                        <input
                          type="range" min="1" max="10" value={days}
                          onChange={(e) => setDays(Number(e.target.value))}
                          className="w-full accent-brand-orange h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] font-black tracking-widest text-gray-400 uppercase">
                          <span>1 Day</span><span>5 Days</span><span>10 Days</span>
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Favorite Activities and Vibes</label>
                        <div className="grid grid-cols-2 gap-2">
                          {CHIP_PREFERENCES.map((pref) => {
                            const isSelected = selectedPrefs.includes(pref.id);
                            return (
                              <button key={pref.id} onClick={() => togglePref(pref.id)}
                                className={`p-3 rounded-xl text-[11px] font-bold text-left transition-all border flex items-center justify-between ${
                                  isSelected ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-sm' : 'bg-white border-gray-100 text-brand-text hover:border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">{getChipIcon(pref.id)}<span>{pref.label}</span></div>
                                {isSelected && <Check size={12} className="text-brand-orange shrink-0 ml-1.5" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Companion */}
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">With whom are you traveling?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {COMPANIONS.map((comp) => (
                            <button key={comp.id} onClick={() => setCompanion(comp.id)}
                              className={`p-3 rounded-xl text-left transition-all border text-xs ${
                                companion === comp.id ? 'bg-brand-anchor text-white border-brand-anchor font-bold shadow-md' : 'bg-white border-gray-100 text-brand-text hover:border-gray-200'
                              }`}
                            >
                              <span className="block font-black text-[11px] uppercase tracking-wide">{comp.label}</span>
                              <span className={`block text-[8px] mt-0.5 ${companion === comp.id ? 'text-orange-200/80' : 'text-gray-400 font-medium'}`}>{comp.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pace */}
                      <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tour Pacing Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {PACING_OPTIONS.map((p) => (
                            <button key={p.id} onClick={() => setPace(p.id)}
                              className={`p-2.5 rounded-xl text-center transition-all border ${
                                pace === p.id ? 'bg-brand-orange border-brand-orange text-white font-bold shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                              }`}
                            >
                              <span className="block font-bold text-[10px] tracking-tight">{p.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="space-y-3 text-left pb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Charter Class and Budget</label>
                        <div className="grid grid-cols-3 gap-2">
                          {BUDGET_OPTIONS.map((b) => (
                            <button key={b.id} onClick={() => setBudget(b.id)}
                              className={`p-2.5 rounded-xl text-center transition-all border ${
                                budget === b.id ? 'bg-brand-orange border-brand-orange text-white font-bold shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                              }`}
                            >
                              <span className="block font-bold text-[10px] tracking-tight">{b.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button onClick={handleGenerateItinerary}
                        className="w-full bg-brand-orange text-white py-4 flex justify-center items-center space-x-3 text-xs shadow-xl shadow-brand-orange/20 hover:bg-orange-600 transition-all hover:scale-[1.01] active:scale-95 rounded-xl"
                      >
                        <Compass className="animate-spin-slow text-white" size={16} />
                        <span className="uppercase font-black tracking-widest">Generate Itinerary</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="hidden lg:flex lg:w-[55%] lg:h-full bg-slate-50/40 flex-col justify-center items-center p-8 text-center text-brand-text">
                        <div className="max-w-md space-y-6">
                          <div className="bg-brand-orange/10 p-5 rounded-3xl inline-block text-brand-orange">
                            <Compass size={40} className="animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black tracking-[0.25em] text-brand-orange uppercase">Bespoke Travel Builder</span>
                            <h4 className="text-2xl font-black tracking-tight mt-1">Your Custom Itinerary</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-3 font-semibold">
                              Select your parameters on the left — our planner builds a logical, day-by-day route using real available tours.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* LOADING */}
                {itineraryStep === 'loading' && (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-brand-text min-h-[350px] w-full">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-orange-100 border-t-brand-orange rounded-full animate-spin" />
                      <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-orange animate-pulse" size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-orange">Consulting AI</span>
                    <h4 className="text-xl font-black mt-2 tracking-tight">Designing Your Schedule...</h4>
                    <p className="text-[11px] text-gray-500 font-semibold leading-relaxed max-w-sm mt-3">
                      Plotting transit details, local tips, and sequencing based on available tours.
                    </p>
                  </div>
                )}

                {/* RESULT */}
                {itineraryStep === 'result' && itineraryResult && (
                  <>
                    {/* Left Pane */}
                    <div className={`space-y-6 text-brand-text ${isExpanded ? 'lg:w-[45%] lg:border-r lg:border-gray-100 lg:overflow-y-auto lg:h-full p-5 sm:p-6 lg:p-8' : 'p-5 sm:p-6'}`}>
                      {isEditing ? (
                        <div className="bg-brand-anchor text-white p-5 rounded-2xl text-left shadow-md space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-brand-orange text-white px-2.5 py-1 rounded-full">Editing</span>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-bold text-gray-300">Est. Cost (USD):</span>
                              <input type="number" value={itineraryResult.totalEstimatedCostUSD}
                                onChange={(e) => handleTotalCostChange(Number(e.target.value) || 0)}
                                className="w-14 bg-white/20 text-white rounded px-1.5 py-0.5 text-xs text-center font-bold outline-none focus:bg-white focus:text-brand-text"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-bold text-gray-300 uppercase tracking-wider block">Trip Name</label>
                            <input type="text" value={itineraryResult.tripName}
                              onChange={(e) => handleTripNameChange(e.target.value)}
                              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none border border-transparent focus:border-brand-orange focus:bg-white focus:text-brand-text"
                            />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="text-[8px] font-bold text-gray-300 uppercase tracking-wider block">Trip Summary</label>
                            <textarea value={itineraryResult.summary} rows={3}
                              onChange={(e) => handleSummaryChange(e.target.value)}
                              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-[11px] font-semibold outline-none border border-transparent focus:border-brand-orange focus:bg-white focus:text-brand-text leading-relaxed"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-brand-anchor text-white p-5 rounded-3xl text-left shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-brand-orange text-white px-2.5 py-1 rounded-full animate-pulse">Custom Plan</span>
                            <span className="text-[9px] font-black text-orange-200">~${itineraryResult.totalEstimatedCostUSD} USD / Person</span>
                          </div>
                          <h4 className="text-lg font-black tracking-tight mt-3">{itineraryResult.tripName}</h4>
                          <p className="text-[11px] text-orange-100/90 leading-relaxed font-semibold mt-1.5">{itineraryResult.summary}</p>
                        </div>
                      )}

                      {/* Day selector */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select Travel Day</label>
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 text-xs">
                          {itineraryResult.days.map((day, idx) => (
                            <button key={day.dayNumber} onClick={() => setSelectedDayIndex(idx)}
                              className={`px-4 py-2.5 rounded-xl font-black uppercase tracking-wider shrink-0 transition-all ${
                                selectedDayIndex === idx ? 'bg-brand-orange text-white shadow-md' : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-200'
                              }`}
                            >
                              Day {day.dayNumber}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {isEditing ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-left space-y-4 shadow-sm">
                          {(['hotels', 'packingTips', 'localEtiquette'] as const).map((section) => (
                            <div key={section} className={section !== 'hotels' ? 'border-t border-gray-100 pt-3' : ''}>
                              <div className="flex justify-between items-center">
                                <h6 className={`text-[10px] font-black uppercase tracking-wider flex items-center ${section === 'localEtiquette' ? 'text-red-600' : 'text-brand-orange'}`}>
                                  {section === 'hotels' && <ShieldCheck size={12} className="mr-1.5" />}
                                  {section === 'packingTips' && <Footprints size={12} className="mr-1.5" />}
                                  {section === 'localEtiquette' && <AlertTriangle size={12} className="mr-1.5" />}
                                  {section === 'hotels' ? 'Accommodation Areas' : section === 'packingTips' ? 'Packing Tips' : 'Local Etiquette'}
                                </h6>
                                <button onClick={() => handleAddRecommendation(section)}
                                  className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${section === 'localEtiquette' ? 'text-red-600 hover:bg-red-100 bg-red-50' : 'text-brand-orange hover:bg-orange-100 bg-orange-50'}`}
                                >Add +</button>
                              </div>
                              <div className="space-y-1.5 mt-2.5">
                                {itineraryResult.recommendations[section].map((val, i) => (
                                  <div key={i} className="flex items-center space-x-1.5">
                                    <input type="text" value={val}
                                      onChange={(e) => handleRecommendationChange(section, i, e.target.value)}
                                      className="flex-grow bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none"
                                    />
                                    <button onClick={() => handleDeleteRecommendation(section, i)} className="text-gray-400 hover:text-red-500 p-1">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left space-y-4 shadow-sm">
                          {(['hotels', 'packingTips', 'localEtiquette'] as const).map((section, si) => (
                            <div key={section} className={si > 0 ? 'border-t border-gray-100 pt-3' : ''}>
                              <h6 className={`text-[10px] font-black uppercase tracking-wider flex items-center ${section === 'localEtiquette' ? 'text-red-600' : 'text-brand-orange'}`}>
                                {section === 'hotels' && <ShieldCheck size={12} className="mr-1.5" />}
                                {section === 'packingTips' && <Footprints size={12} className="mr-1.5" />}
                                {section === 'localEtiquette' && <AlertTriangle size={12} className="mr-1.5" />}
                                {section === 'hotels' ? 'Accommodation Areas' : section === 'packingTips' ? 'Packing Tips' : 'Local Etiquette'}
                              </h6>
                              <ul className="list-disc list-inside text-[11px] text-gray-500 font-semibold space-y-1 mt-1.5">
                                {itineraryResult.recommendations[section].map((val, i) => <li key={i}>{val}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-3 pb-6 shrink-0">
                        {isEditing ? (
                          <button onClick={() => setIsEditing(false)}
                            className="w-full bg-brand-orange text-white py-4 rounded-xl hover:bg-orange-600 transition-all text-xs uppercase font-black tracking-widest shadow-xl flex items-center justify-center space-x-2"
                          >
                            <CheckCircle size={15} /><span>Save Changes</span>
                          </button>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setIsEditing(true)}
                              className="bg-brand-anchor hover:bg-brand-text text-white p-4 rounded-xl transition-all text-[11px] uppercase font-black tracking-widest shadow-sm flex items-center justify-center space-x-2"
                            >
                              <Edit size={13} /><span>Edit Itinerary</span>
                            </button>
                            <button onClick={openWhatsAppItinerary}
                              className="bg-brand-orange text-white p-4 rounded-xl hover:bg-orange-600 transition-all text-[11px] uppercase font-black tracking-widest shadow-xl flex items-center justify-center space-x-2"
                            >
                              <Phone size={13} /><span>Send via WhatsApp</span>
                            </button>
                          </div>
                        )}
                        {!isEditing && (
                          <button onClick={clearItinerary}
                            className="w-full p-4 rounded-xl border border-gray-100 hover:bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-500 transition-colors flex items-center justify-center space-x-1"
                          >
                            <RotateCcw size={12} /><span>Reset Plan</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right Pane: Day Content */}
                    <div className={`flex-1 flex flex-col space-y-6 ${isExpanded ? 'lg:w-[55%] lg:overflow-y-auto lg:h-full p-5 sm:p-6 lg:p-8 bg-slate-50/20' : 'p-5 sm:p-6 pt-0'}`}>
                      {itineraryResult.days[selectedDayIndex] && (
                        <div className="space-y-5 text-left">
                          {isEditing ? (
                            <div className="bg-brand-highlight/30 p-4 rounded-xl border border-brand-orange/15 space-y-2.5">
                              <div>
                                <label className="text-[8px] font-black uppercase tracking-widest text-brand-orange block">Day Theme Title</label>
                                <input type="text" value={itineraryResult.days[selectedDayIndex].title}
                                  onChange={(e) => handleDayTitleChange(selectedDayIndex, e.target.value)}
                                  className="w-full bg-white text-brand-text border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-black uppercase tracking-widest text-brand-orange block">Day Summary</label>
                                <input type="text" value={itineraryResult.days[selectedDayIndex].description}
                                  onChange={(e) => handleDayDescriptionChange(selectedDayIndex, e.target.value)}
                                  className="w-full bg-white text-brand-text border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none mt-1"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-brand-highlight/35 p-4 rounded-xl border border-brand-orange/5">
                              <span className="text-[8px] font-black uppercase tracking-widest text-brand-orange">Day {selectedDayIndex + 1} Theme</span>
                              <h5 className="font-black text-sm text-brand-text leading-tight mt-0.5">{itineraryResult.days[selectedDayIndex].title}</h5>
                              <p className="text-[11px] text-gray-500 leading-normal font-semibold mt-1">{itineraryResult.days[selectedDayIndex].description}</p>
                            </div>
                          )}

                          <div className="relative pl-6 border-l-2 border-orange-100/80 ml-2.5 space-y-5 py-2">
                            {itineraryResult.days[selectedDayIndex].activities.map((act, actIdx) => (
                              <div key={actIdx} className="relative">
                                {!isEditing && (
                                  <div className="absolute -left-[35px] top-0 w-[18px] h-[18px] rounded-full bg-white border-2 border-brand-orange flex items-center justify-center shadow-sm">
                                    {getVibeIcon(act.iconType)}
                                  </div>
                                )}
                                {isEditing ? (
                                  <div className="bg-white p-4 rounded-xl border border-brand-orange/20 shadow-sm space-y-3 relative">
                                    <button onClick={() => handleDeleteActivity(selectedDayIndex, actIdx)}
                                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-3 text-left">
                                      <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Time</label>
                                        <input type="text" value={act.time}
                                          onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'time', e.target.value)}
                                          className="w-full bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none mt-1"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Location</label>
                                        <input type="text" value={act.locationName}
                                          onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'locationName', e.target.value)}
                                          className="w-full bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none mt-1"
                                        />
                                      </div>
                                    </div>
                                    <div className="text-left">
                                      <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Title</label>
                                      <input type="text" value={act.title}
                                        onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'title', e.target.value)}
                                        className="w-full bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold outline-none mt-1"
                                      />
                                    </div>
                                    <div className="text-left">
                                      <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Description</label>
                                      <textarea value={act.description} rows={2}
                                        onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'description', e.target.value)}
                                        className="w-full bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none leading-relaxed mt-1"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-left">
                                      <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Tips</label>
                                        <input type="text" value={act.tips || ''}
                                          onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'tips', e.target.value)}
                                          className="w-full bg-gray-50 text-amber-900 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none mt-1"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Vibe</label>
                                        <select value={act.iconType}
                                          onChange={(e) => handleActivityChange(selectedDayIndex, actIdx, 'iconType', e.target.value)}
                                          className="w-full bg-gray-50 text-brand-text border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-none mt-1 cursor-pointer"
                                        >
                                          <option value="culture">Culture</option>
                                          <option value="adventure">Adventure</option>
                                          <option value="water">Beach / Water</option>
                                          <option value="nature">Nature</option>
                                          <option value="food">Food</option>
                                          <option value="rest">Rest</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                                    <span className="text-[9px] font-black text-brand-orange uppercase bg-orange-50/70 px-2 py-0.5 rounded-md inline-block">{act.time}</span>
                                    <h6 className="font-extrabold text-xs text-brand-text mt-1.5">{act.title}</h6>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tight flex items-center mt-0.5">
                                      <Map size={8} className="mr-1" />{act.locationName}
                                    </span>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-semibold mt-1.5">{act.description}</p>
                                    {act.tips && (
                                      <div className="mt-2 text-[9px] text-amber-700 font-extrabold flex items-center bg-amber-50/65 p-2 rounded-lg border border-amber-100/50">
                                        <Sparkles size={11} className="mr-1 shrink-0 text-amber-600" />
                                        <span>Tip: {act.tips}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {isEditing && (
                            <button onClick={() => handleAddActivity(selectedDayIndex)}
                              className="w-full bg-orange-50/40 hover:bg-orange-100/80 text-brand-orange border border-dashed border-brand-orange/40 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <Plus size={14} /><span>Add Custom Activity</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── FAQ TAB ── */}
            {activeTab === 'faq' && (
              <div className={`flex-grow flex ${isExpanded ? 'lg:flex-row lg:overflow-hidden lg:h-full' : 'flex-col'}`}>
                {/* Static FAQ */}
                <div className={`border-b border-gray-100 bg-white ${isExpanded ? 'lg:w-[40%] lg:border-r lg:border-b-0 lg:overflow-y-auto lg:h-full p-5 sm:p-6 lg:p-8' : 'p-5'}`}>
                  <span className="text-[8px] font-black tracking-widest uppercase text-brand-orange block text-left">Quick Answers</span>
                  <h4 className="text-base font-black text-brand-text tracking-tight mt-0.5 text-left">Common Questions</h4>
                  <div className={`mt-4 space-y-2.5 overflow-y-auto pr-1 ${isExpanded ? 'lg:max-h-none' : 'max-h-[200px]'}`}>
                    {INSTANT_FAQS.map((faq, idx) => {
                      const isItemExpanded = expandedFaqIndex === idx;
                      return (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-gray-200 text-left">
                          <button onClick={() => setExpandedFaqIndex(isItemExpanded ? null : idx)}
                            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors"
                          >
                            <span className="text-[11px] font-extrabold text-brand-text pr-2 leading-relaxed">{faq.question}</span>
                            <ChevronLeft size={14} className={`text-gray-400 transition-transform ${isItemExpanded ? '-rotate-90' : 'rotate-180'}`} />
                          </button>
                          {isItemExpanded && (
                            <div className="p-3.5 pt-0 bg-gray-50/30 text-[11px] text-gray-500 leading-relaxed font-semibold border-t border-gray-50 text-left">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Chat */}
                <div className={`flex-grow flex flex-col bg-gray-50/30 ${isExpanded ? 'lg:w-[60%] lg:h-full lg:overflow-hidden' : ''}`}>
                  <div className="flex-grow overflow-y-auto p-5 space-y-4 flex flex-col" ref={scrollRef}>
                    <div className="text-center py-2 shrink-0">
                      <span className="inline-block bg-orange-50 text-brand-orange/90 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-orange-100/50">
                        AI FAQ Assistant
                      </span>
                    </div>
                    {faqHistory.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3.5 rounded-2xl text-[12px] text-left leading-relaxed font-semibold shadow-sm ${
                          m.role === 'user' ? 'bg-brand-orange text-white rounded-tr-none font-bold' : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                        }`}>
                          {m.role === 'bot' ? (
                            <div className="prose prose-sm max-w-none text-[12px] leading-relaxed select-text">
                              <Markdown>{m.text}</Markdown>
                            </div>
                          ) : m.text}
                        </div>
                      </div>
                    ))}
                    {isFaqTyping && (
                      <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-gray-100 px-4 py-2.5 rounded-xl text-[9px] font-black text-gray-400 tracking-widest uppercase flex items-center space-x-2">
                          <Loader2 size={11} className="animate-spin text-brand-orange" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3 shrink-0">
                    <input
                      type="text" value={faqInput}
                      onChange={(e) => setFaqInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendFaq()}
                      placeholder="Ask about tours, pricing, or planning..."
                      className="flex-grow bg-gray-100 border-none rounded-xl px-4 py-3.5 text-xs font-semibold focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                    />
                    <button onClick={() => handleSendFaq()} disabled={!faqInput.trim() || isFaqTyping}
                      className="bg-brand-orange text-white p-3.5 rounded-xl shadow-lg hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-90"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;