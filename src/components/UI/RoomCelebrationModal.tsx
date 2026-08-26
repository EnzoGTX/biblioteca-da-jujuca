import React from 'react';
import { Sparkles, Star, Trophy, Check } from 'lucide-react';

interface RoomCelebrationModalProps {
  data: {
    title: string;
    subtitle: string;
    stars: number;
  } | null;
  onClose: () => void;
}

export const RoomCelebrationModal: React.FC<RoomCelebrationModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div
        id="room-celebration-card"
        className="relative w-full max-w-md bg-stone-900 border-4 border-amber-500 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 30%, #3e2413 0%, #150e09 100%)',
          boxShadow: '0 0 50px rgba(234, 179, 8, 0.4), inset 0 0 30px rgba(245, 158, 11, 0.2)',
        }}
      >
        {/* Floating Sparkles & Laurel */}
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-amber-500/30 animate-bounce">
          🏆
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-xl md:text-2xl font-extrabold text-amber-200 tracking-wider mb-2">
          {data.title}
        </h2>

        {/* 3 Stars Animation */}
        <div className="flex items-center justify-center gap-2 my-3">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              className={`w-8 h-8 ${
                starIndex <= data.stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                  : 'text-stone-700'
              }`}
            />
          ))}
        </div>

        <h3 className="font-cinzel text-lg font-bold text-amber-300 mb-1">
          {data.subtitle}
        </h3>

        <p className="font-lora text-xs sm:text-sm text-amber-100/80 max-w-sm mb-6 leading-relaxed">
          Todos os livros desta ala foram organizados com maestria impecável! A harmonia de Aether foi restaurada nesta sala.
        </p>

        <button
          id="celebration-confirm-btn"
          onClick={onClose}
          className="w-full py-3 rounded-xl font-cinzel font-bold text-xs uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-xl shadow-amber-500/30 border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Continuar Explorando
        </button>
      </div>
    </div>
  );
};
