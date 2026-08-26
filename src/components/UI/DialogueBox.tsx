import React, { useEffect, useState } from 'react';
import { DialogueNode } from '../../types/game';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: DialogueNode;
  onAdvance: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onAdvance }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const fullText = dialogue.text;

    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [dialogue]);

  const handleSkipOrAdvance = () => {
    if (isTyping) {
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      onAdvance();
    }
  };

  const getSpeakerStyles = (speaker: string) => {
    switch (speaker) {
      case 'Enzo Amorzin da Julia':
        return {
          color: 'text-rose-300',
          border: 'border-rose-500/50',
          glow: 'shadow-rose-500/30',
          badgeBg: 'bg-rose-950/80 text-rose-200 border-rose-400/40',
          role: 'Seu Amorzin ❤️',
        };
      case 'Eleanor':
        return {
          color: 'text-sky-300',
          border: 'border-sky-500/40',
          glow: 'shadow-sky-500/20',
          badgeBg: 'bg-sky-950/80 text-sky-200 border-sky-400/40',
          role: 'Antiga Bibliotecária Mestra (Espírito Guardião)',
        };
      case 'Milo':
        return {
          color: 'text-purple-300',
          border: 'border-purple-500/40',
          glow: 'shadow-purple-500/20',
          badgeBg: 'bg-purple-950/80 text-purple-200 border-purple-400/40',
          role: 'Gato Mágico Guardião',
        };
      case 'Julia':
      default:
        return {
          color: 'text-amber-300',
          border: 'border-amber-500/40',
          glow: 'shadow-amber-500/20',
          badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-400/40',
          role: 'Nova Bibliotecária de Aether',
        };
    }
  };

  const styles = getSpeakerStyles(dialogue.speaker);

  return (
    <div
      id="dialogue-overlay"
      className="absolute inset-x-0 bottom-6 mx-auto w-full max-w-3xl px-4 z-40 cursor-pointer"
      onClick={handleSkipOrAdvance}
    >
      <div
        className={`relative bg-slate-950/95 backdrop-blur-md rounded-2xl border-2 ${styles.border} p-5 md:p-6 shadow-2xl ${styles.glow} transition-all`}
      >
        {/* Speaker Info Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-3">
            {/* Avatar Badge */}
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
              {dialogue.speaker === 'Enzo Amorzin da Julia'
                ? '💖'
                : dialogue.speaker === 'Eleanor'
                ? '👻'
                : dialogue.speaker === 'Milo'
                ? '🐱'
                : '👩‍🦰'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-cinzel font-bold text-lg md:text-xl ${styles.color}`}>
                  {dialogue.speaker}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${styles.badgeBg}`}>
                  {styles.role}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800">
            <span>Pressione</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">ESPAÇO</kbd>
            <span>ou</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">E</kbd>
          </div>
        </div>

        {/* Dialogue Text Content with Typewriter */}
        <div className="min-h-[64px] font-lora text-slate-100 text-base md:text-lg leading-relaxed pl-1 pr-4">
          <p>
            "{displayedText}"
            {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
          </p>
        </div>

        {/* Advance Indicator */}
        <div className="flex justify-end items-center gap-1 mt-2 text-xs text-amber-400/80 font-medium">
          <span>{isTyping ? 'Clique para acelerar' : 'Avançar'}</span>
          <ArrowRight className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
