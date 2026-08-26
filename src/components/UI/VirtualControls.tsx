import React from 'react';
import { BookOpen, Sparkles, Hand, Menu } from 'lucide-react';

interface VirtualControlsProps {
  onDirectionPress: (dir: 'up' | 'down' | 'left' | 'right', pressed: boolean) => void;
  onActionPress: () => void;
  onInventoryPress: () => void;
  onPausePress: () => void;
  hasHeldBook: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onDirectionPress,
  onActionPress,
  onInventoryPress,
  onPausePress,
  hasHeldBook,
}) => {
  return (
    <div
      id="virtual-gamepad"
      className="md:hidden absolute bottom-3 inset-x-0 px-4 pointer-events-none z-30 flex items-end justify-between"
    >
      {/* Left: D-PAD */}
      <div className="relative w-36 h-36 bg-slate-950/70 backdrop-blur-md rounded-full border-2 border-amber-900/60 p-2 shadow-2xl pointer-events-auto">
        {/* Up */}
        <button
          className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800/80 active:bg-amber-600 rounded-t-lg flex items-center justify-center text-amber-200 font-bold border border-slate-700 active:text-slate-950"
          onTouchStart={() => onDirectionPress('up', true)}
          onTouchEnd={() => onDirectionPress('up', false)}
          onMouseDown={() => onDirectionPress('up', true)}
          onMouseUp={() => onDirectionPress('up', false)}
        >
          ▲
        </button>

        {/* Down */}
        <button
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 bg-slate-800/80 active:bg-amber-600 rounded-b-lg flex items-center justify-center text-amber-200 font-bold border border-slate-700 active:text-slate-950"
          onTouchStart={() => onDirectionPress('down', true)}
          onTouchEnd={() => onDirectionPress('down', false)}
          onMouseDown={() => onDirectionPress('down', true)}
          onMouseUp={() => onDirectionPress('down', false)}
        >
          ▼
        </button>

        {/* Left */}
        <button
          className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800/80 active:bg-amber-600 rounded-l-lg flex items-center justify-center text-amber-200 font-bold border border-slate-700 active:text-slate-950"
          onTouchStart={() => onDirectionPress('left', true)}
          onTouchEnd={() => onDirectionPress('left', false)}
          onMouseDown={() => onDirectionPress('left', true)}
          onMouseUp={() => onDirectionPress('left', false)}
        >
          ◀
        </button>

        {/* Right */}
        <button
          className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-800/80 active:bg-amber-600 rounded-r-lg flex items-center justify-center text-amber-200 font-bold border border-slate-700 active:text-slate-950"
          onTouchStart={() => onDirectionPress('right', true)}
          onTouchEnd={() => onDirectionPress('right', false)}
          onMouseDown={() => onDirectionPress('right', true)}
          onMouseUp={() => onDirectionPress('right', false)}
        >
          ▶
        </button>

        {/* Center Pad */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400/60 font-cinzel">
          ✦
        </div>
      </div>

      {/* Right: ACTION BUTTONS */}
      <div className="flex flex-col gap-2.5 items-end pointer-events-auto">
        <div className="flex gap-2">
          {/* Inventory Button */}
          <button
            onClick={onInventoryPress}
            className="w-12 h-12 rounded-2xl bg-purple-900/80 active:bg-purple-600 text-purple-200 border-2 border-purple-500/60 shadow-lg flex flex-col items-center justify-center text-[10px] font-bold"
          >
            <BookOpen className="w-4 h-4" />
            <span>I</span>
          </button>

          {/* Pause Button */}
          <button
            onClick={onPausePress}
            className="w-12 h-12 rounded-2xl bg-stone-900/80 active:bg-stone-700 text-stone-200 border-2 border-stone-600 shadow-lg flex flex-col items-center justify-center text-[10px] font-bold"
          >
            <Menu className="w-4 h-4" />
            <span>ESC</span>
          </button>
        </div>

        {/* Main Action Button (E) */}
        <button
          onClick={onActionPress}
          className={`w-16 h-16 rounded-full border-4 shadow-2xl flex flex-col items-center justify-center font-cinzel font-bold text-xs active:scale-95 transition-all ${
            hasHeldBook
              ? 'bg-gradient-to-tr from-purple-600 to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/40 animate-pulse'
              : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 border-amber-200 shadow-amber-500/30'
          }`}
        >
          <span className="text-sm">E</span>
          <span className="text-[9px] font-sans font-semibold">
            {hasHeldBook ? 'Organizar' : 'Ação'}
          </span>
        </button>
      </div>
    </div>
  );
};
