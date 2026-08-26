import React from 'react';
import { Play, Save, Settings, LogOut, CheckCircle2 } from 'lucide-react';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
  onReturnToMainMenu: () => void;
  booksCount: { organized: number; total: number };
  currentRoomName: string;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  onSave,
  onOpenSettings,
  onReturnToMainMenu,
  booksCount,
  currentRoomName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pause-menu"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-sm bg-stone-900 border-2 border-amber-800/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="font-cinzel text-2xl font-bold text-amber-200 tracking-widest mb-1">
          JOGO PAUSADO
        </h2>
        <p className="text-xs text-stone-400 font-lora mb-6">
          {currentRoomName} • {booksCount.organized}/{booksCount.total} Livros Organizados
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            id="pause-btn-resume"
            onClick={onResume}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-cinzel font-bold text-xs uppercase bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            Continuar
          </button>

          <button
            id="pause-btn-save"
            onClick={onSave}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-cinzel font-semibold text-xs text-amber-100 bg-stone-800 hover:bg-stone-700 border border-amber-900/50 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            Salvar Jogo
          </button>

          <button
            id="pause-btn-settings"
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-cinzel text-xs text-stone-200 bg-stone-800/80 hover:bg-stone-700 border border-stone-700 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>

          <button
            id="pause-btn-menu"
            onClick={onReturnToMainMenu}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-cinzel text-xs text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 transition-all mt-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Voltar ao Menu
          </button>
        </div>

        <p className="text-[11px] text-stone-500 font-lora mt-6">
          Pressione <kbd className="text-amber-400 font-mono">ESC</kbd> para voltar ao jogo
        </p>
      </div>
    </div>
  );
};
