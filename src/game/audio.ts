// Procedural Web Audio API sound effects and ambient Christian Fantasy acoustic soundtrack

export interface LyricLine {
  timeSec: number;
  text: string;
  subtext?: string;
}

export const HYMN_LYRICS: LyricLine[] = [
  { timeSec: 0, text: '♪ (Introdução Serena ao Violão Acústico) ♪', subtext: 'Grande é o Amor de Deus' },
  { timeSec: 16, text: 'Jesus deixou toda a sua glória...', subtext: 'Humilhou-se por amor à criação' },
  { timeSec: 25, text: 'Veio ao mundo como homem pra nos salvar...', subtext: 'A luz que resplandece nas trevas' },
  { timeSec: 34, text: 'Viveu aqui e conheceu nossas dores...', subtext: 'O Bom Pastor que cuida de cada ovelha' },
  { timeSec: 42, text: 'Mas tudo Ele sofreu e venceu em nosso lugar...', subtext: 'A vitória da graça sobre a morte' },
  { timeSec: 51, text: 'Pra nos mostrar que o Criador, o único Deus...', subtext: 'O Pai compassivo e eterno' },
  { timeSec: 61, text: 'Nos ama e deseja restaurar!', subtext: 'Renovando todas as coisas' },
  { timeSec: 69, text: 'Seu perdão vai além dos céus, nenhum monte é tão alto...', subtext: 'Misericórdia sem fim' },
  { timeSec: 78, text: 'Nenhum vale é tão profundo como o amor do nosso Deus...', subtext: 'Graça incondicional' },
  { timeSec: 88, text: 'Grande, tão grande! Alto, tão alto!', subtext: 'Mais sublime que as estrelas do céu' },
  { timeSec: 97, text: 'Fundo, tão profundo! É maior que o mundo...', subtext: 'Mais vasto que os oceanos' },
  { timeSec: 107, text: 'Mas é pequeno: cabe lá dentro do coração...', subtext: 'Morando no coração dos humildes' },
  { timeSec: 118, text: 'De quem se entrega ao Salvador! ♥', subtext: 'Paz que excede todo o entendimento' },
];

