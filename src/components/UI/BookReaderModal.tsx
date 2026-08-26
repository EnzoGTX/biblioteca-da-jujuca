import React, { useEffect, useState } from 'react';
import { Book } from '../../types/game';
import { soundManager } from '../../game/audio';
import {
  X,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
  CheckCircle2,
  Share2,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';

interface BookReaderModalProps {
  book: Book | null;
  allBooks: Book[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBook?: (book: Book) => void;
  onMarkAsRead?: (bookId: string) => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  allBooks,
  isOpen,
  onClose,
  onSelectBook,
  onMarkAsRead,
}) => {
  const [isSavedInHeart, setIsSavedInHeart] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    if (book && isOpen) {
      soundManager.playBookPageTurn();
      if (onMarkAsRead) {
        onMarkAsRead(book.id);
      }
      setIsSavedInHeart(false);
    }
  }, [book?.id, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !book) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleNextBook();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handlePrevBook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, book, allBooks]);

  if (!isOpen || !book) return null;

  const currentIndex = allBooks.findIndex((b) => b.id === book.id);
  const prevBook = currentIndex > 0 ? allBooks[currentIndex - 1] : allBooks[allBooks.length - 1];
  const nextBook = currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : allBooks[0];

  const handlePrevBook = () => {
    if (prevBook && onSelectBook) {
      soundManager.playBookPageTurn();
      onSelectBook(prevBook);
    }
  };

  const handleNextBook = () => {
    if (nextBook && onSelectBook) {
      soundManager.playBookPageTurn();
      onSelectBook(nextBook);
    }
  };

  const handleSaveInHeart = () => {
    setIsSavedInHeart(true);
    soundManager.playQuestChime();
  };

  // Get Room Display Name
  const getRoomName = (roomId: string) => {
    switch (roomId) {
      case 'main_hall':
        return 'Salão da Aliança & Acolhimento';
      case 'magic_wing':
        return 'Ala de Nárnia & Fantasias da Graça';
      case 'history_wing':
        return 'Ala das Crônicas & Sabedoria';
      case 'creatures_wing':
        return 'Ala das Criaturas & Natureza Redimida';
      case 'observatory':
        return 'Observatório Celeste da Criação';
      case 'forbidden_library':
        return 'Santuário das Sagradas Escrituras';
      default:
        return 'Santuário de Aether';
    }
  };

  // Drop cap letter
  const firstLetter = book.parableStory ? book.parableStory.charAt(0) : '';
  const remainingStory = book.parableStory ? book.parableStory.slice(1) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Container with Ornate Double Golden Border */}
      <div
        id="book-reader-container"
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-[#1e1b18] border-2 border-amber-500/60 shadow-[0_0_50px_rgba(217,119,6,0.3)] overflow-hidden text-amber-50"
      >
        {/* Subtle Background Texture Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-900/40 to-amber-950/30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Top Navigation & Status Bar */}
        <div className="relative z-10 px-6 py-4 border-b border-amber-900/40 bg-stone-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md border border-amber-500/30"
              style={{ backgroundColor: `${book.color}25`, borderColor: book.color }}
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase border shadow-sm"
                  style={{
                    backgroundColor: `${book.color}20`,
                    borderColor: `${book.color}60`,
                    color: book.color,
                  }}
                >
                  {book.category}
                </span>
                {book.themeTag && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-amber-950/70 border border-amber-600/40 text-amber-300">
                    {book.themeTag}
                  </span>
                )}
                {book.isOrganized && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-cinzel text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Organizado na Estante
                  </span>
                )}
              </div>
              <span className="text-[11px] text-amber-300/70 font-lora italic block mt-0.5">
                {getRoomName(book.roomOrigin)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Toggle */}
            <button
              id="btn-reader-font-toggle"
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
              className="px-2.5 py-1 rounded-lg text-xs font-cinzel bg-stone-900 hover:bg-stone-800 text-amber-200 border border-amber-900/50 transition-all cursor-pointer"
              title="Ajustar tamanho do texto"
            >
              {fontSize === 'normal' ? 'A+' : 'A-'}
            </button>

            {/* Close Button */}
            <button
              id="btn-close-reader-modal"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-rose-950/80 hover:text-rose-300 text-stone-400 border border-stone-800 hover:border-rose-700/50 transition-all cursor-pointer"
              title="Fechar Leitura (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Book Body / Parchment View */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 sm:px-10 py-6 space-y-6 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-stone-950">
          {/* Header of the Book */}
          <div className="text-center pb-4 border-b border-amber-900/30">
            {book.parableChapter && (
              <span className="text-xs font-cinzel uppercase tracking-widest text-amber-400/80 block mb-1">
                {book.parableChapter}
              </span>
            )}
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-md">
              {book.parableTitle || book.title}
            </h2>
            <h3 className="font-lora text-xs sm:text-sm text-stone-300 italic mt-1">
              Obra de Referência: <span className="text-amber-200 font-semibold">{book.title}</span>
            </h3>
          </div>

          {/* Core Parable Story (with Illuminated Drop Cap) */}
          <div
            className={`font-lora text-stone-200 leading-relaxed text-justify space-y-4 ${
              fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            <p className="first-letter:font-cinzel first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:pr-1 first-letter:leading-none">
              {firstLetter}
              {remainingStory}
            </p>
          </div>

          {/* Illuminated Lore Snippet / Core Quote */}
          {book.loreSnippet && (
            <div className="my-5 p-4 rounded-2xl bg-amber-950/30 border-l-4 border-amber-500 rounded-r-2xl border-y border-r border-amber-900/30 shadow-inner">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="font-lora text-xs sm:text-sm text-amber-100 italic font-medium leading-relaxed">
                  {book.loreSnippet}
                </p>
              </div>
            </div>
          )}

          {/* Spiritual Moral & Application Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/70 border border-amber-600/40 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Alegoria Espiritual & Lição da Graça
            </div>
            <p className="font-lora text-xs sm:text-sm text-stone-200 leading-relaxed">
              {book.spiritualMoral}
            </p>
            <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-200">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-cinzel font-semibold">Paralelo Bíblico:</span>
                <span className="font-lora font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
                  {book.scriptureParallel}
                </span>
              </div>
              <span className="text-[11px] text-stone-400 font-lora italic">
                {book.category} • Parábola Sagrada
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="relative z-10 px-4 sm:px-6 py-3.5 border-t border-amber-900/40 bg-stone-950/80 flex items-center justify-between gap-2 flex-wrap">
          {/* Previous / Next book navigation */}
          <div className="flex items-center gap-2">
            <button
              id="btn-reader-prev-book"
              onClick={handlePrevBook}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-cinzel text-xs text-amber-200 bg-stone-900 hover:bg-stone-800 border border-amber-900/50 transition-all cursor-pointer"
              title="Livro Anterior (Seta Esquerda / A)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <span className="text-[11px] text-amber-300/80 font-cinzel px-2">
              {currentIndex + 1} de {allBooks.length}
            </span>

            <button
              id="btn-reader-next-book"
              onClick={handleNextBook}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-cinzel text-xs text-amber-200 bg-stone-900 hover:bg-stone-800 border border-amber-900/50 transition-all cursor-pointer"
              title="Próximo Livro (Seta Direita / D)"
            >
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bookmark & Heart Meditation Action */}
          <div className="flex items-center gap-2">
            <button
              id="btn-reader-save-heart"
              onClick={handleSaveInHeart}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-cinzel font-semibold text-xs transition-all cursor-pointer ${
                isSavedInHeart
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 font-bold'
                  : 'bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSavedInHeart ? 'fill-stone-950' : 'text-rose-400'}`} />
              {isSavedInHeart ? 'Meditado no Coração' : 'Guardar no Coração'}
            </button>

            <button
              id="btn-reader-done"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl font-cinzel font-bold text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              Concluir Leitura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
