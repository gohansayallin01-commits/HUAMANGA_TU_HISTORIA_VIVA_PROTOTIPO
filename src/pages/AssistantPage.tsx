import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { hanaBotService, HanaResponse } from '../services/hanaBotService';
import { useAttractions } from '../context/AttractionsContext';
import { useI18n } from '../i18n/i18nContext';
import { StoredAttractionImage } from '../components/common/StoredAttractionImage';
import { Attraction } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'hana';
  text: string;
  time: string;
  recommendedPlaces?: Attraction[];
  suggestedQuestions?: string[];
}

export const AssistantPage: React.FC = () => {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const allAttractions = useAttractions().publishedAttractions;

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'init-1',
      sender: 'hana',
      text: t('hana.greeting'),
      time: 'Ahora',
      suggestedQuestions: [
        t('hana.quickQuestion1'),
        t('hana.quickQuestion2'),
        t('hana.quickQuestion3'),
        t('hana.quickQuestion4'),
        t('hana.quickQuestion5')
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response: HanaResponse = hanaBotService.respond(query, language === 'en');
      const matchedPlaces = allAttractions.filter((a: Attraction) => response.recommendedIds.includes(a.id));

      const hanaMsg: Message = {
        id: Math.random().toString(),
        sender: 'hana',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedPlaces: matchedPlaces,
        suggestedQuestions: response.suggestedQuestions
      };

      setMessages(prev => [...prev, hanaMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-slate-50 border-x border-slate-200 animate-fade-in">
      {/* Cabecera */}
      <div className="bg-ayacucho-night text-white px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm font-cultural">Hana</h2>
              <span className="bg-ayacucho-gold/20 text-ayacucho-lightgold text-[10px] font-bold px-2 py-0.5 rounded-full border border-ayacucho-gold/30">
                {t('hana.badge')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 -mt-0.5">{t('hana.role')}</p>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-ayacucho-deep text-white rounded-br-none'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/60'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[10px] block mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </span>
            </div>

            {msg.recommendedPlaces && msg.recommendedPlaces.length > 0 && (
              <div className="w-full mt-2.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Lugares sugeridos por Hana:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.recommendedPlaces.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => navigate(`/atractivo/${place.slug}`)}
                      className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 hover:border-ayacucho-gold hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <StoredAttractionImage
                          src={place.images[0]}
                          alt={place.name}
                          category={place.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-xs text-ayacucho-night truncate group-hover:text-ayacucho-deep">
                          {language === 'en' ? place.nameEn : place.name}
                        </h5>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{place.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-ayacucho-gold shrink-0 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {msg.suggestedQuestions && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {msg.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-ayacucho-gold/15 text-slate-700 hover:text-ayacucho-night text-xs font-medium border border-slate-200 shadow-xs transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-2 bg-white rounded-2xl w-fit shadow-xs border border-slate-100">
            <Bot className="w-4 h-4 text-ayacucho-gold animate-bounce" />
            <span className="text-xs text-slate-500 italic font-medium">{t('hana.typing')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('hana.inputPlaceholder')}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/50 focus:bg-white transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep disabled:opacity-50 text-ayacucho-lightgold transition shrink-0"
          aria-label="Enviar pregunta"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
