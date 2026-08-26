import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/engine';
import { Book } from '../types/game';
import { DialogueBox } from './UI/DialogueBox';
import { QuestTracker } from './UI/QuestTracker';
import { InventoryModal } from './UI/InventoryModal';
import { BookReaderModal } from './UI/BookReaderModal';
import { PauseMenu } from './UI/PauseMenu';
import { SettingsModal } from './UI/SettingsModal';
import { RoomCelebrationModal } from './UI/RoomCelebrationModal';
import { VirtualControls } from './UI/VirtualControls';
import { soundManager } from '../game/audio';

interface GameCanvasProps {
  onReturnToMainMenu: () => void;
  initialSaveData?: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onReturnToMainMenu, initialSaveData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Synced reactive state for React UI overlays
  const [, setTick] = useState(0);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  const forceUpdate = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  // Initialize GameEngine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    // Load save if requested
    if (initialSaveData) {
      engine.loadSavedGame();
    }

    engine.onStateChange = forceUpdate;
    engine.init();
    engine.start();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      engine.width = clientWidth;
      engine.height = clientHeight;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Global Key shortcuts
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.code === 'KeyI') {
        setIsInventoryOpen((prev) => !prev);
      } else if (e.code === 'KeyR') {
        // Read held book shortcut
        if (engine.player.heldBookId) {
          const b = engine.books.find((book) => book.id === engine.player.heldBookId);
          if (b) {
            setReadingBook(b);
          }
        }
      } else if (e.code === 'Escape') {
        if (readingBook) {
          setReadingBook(null);
        } else if (isInventoryOpen) {
          setIsInventoryOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else {
          setIsPauseOpen((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeys);
      resizeObserver.disconnect();
      engine.destroy();
    };
  }, [initialSaveData, forceUpdate, readingBook, isInventoryOpen, isSettingsOpen]);

  const engine = engineRef.current;
  const currentRoom = engine ? engine.rooms[engine.currentRoomId] || engine.rooms.main_hall : null;
  const heldBook = engine && engine.player.heldBookId ? engine.books.find((b) => b.id === engine.player.heldBookId) || null : null;
  const activeQuest = engine ? engine.quests.find((q) => q.id === engine.activeQuestId) : undefined;

  // Virtual Gamepad Handlers
  const handleVirtualDirection = (dir: 'up' | 'down' | 'left' | 'right', pressed: boolean) => {
    if (!engine) return;
    const keyMap = {
      up: 'KeyW',
      down: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
    };
    engine.keys[keyMap[dir]] = pressed;
  };

  const handleVirtualAction = () => {
    if (!engine) return;
    if (engine.activeDialogue) {
      engine.advanceDialogue();
    } else if (engine.currentInteractPrompt) {
      engine.currentInteractPrompt.action();
    }
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    forceUpdate();
  };

  const handleMarkAsRead = (bookId: string) => {
    if (!engine) return;
    const target = engine.books.find((b) => b.id === bookId);
    if (target && !target.hasBeenRead) {
      target.hasBeenRead = true;
      forceUpdate();
    }
  };

  return (
    <div
      ref={containerRef}
      id="game-viewport"
      className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none"
    >
      {/* HTML5 Canvas Viewport */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Top HUD (Quest Tracker, Inventory button, Rooms) */}
      {currentRoom && engine && (
        <QuestTracker
          currentRoom={currentRoom}
          allBooks={engine.books}
          activeQuest={activeQuest}
          heldBook={heldBook}
          interactPrompt={engine.currentInteractPrompt}
          onOpenInventory={() => setIsInventoryOpen(true)}
          onOpenPause={() => setIsPauseOpen(true)}
          onToggleMute={handleToggleMute}
          onOpenBookReader={(book) => setReadingBook(book)}
          isMuted={isMuted}
        />
      )}

      {/* RPG Dialogue Overlay */}
      {engine?.activeDialogue && (
        <DialogueBox
          dialogue={engine.activeDialogue}
          onAdvance={() => engine.advanceDialogue()}
        />
      )}

      {/* Toast Notification */}
      {engine?.toastNotification && (
        <div className="absolute top-20 inset-x-0 mx-auto w-fit max-w-md px-4 z-40 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <div
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold shadow-2xl flex items-center gap-2 border ${
              engine.toastNotification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-500/20'
                : engine.toastNotification.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-500/20'
                : 'bg-stone-900/90 text-amber-200 border-amber-500/50 shadow-amber-500/20'
            }`}
          >
            <span>{engine.toastNotification.text}</span>
          </div>
        </div>
      )}

      {/* Room Completion Star Celebration */}
      {engine?.roomCelebration && (
        <RoomCelebrationModal
          data={engine.roomCelebration}
          onClose={() => {
            if (engine) engine.roomCelebration = null;
            forceUpdate();
          }}
        />
      )}

      {/* Inventory Grimoire Modal */}
      {engine && (
        <InventoryModal
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)}
          inventory={engine.inventory}
          heldBook={heldBook}
          allBooks={engine.books}
          shelves={engine.shelves}
          discoveredSecrets={engine.discoveredSecrets}
          onOpenBookReader={(book) => {
            setReadingBook(book);
          }}
        />
      )}

      {/* Book & Parable Reader Modal */}
      {engine && (
        <BookReaderModal
          isOpen={!!readingBook}
          book={readingBook}
          allBooks={engine.books}
          onClose={() => setReadingBook(null)}
          onSelectBook={(book) => setReadingBook(book)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}

      {/* In-Game Pause Menu */}
      {engine && currentRoom && (
        <PauseMenu
          isOpen={isPauseOpen}
          onResume={() => setIsPauseOpen(false)}
          onSave={() => {
            engine.saveCurrentGame();
            forceUpdate();
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReturnToMainMenu={() => {
            setIsPauseOpen(false);
            onReturnToMainMenu();
          }}
          booksCount={{
            organized: engine.books.filter((b) => b.isOrganized).length,
            total: engine.books.length,
          }}
          currentRoomName={currentRoom.name}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        musicVolume={soundManager.musicVolume}
        sfxVolume={soundManager.sfxVolume}
        particlesEnabled={engine?.particlesEnabled ?? true}
        onUpdateMusicVolume={(v) => {
          soundManager.setVolumes(v, soundManager.sfxVolume);
          forceUpdate();
        }}
        onUpdateSfxVolume={(v) => {
          soundManager.setVolumes(soundManager.musicVolume, v);
          forceUpdate();
        }}
        onToggleParticles={() => {
          if (engine) {
            engine.particlesEnabled = !engine.particlesEnabled;
            forceUpdate();
          }
        }}
      />

      {/* On-Screen Touch / Virtual Gamepad for Mobile */}
      <VirtualControls
        onDirectionPress={handleVirtualDirection}
        onActionPress={handleVirtualAction}
        onInventoryPress={() => setIsInventoryOpen((p) => !p)}
        onPausePress={() => setIsPauseOpen((p) => !p)}
        hasHeldBook={!!heldBook}
      />
    </div>
  );
};
