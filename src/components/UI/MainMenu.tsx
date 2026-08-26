import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, Settings, Info, BookOpen, Volume2, VolumeX, Music, Heart, Scroll } from 'lucide-react';
import { soundManager, HYMN_LYRICS } from '../../game/audio';

interface MainMenuProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenSettings: () => void;
  hasSaveData: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNewGame,
  onContinueGame,
  onOpenSettings,
  hasSaveData,
}) => {
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentLyric, setCurrentLyric] = useState<string>('♪ Jesus deixou toda a sua glória... ♪');

  // Autoplay music on start menu
  useEffect(() => {
    const tryAutoplay = () => {
      soundManager.startMusic();
      setIsPlayingMusic(true);
    };

    tryAutoplay();

    // Browser gesture unlock listener
    const handleFirstTouch = () => {
      soundManager.initContext();
      if (!soundManager.isMusicPlaying) {
        soundManager.startMusic();
        setIsPlayingMusic(true);
      }
    };

    window.addEventListener('click', handleFirstTouch, { once: true });
    window.addEventListener('keydown', handleFirstTouch, { once: true });
    window.addEventListener('touchstart', handleFirstTouch, { once: true });

    // Track lyrics time for serene display on main menu
    const interval = window.setInterval(() => {
      const sec = soundManager.songProgressSec;
      for (let i = HYMN_LYRICS.length - 1; i >= 0; i--) {
        if (sec >= HYMN_LYRICS[i].timeSec) {
          setCurrentLyric(HYMN_LYRICS[i].text);
          break;
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
      clearInterval(interval);
    };
  }, []);

  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      soundManager.stopMusic();
      setIsPlayingMusic(false);
    } else {
      soundManager.startMusic();
      setIsPlayingMusic(true);
    }
  };

  const handlePlayClick = () => {
    if (!soundManager.isMusicPlaying) {
      soundManager.startMusic();
    }
    onStartNewGame();
  };

  const handleContinueClick = () => {
    if (!soundManager.isMusicPlaying) {
      soundManager.startMusic();
    }
    onContinueGame();
  };

  return (
    <div
      id="main-menu"
      className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-6 overflow-hidden select-none bg-slate-950 text-slate-100"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 35%, rgba(59, 130, 246, 0.18) 0%, rgba(30, 27, 46, 0.92) 50%, #08060f 100%)`,
      }}
    >
      {/* Background Divine Golden Rays & Serene Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Badge */}
      <div className="z-10 pt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-amber-400/30 text-amber-200 text-xs tracking-widest font-cinzel uppercase shadow-lg backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          Uma Jornada de Fantasia Cristã, Paz & Alegorias da Graça
        </div>
      </div>

      {/* Center Hero Section */}
      <div className="z-10 flex flex-col items-center text-center my-auto max-w-2xl px-4">
        {/* Sacred Sacred Emblem */}
        <div className="mb-4 flex items-center justify-center gap-3 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-float">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/80" />
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 shadow-inner flex items-center gap-2 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <BookOpen className="w-6 h-6 text-amber-200" />
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/80" />
        </div>

        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500 drop-shadow-[0_4px_24px_rgba(234,179,8,0.4)]">
          JULIA FRAGA
        </h1>
        <h2 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-semibold tracking-widest text-blue-200 mt-1.5 drop-shadow-md">
          A BIBLIOTECA DAS SAGRADAS PARÁBOLAS
        </h2>

        <p className="font-lora text-xs sm:text-sm md:text-base text-amber-100/90 max-w-lg mt-3 italic leading-relaxed">
          "As Crônicas de Nárnia, O Peregrino e os cânticos de paz esperam por suas mãos cuidadosas. Encontre o descanso no Senhor."
        </p>

        {/* Music Player Bar on Main Menu */}
        <div className="w-full max-w-md mt-5 p-3 rounded-2xl bg-stone-900/80 border border-amber-500/30 shadow-xl backdrop-blur-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Music className="w-4 h-4 animate-bounce" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block font-cinzel">
                  Hino ao Violão Acústico
                </span>
                <span className="text-xs text-stone-200 font-semibold truncate max-w-[200px] block">
                  O Grande Amor de Deus / Jesus Deixou Toda Glória
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="btn-toggle-hymn-lyrics"
                onClick={() => setShowLyricsModal(true)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-cinzel text-amber-200 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                title="Ver Letra Completa do Hino"
              >
                <Scroll className="w-3 h-3" />
                Letra
              </button>

              <button
                id="btn-toggle-menu-music"
                onClick={handleToggleMusic}
                className="p-1.5 rounded-lg text-amber-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-all cursor-pointer"
                title={isPlayingMusic ? 'Pausar Música' : 'Tocar Música'}
              >
                {isPlayingMusic ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              </button>
            </div>
          </div>

          {/* Subtitle / Karaoke Lyric Line */}
          <div className="px-2 py-1 rounded-lg bg-stone-950/60 border border-amber-900/40 text-center font-lora text-xs text-amber-200/95 italic transition-all duration-300 truncate">
            {currentLyric}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs mt-6">
          <button
            id="menu-btn-jogar"
            onClick={handlePlayClick}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-6 rounded-xl font-cinzel font-bold text-sm md:text-base bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 shadow-xl shadow-amber-600/30 border border-amber-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            ENTRAR NA BIBLIOTECA
          </button>

          {hasSaveData && (
            <button
              id="menu-btn-continuar"
              onClick={handleContinueClick}
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-6 rounded-xl font-cinzel font-semibold text-sm bg-blue-900/60 hover:bg-blue-800/80 text-blue-100 border border-blue-400/40 shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-blue-300" />
              CONTINUAR JORNADA
            </button>
          )}

          <button
            id="menu-btn-historia"
            onClick={() => setShowLoreModal(true)}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl font-cinzel text-xs text-amber-200/90 bg-stone-900/70 hover:bg-stone-800/90 border border-amber-900/50 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            O SANTUÁRIO DE PARÁBOLAS
          </button>

          <div className="flex gap-2">
            <button
              id="menu-btn-config"
              onClick={onOpenSettings}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-cinzel text-xs text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Opções
            </button>

            <button
              id="menu-btn-creditos"
              onClick={() => setShowCreditsModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-cinzel text-xs text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              Créditos
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="z-10 text-center text-xs text-slate-400 font-lora">
        Controles: <kbd className="text-amber-300 font-mono">WASD</kbd> ou <kbd className="text-amber-300 font-mono">Setas</kbd> para caminhar com serenidade • <kbd className="text-amber-300 font-mono">E</kbd> para interagir • <kbd className="text-amber-300 font-mono">I</kbd> Inventário de Parábolas
      </div>

      {/* Lyrics Modal */}
      {showLyricsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-stone-900 border-2 border-amber-600/80 rounded-2xl max-w-lg w-full p-6 text-stone-200 relative shadow-2xl">
            <h3 className="font-cinzel text-xl font-bold text-amber-300 mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              O Grande Amor de Deus
            </h3>
            <p className="text-xs text-amber-200/70 font-lora mb-4">
              Hino acústico que embala a atmosfera serena do jogo
            </p>

            <div className="space-y-3 font-lora text-xs sm:text-sm text-stone-200 leading-relaxed max-h-[55vh] overflow-y-auto pr-2">
              <div className="p-3 bg-stone-950/60 rounded-xl border border-amber-900/40 space-y-1 text-center">
                <p className="text-amber-300 font-medium">"Jesus deixou toda a sua glória,</p>
                <p>Veio ao mundo como homem pra nos salvar.</p>
                <p>Viveu aqui e conheceu nossas dores,</p>
                <p>Mas tudo Ele sofreu e venceu em nosso lugar..."</p>
              </div>

              <div className="p-3 bg-stone-950/60 rounded-xl border border-amber-900/40 space-y-1 text-center">
                <p className="text-amber-300 font-medium">"Pra nos mostrar que o Criador, o único Deus,</p>
                <p>Nos ama e deseja restaurar!</p>
                <p>Seu perdão vai além dos céus, nenhum monte é tão alto,</p>
                <p>Nenhum vale é tão profundo como o amor do nosso Deus..."</p>
              </div>

              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/50 space-y-1 text-center shadow-inner">
                <p className="text-amber-200 font-bold text-sm">"Grande, tão grande! Alto, tão alto!</p>
                <p className="text-amber-200 font-bold text-sm">Fundo, tão profundo! É maior que o mundo...</p>
                <p className="text-amber-300 italic">Mas é pequeno: cabe lá dentro do coração</p>
                <p className="text-amber-100 font-semibold">De quem se entrega ao Salvador!"</p>
              </div>
            </div>

            <button
              onClick={() => setShowLyricsModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-cinzel text-xs uppercase cursor-pointer"
            >
              Fechar Letra
            </button>
          </div>
        </div>
      )}

      {/* Lore & Story Modal */}
      {showLoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-stone-900 border-2 border-amber-800 rounded-2xl max-w-xl w-full p-6 text-stone-200 relative shadow-2xl">
            <h3 className="font-cinzel text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              O Santuário das Sagradas Parábolas
            </h3>
            <div className="space-y-3 font-lora text-xs sm:text-sm text-stone-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p>
                <strong>Julia Fraga</strong> foi chamada para cuidar de um santuário muito especial: a biblioteca onde repousam as maiores alegorias e fantasias da fé cristã — como as <em>Crônicas de Nárnia</em> de C.S. Lewis, <em>O Peregrino</em> de John Bunyan e os contos inspiradores de George MacDonald.
              </p>
              <p>
                A antiga guardiã <strong>Eleanor</strong> e o dócil gatinho de luz <strong>Milo</strong> acolhem Julia neste lugar sagrado. Cada livro organizado traz cura, clareza e paz para a alma do leitor.
              </p>
              <blockquote className="p-3 bg-amber-950/40 border-l-4 border-amber-500 rounded-r-lg italic text-amber-200">
                "Nenhum monte é tão alto, nenhum vale é tão profundo como o amor do nosso Deus. Organize com calma e desfrute da presença da Graça."
              </blockquote>
            </div>
            <button
              onClick={() => setShowLoreModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold font-cinzel text-xs uppercase cursor-pointer"
            >
              Entendido, vamos explorar com paz!
            </button>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-stone-900 border-2 border-blue-800 rounded-2xl max-w-md w-full p-6 text-stone-200 relative shadow-2xl text-center">
            <h3 className="font-cinzel text-xl font-bold text-blue-300 mb-2">
              Créditos & Inspirações
            </h3>
            <div className="space-y-2 font-lora text-xs text-stone-300 py-3 leading-relaxed">
              <p>
                <strong>Protagonista:</strong> Julia Fraga
              </p>
              <p>
                <strong>Companheiro:</strong> Milo, o Felino de Luz
              </p>
              <p>
                <strong>Guardiã Mestra:</strong> Eleanor
              </p>
              <p>
                <strong>Obras Literárias Homenageadas:</strong> As Crônicas de Nárnia, O Peregrino, Cartas de um Diabo a seu Aprendiz, O Grande Abismo, George MacDonald e Salmos Bíblicos.
              </p>
              <p>
                <strong>Trilha Sonora Acústica:</strong> "Jesus Deixou Toda a Sua Glória" / "O Grande Amor de Deus".
              </p>
            </div>
            <button
              onClick={() => setShowCreditsModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold font-cinzel text-xs uppercase cursor-pointer"
            >
              Voltar ao Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
