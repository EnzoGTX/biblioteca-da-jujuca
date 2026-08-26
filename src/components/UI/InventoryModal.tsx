import React, { useState } from 'react';
import { Book, BookCategory, Item, Shelf } from '../../types/game';
import { CATEGORY_COLORS, CATEGORY_SYMBOLS } from '../../game/constants';
import {
  BookOpen,
  Key,
  Scroll,
  X,
  Sparkles,
  CheckCircle2,
  Search,
  Compass,
  Heart,
  Bookmark,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Item[];
  heldBook: Book | null;
  allBooks: Book[];
  shelves: Shelf[];
  discoveredSecrets: string[];
  onOpenBookReader?: (book: Book) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  heldBook,
  allBooks,
  shelves,
  onOpenBookReader,
}) => {
  const [activeTab, setActiveTab] = useState<'livros' | 'parabolas' | 'chaves' | 'lore'>('livros');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedBook, setSelectedBook] = useState<Book | null>(heldBook || allBooks[0] || null);
  const [parableSearch, setParableSearch] = useState<string>('');

  if (!isOpen) return null;

  const categories: (BookCategory | 'TODAS')[] = [
    'TODAS',
    'NÁRNIA',
    'ALEGORIAS',
    'SABEDORIA',
    'LENDAS DA FÉ',
    'COSMOLOGIA',
    'CRIATURAS',
    'CURA ESPIRITUAL',
    'CÂNTICOS',
    'ALIANÇA',
    'ESCRITURAS',
  ];

  const filteredBooks = allBooks.filter((book) => {
    if (selectedCategory === 'TODAS') return true;
    return book.category === selectedCategory;
  });

  const organizedCount = allBooks.filter((b) => b.isOrganized).length;
  const readCount = allBooks.filter((b) => b.hasBeenRead).length;

  const filteredParables = allBooks.filter((b) => {
    if (!parableSearch.trim()) return true;
    const query = parableSearch.toLowerCase();
    return (
      b.title.toLowerCase().includes(query) ||
      b.parableTitle.toLowerCase().includes(query) ||
      b.scriptureParallel.toLowerCase().includes(query) ||
      (b.themeTag && b.themeTag.toLowerCase().includes(query)) ||
      b.spiritualMoral.toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        id="inventory-grimoire"
        className="relative w-full max-w-4xl h-[640px] max-h-[92vh] bg-stone-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #291c13 0%, #150f0a 100%)',
          boxShadow: '0 0 45px rgba(0,0,0,0.9), inset 0 0 40px rgba(120,53,15,0.25)',
        }}
      >
        {/* Header with Title & Grimoire Tabs */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-amber-900/60 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 tracking-wider">
                GRIMÓRIO DE JULIA FRAGA
              </h2>
              <p className="text-xs text-amber-400/70 font-lora">
                Santuário de Aether • {organizedCount}/{allBooks.length} Parábolas Organizadas
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="tab-livros-btn"
              onClick={() => setActiveTab('livros')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-cinzel transition-all cursor-pointer ${
                activeTab === 'livros'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Acervo</span> ({allBooks.length})
            </button>

            <button
              id="tab-parabolas-btn"
              onClick={() => setActiveTab('parabolas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-cinzel transition-all cursor-pointer ${
                activeTab === 'parabolas'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Códice de Parábolas</span>
            </button>

            <button
              id="tab-chaves-btn"
              onClick={() => setActiveTab('chaves')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-cinzel transition-all cursor-pointer ${
                activeTab === 'chaves'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chaves</span> ({inventory.length})
            </button>

            <button
              id="tab-lore-btn"
              onClick={() => setActiveTab('lore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-cinzel transition-all cursor-pointer ${
                activeTab === 'lore'
                  ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">História & Cartas</span>
            </button>

            <button
              id="close-inventory-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 transition-colors ml-1 cursor-pointer"
              title="Fechar (I ou ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: LIVROS / ACERVO GERAL */}
        {activeTab === 'livros' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Books List with Category Filter */}
            <div className="w-full md:w-1/2 p-4 border-r border-amber-900/40 flex flex-col overflow-hidden">
              {/* Currently Held Book Notice */}
              {heldBook && (
                <div className="mb-3 p-3 bg-purple-950/50 border border-purple-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-purple-300 animate-bounce" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold font-cinzel">
                        Livro em Mãos (Julia está carregando)
                      </span>
                      <p className="text-xs font-cinzel font-semibold text-purple-100 line-clamp-1">
                        {heldBook.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenBookReader) onOpenBookReader(heldBook);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-400/50 font-cinzel font-semibold cursor-pointer"
                  >
                    Ler Agora
                  </button>
                </div>
              )}

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full border transition-all cursor-pointer font-cinzel ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-stone-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-stone-900/80 text-stone-300 border-stone-700/60 hover:bg-stone-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Books Grid */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-amber-800">
                {filteredBooks.map((book) => {
                  const isSelected = selectedBook?.id === book.id;
                  const catColor = CATEGORY_COLORS[book.category];

                  return (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-stone-950/40 border-stone-800 hover:border-amber-700/50 hover:bg-stone-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border shadow-inner shrink-0"
                          style={{
                            backgroundColor: catColor?.bg || '#78350f',
                            borderColor: catColor?.border || '#b45309',
                          }}
                        >
                          <BookOpen className="w-4 h-4 text-amber-200" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-100 truncate">
                            {book.title}
                          </p>
                          <p className="text-[10px] text-stone-400 font-lora">
                            {book.category} {book.themeTag ? `• ${book.themeTag}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2 flex items-center gap-1.5">
                        {book.isOrganized ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-cinzel">
                            <CheckCircle2 className="w-3 h-3" />
                            Organizado
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400/80 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-600/20 font-cinzel">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Selected Book Inspector & Direct Parable Reader Trigger */}
            <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between bg-stone-950/60 overflow-y-auto">
              {selectedBook ? (
                <div className="space-y-3.5">
                  {/* Book Card Header */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-14 h-18 rounded-xl flex items-center justify-center text-2xl border-2 shadow-xl shrink-0"
                      style={{
                        backgroundColor: CATEGORY_COLORS[selectedBook.category]?.bg || '#78350f',
                        borderColor: CATEGORY_COLORS[selectedBook.category]?.border || '#b45309',
                      }}
                    >
                      <BookOpen className="w-7 h-7 text-amber-200" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-cinzel font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {selectedBook.category}
                        </span>
                        {selectedBook.themeTag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-cinzel bg-stone-900 text-stone-300 border border-stone-700">
                            {selectedBook.themeTag}
                          </span>
                        )}
                        {selectedBook.isOrganized && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-cinzel">
                            ✓ Na Estante
                          </span>
                        )}
                      </div>
                      <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-100 leading-snug">
                        {selectedBook.title}
                      </h3>
                      {selectedBook.parableTitle && (
                        <p className="text-xs text-amber-300/80 font-lora italic mt-0.5">
                          Parábola: {selectedBook.parableTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Parable Moral Highlight */}
                  <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-700/40">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-cinzel uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Lição Espiritual da Graça
                    </div>
                    <p className="text-xs text-amber-100 font-lora leading-relaxed">
                      {selectedBook.spiritualMoral}
                    </p>
                    <div className="mt-2 text-[11px] text-amber-300/90 font-cinzel flex items-center gap-1">
                      <Compass className="w-3 h-3" />
                      Paralelo Bíblico: <span className="font-bold text-amber-200">{selectedBook.scriptureParallel}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
                    <h4 className="text-[10px] font-bold text-stone-400 font-cinzel uppercase tracking-wider mb-1">
                      Sinopse Literária
                    </h4>
                    <p className="text-xs text-stone-200 leading-relaxed font-lora">
                      {selectedBook.description}
                    </p>
                  </div>

                  {/* Read Parable Full Button */}
                  <button
                    id="btn-open-parable-reader"
                    onClick={() => {
                      if (onOpenBookReader) onOpenBookReader(selectedBook);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-cinzel font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-600/20 border border-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <BookOpen className="w-4 h-4 fill-slate-950" />
                    ABRIR LEITURA DA PARÁBOLA COMPLETA
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-stone-500">
                  <BookOpen className="w-12 h-12 mb-2 stroke-1" />
                  <p className="text-sm font-lora">Selecione um livro para inspecionar seus segredos.</p>
                </div>
              )}

              {/* Status Footer */}
              <div className="pt-3 border-t border-amber-900/40 flex items-center justify-between text-xs text-stone-400">
                <span>Pressione <kbd className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-300 font-mono">E</kbd> para organizar na estante</span>
                <span className="text-amber-400 font-cinzel font-medium">Biblioteca de Aether</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CÓDICE DE PARÁBOLAS SAGRADAS (LORE SYSTEM) */}
        {activeTab === 'parabolas' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-900/40">
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" />
                  Códice das Sagradas Parábolas & Alegorias
                </h3>
                <p className="text-xs text-amber-300/70 font-lora">
                  Parábolas bíblicas alegoricamente adaptadas ao universo da biblioteca de fé
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="search-parabolas-input"
                  type="text"
                  value={parableSearch}
                  onChange={(e) => setParableSearch(e.target.value)}
                  placeholder="Buscar parábola, versículo ou tema..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-stone-950/80 border border-amber-900/60 text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 font-lora"
                />
              </div>
            </div>

            {/* Parables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredParables.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-2xl bg-stone-950/70 border border-amber-900/50 hover:border-amber-500/60 transition-all space-y-2.5 flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-cinzel font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {book.category}
                      </span>
                      {book.themeTag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-cinzel bg-stone-900 text-amber-200 border border-amber-700/40">
                          {book.themeTag}
                        </span>
                      )}
                    </div>

                    <h4 className="font-cinzel font-bold text-sm text-amber-100">
                      {book.parableTitle}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-lora italic mt-0.5">
                      Inspirado em: {book.title}
                    </p>

                    <p className="text-xs text-stone-300 font-lora line-clamp-3 mt-2 leading-relaxed">
                      {book.parableStory}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-amber-900/30 flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-cinzel font-semibold">
                      {book.scriptureParallel}
                    </span>

                    <button
                      onClick={() => {
                        if (onOpenBookReader) onOpenBookReader(book);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-cinzel font-semibold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ler Parábola</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: CHAVES & RELÍQUIAS */}
        {activeTab === 'chaves' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="font-cinzel text-base font-bold text-amber-200 mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Chaves e Relíquias do Santuário
            </h3>

            {inventory.length === 0 ? (
              <div className="text-center py-16 text-stone-500 font-lora">
                Nenhuma chave em mãos no momento. Explore as alas da biblioteca e converse com Eleanor para destrancar novas portas!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-stone-950/60 border border-amber-900/50 flex items-start gap-3.5 shadow-md"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-2xl shrink-0">
                      <Key className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-amber-200">{item.name}</h4>
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-cinzel">
                        Tipo: {item.type}
                      </span>
                      <p className="text-xs text-stone-300 font-lora mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: HISTÓRIA & CARTAS DE ELEANOR */}
        {activeTab === 'lore' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-800/40">
              <h4 className="font-cinzel font-bold text-sm text-amber-300 flex items-center gap-2 mb-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                A Carta de Boas-Vindas de Eleanor
              </h4>
              <p className="text-xs text-stone-300 font-lora leading-relaxed italic">
                "Prezada Julia Fraga, você foi chamada para este santuário de paz. Aqui repousam as parábolas que confortam os corações aflitos. Organize cada livro com serenidade e oração. Quando todas as histórias estiverem em seus lugares, a plenitude da Graça resplandecerá sobre a biblioteca."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-800/40">
              <h4 className="font-cinzel font-bold text-sm text-sky-300 flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-sky-400" />
                O Santuário das Sagradas Parábolas
              </h4>
              <p className="text-xs text-stone-300 font-lora leading-relaxed">
                Este lugar foi construído sobre os alicerces dos grandes contos da fé cristã: Nárnia, O Peregrino, os contos de George MacDonald e os salmos de Davi. Cada ala representa uma faceta do Reino dos Céus: Redenção, Sabedoria, Graça e Esperança.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-800/40">
              <h4 className="font-cinzel font-bold text-sm text-purple-300 flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Milo, o Felino de Luz
              </h4>
              <p className="text-xs text-stone-300 font-lora leading-relaxed">
                Milo é um dócil gatinho de luz que acompanha os servos fiéis. Seus pequenos miados e passos suaves lembram Julia de caminhar com calma e alegria pela biblioteca.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
