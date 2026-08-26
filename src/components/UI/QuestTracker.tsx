import React from 'react';
import { Book, Quest, Room } from '../../types/game';
import { BookOpen, MapPin, Volume2, VolumeX, Menu, Compass, Sparkles, BookMarked } from 'lucide-react';
import { soundManager } from '../../game/audio';

interface QuestTrackerProps {
  currentRoom: Room;
  allBooks: Book[];
  activeQuest: Quest | undefined;
  heldBook: Book | null;
  interactPrompt: { text: string; action: () => void } | null;
  onOpenInventory: () => void;
  onOpenPause: () => void;
  onToggleMute: () => void;
  onOpenBookReader?: (book: Book) => void;
  isMuted: boolean;
}

export const QuestTracker: React.FC<QuestTrackerProps> = ({
  currentRoom,
  allBooks,
  activeQuest,
  heldBook,
  interactPrompt,
  onOpenInventory,
  onOpenPause,
  onToggleMute,
  onOpenBookReader,
  isMuted,
}) => {
  const organizedCount = allBooks.filter((b) => b.isOrganized).length;
  const totalCount = allBooks.length;
  const progressPercent = Math.round((organizedCount / totalCount) * 100);

  return (
    <div id="game-hud-top" className="absolute top-0 inset-x-0 p-3 md:p-4 pointer-events-none z-30 flex flex-col gap-2">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        {/* Left: Room Badge & Quest */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Room Location Plate */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/30 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-xs md:text-sm font-bold text-amber-100">
                  {currentRoom.name}
                </span>
              </div>
              <span className="text-[10px] text-amber-300/70 font-lora hidden sm:block">
                {currentRoom.subtitle}
              </span>
            </div>
          </div>

          {/* Active Quest Capsule */}
          {activeQuest && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-purple-500/30 px-3 py-1.5 rounded-xl shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] font-cinzel font-bold text-purple-300 uppercase tracking-wider block">
                  {activeQuest.title}
                </span>
                <span className="text-xs text-slate-200 font-lora line-clamp-1 max-w-[280px]">
                  {activeQuest.description}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Progress Counter, Held Book Action & Control Buttons */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Held Book Card & Read Parable Trigger */}
          {heldBook && (
            <button
              id="hud-held-book-reader-btn"
              onClick={() => {
                if (onOpenBookReader) onOpenBookReader(heldBook);
              }}
              className="bg-purple-950/90 hover:bg-purple-900 border border-purple-400/60 px-3 py-1.5 rounded-xl shadow-lg shadow-purple-950/50 flex items-center gap-2 text-purple-100 font-cinzel text-xs cursor-pointer transition-all hover:scale-105"
              title="Ler Parábola deste Livro (Tecla R)"
            >
              <BookMarked className="w-4 h-4 text-purple-300 animate-pulse" />
              <div className="text-left hidden sm:block">
                <span className="text-[9px] uppercase tracking-wider text-purple-300 font-bold block">
                  Ler Parábola
                </span>
                <span className="text-xs font-semibold truncate max-w-[120px] block">
                  {heldBook.title}
                </span>
              </div>
              <kbd className="text-[10px] px-1.5 py-0.5 bg-purple-900 rounded border border-purple-500/50 text-purple-200 font-mono">
                R
              </kbd>
            </button>
          )}

          {/* Books Organized Counter */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-xl shadow-lg flex flex-col items-end min-w-[120px] md:min-w-[160px]">
            <div className="flex items-center justify-between w-full text-xs font-bold font-cinzel">
              <span className="text-amber-400">SANTUÁRIO</span>
              <span className="text-amber-200">
                {organizedCount} / {totalCount}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Inventory Button */}
          <button
            id="hud-inventory-btn"
            onClick={onOpenInventory}
            className={`relative px-3 py-2 rounded-xl backdrop-blur-md border font-cinzel text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
              heldBook
                ? 'bg-purple-600/40 border-purple-400 text-purple-100 shadow-purple-500/30'
                : 'bg-slate-950/85 border-amber-500/30 text-amber-200 hover:border-amber-400'
            }`}
            title="Abrir Grimório de Parábolas (Tecla I)"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Códice</span>
            <kbd className="text-[10px] px-1 py-0.5 bg-slate-800/80 rounded border border-slate-700 text-amber-300 font-mono">
              I
            </kbd>
          </button>

          {/* Audio Mute Toggle */}
          <button
            id="hud-audio-btn"
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-amber-200 hover:text-white hover:border-amber-400 shadow-lg transition-colors cursor-pointer"
            title={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Pause Menu */}
          <button
            id="hud-pause-btn"
            onClick={onOpenPause}
            className="p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-amber-200 hover:text-white hover:border-amber-400 shadow-lg transition-colors cursor-pointer"
            title="Menu de Pausa (ESC)"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Interaction Prompt Banner (Centered near top) */}
      {interactPrompt && (
        <div className="mx-auto mt-2 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
          <button
            id="interaction-prompt-btn"
            onClick={interactPrompt.action}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-full shadow-2xl shadow-amber-500/40 border-2 border-amber-200 font-cinzel text-xs md:text-sm flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>{interactPrompt.text}</span>
            <kbd className="px-2 py-0.5 bg-slate-900 text-amber-300 rounded-md text-[11px] font-mono border border-slate-700">
              E
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
};
