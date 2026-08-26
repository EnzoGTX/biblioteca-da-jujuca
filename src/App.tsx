import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/UI/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { SettingsModal } from './components/UI/SettingsModal';
import { SaveManager } from './game/saveSystem';
import { soundManager } from './game/audio';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [isContinuing, setIsContinuing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    setHasSaveData(SaveManager.hasSave());
  }, [gameState]);

  const handleStartNewGame = () => {
    setIsContinuing(false);
    setGameState('playing');
  };

  const handleContinueGame = () => {
    setIsContinuing(true);
    setGameState('playing');
  };

  const handleReturnToMainMenu = () => {
    setGameState('menu');
    setHasSaveData(SaveManager.hasSave());
  };

  return (
    <div id="game-app-root" className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {gameState === 'menu' ? (
        <MainMenu
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasSaveData={hasSaveData}
        />
      ) : (
        <GameCanvas
          onReturnToMainMenu={handleReturnToMainMenu}
          initialSaveData={isContinuing}
        />
      )}

      {/* Global Settings Modal from Main Menu */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        musicVolume={soundManager.musicVolume}
        sfxVolume={soundManager.sfxVolume}
        particlesEnabled={true}
        onUpdateMusicVolume={(v) => {
          soundManager.setVolumes(v, soundManager.sfxVolume);
          setRefreshKey((k) => k + 1);
        }}
        onUpdateSfxVolume={(v) => {
          soundManager.setVolumes(soundManager.musicVolume, v);
          setRefreshKey((k) => k + 1);
        }}
        onToggleParticles={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}

