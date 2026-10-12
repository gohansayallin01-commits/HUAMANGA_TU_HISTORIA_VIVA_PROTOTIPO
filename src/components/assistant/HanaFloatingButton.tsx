import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';

interface HanaFloatingButtonProps {
  onClick: () => void;
}

export const HanaFloatingButton: React.FC<HanaFloatingButtonProps> = ({ onClick }) => {
  const { t } = useI18n();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-ayacucho-night to-ayacucho-deep text-white shadow-elevated border-2 border-ayacucho-gold/60 hover:scale-105 active:scale-95 transition-all duration-300"
      aria-label="Consultar a Hana, asistente turística"
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold flex items-center justify-center text-ayacucho-night">
          <Bot className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-ayacucho-lightgold leading-tight flex items-center gap-1">
          Hana
          <Sparkles className="w-3 h-3 text-ayacucho-gold" />
        </span>
        <span className="text-[10px] text-slate-300 font-medium">
          Asistente AI
        </span>
      </div>
    </button>
  );
};
