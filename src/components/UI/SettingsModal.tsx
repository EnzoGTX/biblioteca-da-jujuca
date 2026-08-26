import React from 'react';
import { Volume2, VolumeX, Sparkles, X, Eye, Keyboard } from 'lucide-react';
import { soundManager } from '../../game/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  musicVolume: number;
  sfxVolume: number;
  particlesEnabled: boolean;
  onUpdateMusicVolume: (val: number) => void;
  onUpdateSfxVolume: (val: number) => void;
  onToggleParticles: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  musicVolume,
  sfxVolume,
  particlesEnabled,
  onUpdateMusicVolume,
  onUpdateSfxVolume,
  onToggleParticles,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-amber-800 rounded-2xl p-6 shadow-2xl text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-amber-900/60 pb-3">
          <h3 className="font-cinzel text-lg font-bold text-amber-200">
            CONFIGURAÇÕES DO JOGO
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sliders and Toggles */}
        <div className="space-y-4 font-outfit text-sm">
          {/* Music Volume */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-stone-300">
              <span className="flex items-center gap-1.5 font-cinzel">
                <Volume2 className="w-4 h-4 text-amber-400" />
                Volume da Música Ambiente
              </span>
              <span className="font-mono text-amber-300 font-bold">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onUpdateMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-stone-300">
              <span className="flex items-center gap-1.5 font-cinzel">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Volume dos Efeitos Sonoros
              </span>
              <span className="font-mono text-amber-300 font-bold">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => {
                onUpdateSfxVolume(parseFloat(e.target.value));
                soundManager.playBookPickup();
              }}
              className="w-full accent-amber-500 bg-stone-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Particles Toggle */}
          <div className="flex items-center justify-between p-3 bg-stone-950/60 rounded-xl border border-stone-800">
            <div>
              <span className="font-cinzel text-xs font-semibold text-stone-200 block">
                Partículas Mágicas & Poeira
              </span>
              <span className="text-[11px] text-stone-400 font-lora">
                Brilhos, poeira de luz e efeitos ao organizar
              </span>
            </div>
            <button
              onClick={onToggleParticles}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-cinzel border transition-all ${
                particlesEnabled
                  ? 'bg-amber-600/40 text-amber-200 border-amber-500'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {particlesEnabled ? 'ATIVADAS' : 'DESATIVADAS'}
            </button>
          </div>

          {/* Controls Quick Reference */}
          <div className="p-3 bg-stone-950/80 rounded-xl border border-amber-950 space-y-2 text-xs">
            <h4 className="font-cinzel font-bold text-amber-300 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5" />
              Guia de Teclas
            </h4>
            <div className="grid grid-cols-2 gap-2 text-stone-300 font-lora">
              <div><kbd className="text-amber-400 font-mono">W, A, S, D / Setas</kbd> : Mover Julia</div>
              <div><kbd className="text-amber-400 font-mono">E / Espaço</kbd> : Interagir / Pegar / Colocar</div>
              <div><kbd className="text-amber-400 font-mono">I</kbd> : Abrir Grimório / Inventário</div>
              <div><kbd className="text-amber-400 font-mono">ESC</kbd> : Pausar jogo</div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-cinzel text-xs uppercase cursor-pointer"
        >
          Salvar & Fechar
        </button>
      </div>
    </div>
  );
};