// Frequencies for musical notes (Key of D major / E major)
const NOTE_FREQS: Record<string, number> = {
  'D3': 146.83, 'E3': 164.81, 'F#3': 185.00, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94, 'C#4': 277.18,
  'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C#5': 554.37,
  'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  public isMusicPlaying = false;
  private musicTimer: number | null = null;
  public musicVolume = 0.5;
  public sfxVolume = 0.6;
  public isMuted = false;
  public songProgressSec = 0;
  private progressInterval: number | null = null;
  private songStartTime = 0;

  public initContext(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolumes(music: number, sfx: number) {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.musicVolume, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    this.setVolumes(this.musicVolume, this.sfxVolume);
    return this.isMuted;
  }

  // --- WARM ACOUSTIC GUITAR / PLUCK SYNTHESIS ---
  private playGuitarPluck(freq: number, time: number, duration: number = 1.8, velocity: number = 0.22) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    try {
      // Dual oscillator with subtle harmonic detune for rich nylon acoustic timbre
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.5, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + duration * 0.8);

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, time);

      const vol = velocity * this.musicVolume;
      gainNode.gain.setValueAtTime(0.0001, time);
      gainNode.gain.linearRampToValueAtTime(vol, time + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(vol * 0.45, time + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.musicGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
    } catch {
      // Ignore
    }
  }

  // --- CELESTA / PEACEFUL CHIME MELODY NOTE ---
  private playCelestaNote(freq: number, time: number, duration: number = 1.5, velocity: number = 0.18) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      const vol = velocity * this.musicVolume;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.025);
      gain.gain.exponentialRampToValueAtTime(vol * 0.5, time + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Ignore
    }
  }

  // --- SOUND EFFECTS ---

  public playStep() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(240, this.ctx.currentTime);

      osc.type = 'sine';
      const pitch = 65 + Math.random() * 15;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.04 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // Audio not permitted yet
    }
  }

  public playBookPickup() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Gentle warm sacred chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(NOTE_FREQS['D4'], now);
      osc.frequency.exponentialRampToValueAtTime(NOTE_FREQS['A4'], now + 0.22);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Ignore
    }
  }

  public playBookPlacedSuccess() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Heavenly peaceful grace arpeggio (D major: D4, F#4, A4, D5, F#5)
      const freqs = [NOTE_FREQS['D4'], NOTE_FREQS['F#4'], NOTE_FREQS['A4'], NOTE_FREQS['D5'], NOTE_FREQS['F#5']];
      freqs.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0.01, now + index * 0.07);
        gain.gain.linearRampToValueAtTime(0.22 * this.sfxVolume, now + index * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.85);
      });
    } catch {
      // Ignore
    }
  }

  public playBookPlacedError() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.3);

      gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Ignore
    }
  }

  public playMeow() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.linearRampToValueAtTime(680, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.38);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.16 * this.sfxVolume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  public playDoorUnlock() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Sacred golden chime
      [NOTE_FREQS['A4'], NOTE_FREQS['D5'], NOTE_FREQS['F#5']].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.01, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2 * this.sfxVolume, now + i * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  public playDialogueBlip() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520 + (Math.random() * 40 - 20), now);
      gain.gain.setValueAtTime(0.03 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Ignore
    }
  }

  public playBookPageTurn() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Gentle warm paper rustle + soft harp harmonic
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(NOTE_FREQS['F#4'] || 369.99, now);
      osc.frequency.exponentialRampToValueAtTime(NOTE_FREQS['A4'] || 440.0, now + 0.15);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Ignore
    }
  }

  public playQuestChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      [NOTE_FREQS['D5'], NOTE_FREQS['F#5'], NOTE_FREQS['A5']].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.01, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.15 * this.sfxVolume, now + i * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.55);
      });
    } catch {
      // Ignore
    }
  }

  public playLoveSparkleChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Sweet romantic warm chime (F#5 -> A5 -> C#6 -> D6)
      const loveNotes = [NOTE_FREQS['F#5'] || 739.99, NOTE_FREQS['A5'] || 880, NOTE_FREQS['C#5'] ? NOTE_FREQS['C#5'] * 2 : 1108.73, NOTE_FREQS['D5'] ? NOTE_FREQS['D5'] * 2 : 1174.66];
      loveNotes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.01, now + i * 0.07);
        gain.gain.linearRampToValueAtTime(0.16 * this.sfxVolume, now + i * 0.07 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.7);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.75);
      });
    } catch {
      // Ignore
    }
  }

  public playAreaCompletedFanfare() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Radiant Christian blessing chord progression (D -> G -> A -> D sus -> D)
      const chordGroups = [
        { freqs: [NOTE_FREQS['D4'], NOTE_FREQS['F#4'], NOTE_FREQS['A4']], delay: 0 },
        { freqs: [NOTE_FREQS['G4'], NOTE_FREQS['B4'], NOTE_FREQS['D5']], delay: 0.35 },
        { freqs: [NOTE_FREQS['A4'], NOTE_FREQS['C#5'], NOTE_FREQS['E5']], delay: 0.7 },
        { freqs: [NOTE_FREQS['D4'], NOTE_FREQS['A4'], NOTE_FREQS['D5'], NOTE_FREQS['F#5']], delay: 1.1 },
      ];

      chordGroups.forEach((group) => {
        group.freqs.forEach((f) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + group.delay);
          gain.gain.setValueAtTime(0.01, now + group.delay);
          gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, now + group.delay + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + group.delay + 1.2);

          osc.connect(gain);
          gain.connect(this.sfxGain!);

          osc.start(now + group.delay);
          osc.stop(now + group.delay + 1.25);
        });
      });
    } catch {
      // Ignore
    }
  }

  // --- CALM ACOUSTIC HYMN: "JESUS DEIXOU TODA A SUA GLÓRIA" ---

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    this.isMusicPlaying = true;
    this.songStartTime = Date.now();

    // Fingerpicked acoustic chords progression in D Major:
    // D -> A/C# -> Bm -> Bm/A -> G -> D/F# -> Em7 -> A7
    // Chorus: D -> G -> A -> D -> Bm -> Em -> A -> D
    const progression = [
      // Verse 1 (Jesus deixou toda a sua glória...)
      { root: 'D3', chord: ['D4', 'F#4', 'A4', 'D5'], melody: ['A4', 'A4', 'G4', 'F#4'] },
      { root: 'C#4', chord: ['A3', 'E4', 'A4', 'C#5'], melody: ['F#4', 'G4', 'A4', 'B4'] },
      { root: 'B3', chord: ['B3', 'F#4', 'B4', 'D5'], melody: ['A4', 'F#4', 'G4', 'A4'] },
      { root: 'A3', chord: ['A3', 'E4', 'A4', 'C#5'], melody: ['B4', 'A4', 'G4', 'F#4'] },
      { root: 'G3', chord: ['G3', 'D4', 'G4', 'B4'], melody: ['E4', 'D4', 'E4', 'F#4'] },
      { root: 'F#3', chord: ['F#3', 'D4', 'F#4', 'A4'], melody: ['G4', 'F#4', 'E4', 'D4'] },
      { root: 'E3', chord: ['E3', 'B3', 'E4', 'G4'], melody: ['E4', 'F#4', 'G4', 'A4'] },
      { root: 'A3', chord: ['A3', 'E4', 'G4', 'C#5'], melody: ['B4', 'A4', 'G4', 'A4'] },

      // Chorus (Grande, tão grande! Alto, tão alto! Fundo, tão profundo...)
      { root: 'D3', chord: ['D4', 'F#4', 'A4', 'D5'], melody: ['D5', 'F#5', 'E5', 'D5'] },
      { root: 'G3', chord: ['G3', 'D4', 'G4', 'B4'], melody: ['B4', 'G5', 'F#5', 'E5'] },
      { root: 'A3', chord: ['A3', 'E4', 'A4', 'C#5'], melody: ['C#5', 'A5', 'G5', 'F#5'] },
      { root: 'D3', chord: ['D4', 'F#4', 'A4', 'D5'], melody: ['E5', 'D5', 'C#5', 'D5'] },
      { root: 'B3', chord: ['B3', 'F#4', 'B4', 'D5'], melody: ['D5', 'C#5', 'B4', 'A4'] },
      { root: 'E3', chord: ['E3', 'B3', 'E4', 'G4'], melody: ['G4', 'F#4', 'G4', 'A4'] },
      { root: 'A3', chord: ['A3', 'E4', 'A4', 'C#5'], melody: ['B4', 'A4', 'G4', 'E4'] },
      { root: 'D3', chord: ['D4', 'F#4', 'A4', 'D5'], melody: ['D4', 'F#4', 'A4', 'D5'] },
    ];

    let chordIndex = 0;
    let arpeggioStep = 0;

    const playHymnStep = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) return;

      try {
        const item = progression[chordIndex];
        const now = this.ctx.currentTime;

        // 1. Acoustic Bass Pluck on start of chord
        if (arpeggioStep === 0) {
          const rootFreq = NOTE_FREQS[item.root] || 146.83;
          this.playGuitarPluck(rootFreq, now, 2.4, 0.28);
        }

        // 2. Gentle fingerpicking arpeggio
        const chordNoteName = item.chord[arpeggioStep % item.chord.length];
        const chordFreq = NOTE_FREQS[chordNoteName] || 293.66;
        this.playGuitarPluck(chordFreq, now + 0.02, 1.6, 0.16);

        // 3. Serene Celesta Melody (follows the vocal line of the song)
        if (arpeggioStep === 0 || arpeggioStep === 2) {
          const melodyNoteName = item.melody[(arpeggioStep / 2) % item.melody.length];
          const melodyFreq = NOTE_FREQS[melodyNoteName] || 440;
          this.playCelestaNote(melodyFreq, now + 0.04, 1.8, 0.20);
        }

        arpeggioStep++;
        if (arpeggioStep >= 4) {
          arpeggioStep = 0;
          chordIndex = (chordIndex + 1) % progression.length;
        }
      } catch {
        // Ignore audio state
      }
    };

    // Soft, tranquil acoustic tempo (~68 BPM / ~440ms per arpeggio note)
    this.musicTimer = window.setInterval(playHymnStep, 440);

    // Track lyrics time for UI
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = window.setInterval(() => {
      this.songProgressSec = (Date.now() - this.songStartTime) / 1000;
      if (this.songProgressSec > 130) {
        this.songStartTime = Date.now();
        this.songProgressSec = 0;
      }
    }, 500);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }
}

export const soundManager = new SoundEngine();
