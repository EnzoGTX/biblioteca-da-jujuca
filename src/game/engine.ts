import { Book, DialogueNode, Direction, GameSaveData, Item, NPC, Particle, Quest, Room, Shelf } from '../types/game';
import { soundManager } from './audio';
import { DIALOGUES, INITIAL_BOOKS, INITIAL_ITEMS, INITIAL_QUESTS, INITIAL_SHELVES, JULIA_MONOLOGUES } from './constants';
import { INITIAL_NPCS, ROOMS } from './mapData';
import { SaveManager } from './saveSystem';
import { SpriteRenderer } from './sprites';

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  // Game Loop
  private isRunning = false;
  private animFrameId: number | null = null;
  private lastTime = 0;

  // Viewport / Screen
  public width = 1000;
  public height = 650;
  public zoom = 1.0;

  // World & Camera
  public currentRoomId = 'main_hall';
  public camera = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // Player (Julia Fraga)
  public player = {
    x: 600,
    y: 480,
    vx: 0,
    vy: 0,
    speed: 2.7,
    width: 28,
    height: 36,
    direction: 'down' as Direction,
    isMoving: false,
    walkFrame: 0,
    heldBookId: null as string | null,
    isPlacing: false,
    stepTimer: 0,
  };

  // Companion (Milo the Magical Cat)
  public milo = {
    x: 570,
    y: 520,
    direction: 'down' as Direction,
    bubble: null as string | null,
    bubbleTimer: 0,
  };

  // Interactive Game Objects
  public rooms: Record<string, Room> = JSON.parse(JSON.stringify(ROOMS));
  public books: Book[] = JSON.parse(JSON.stringify(INITIAL_BOOKS));
  public shelves: Shelf[] = JSON.parse(JSON.stringify(INITIAL_SHELVES));
  public npcs: NPC[] = JSON.parse(JSON.stringify(INITIAL_NPCS));
  public inventory: Item[] = JSON.parse(JSON.stringify(INITIAL_ITEMS));
  public quests: Quest[] = JSON.parse(JSON.stringify(INITIAL_QUESTS));
  public activeQuestId = 'quest-1';
  public completedQuestIds: string[] = [];
  public unlockedDoorsIds: string[] = [];
  public discoveredSecrets: string[] = [];
  public roomStars: Record<string, number> = {};

  // FX & Particles
  public particles: Particle[] = [];
  public particlesEnabled = true;

  // Active UI Prompts & Popups
  public currentInteractPrompt: { text: string; action: () => void; type: 'book' | 'shelf' | 'npc' | 'object' | 'door' } | null = null;
  public activeDialogue: DialogueNode | null = null;
  public activeMonologue: string | null = null;
  public monologueTimer = 0;
  public toastNotification: { text: string; type: 'success' | 'error' | 'info'; timer: number } | null = null;
  public roomCelebration: { title: string; subtitle: string; stars: number } | null = null;

  // Input states
  public keys: Record<string, boolean> = {};

  // Callbacks to React UI Layer
  public onStateChange?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D Canvas context');
    this.ctx = context;
    this.initDustParticles();
  }

  public init() {
    this.bindEvents();
    this.triggerMonologue('Então... este é o lugar que eu deveria organizar?');
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public destroy() {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // If dialogue open, space or E advances
    if (this.activeDialogue) {
      if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
        e.preventDefault();
        this.advanceDialogue();
        return;
      }
    }

    if (e.code === 'KeyE' || e.code === 'Space') {
      if (this.currentInteractPrompt) {
        e.preventDefault();
        this.currentInteractPrompt.action();
        return;
      }
    }

    this.keys[e.code] = true;
    this.keys[e.key] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
    this.keys[e.key] = false;
  };

  // --- SAVE & LOAD ---

  public loadSavedGame(): boolean {
    const saved = SaveManager.loadGame();
    if (!saved) return false;

    this.player.x = saved.player.x;
    this.player.y = saved.player.y;
    this.player.direction = saved.player.direction;
    this.player.heldBookId = saved.player.heldBookId;
    this.currentRoomId = saved.player.roomId;

    this.milo.x = saved.milo.x;
    this.milo.y = saved.milo.y;
    this.milo.direction = saved.milo.direction;

    this.inventory = saved.inventory || [];
    this.activeQuestId = saved.activeQuestId || 'quest-1';
    this.completedQuestIds = saved.completedQuestIds || [];
    this.unlockedDoorsIds = saved.unlockedDoorsIds || [];
    this.discoveredSecrets = saved.discoveredSecrets || [];
    this.roomStars = saved.roomStars || {};

    // Restore books and shelves
    saved.booksOrganizedIds.forEach((bId) => {
      const book = this.books.find((b) => b.id === bId);
      if (book) {
        book.isOrganized = true;
        const matchingShelf = this.shelves.find((s) => s.category === book.category);
        if (matchingShelf && !matchingShelf.placedBookIds.includes(bId)) {
          matchingShelf.placedBookIds.push(bId);
        }
      }
    });

    this.showToast('Progresso carregado com sucesso!', 'info');
    return true;
  }

  public saveCurrentGame(): boolean {
    const organizedIds = this.books.filter((b) => b.isOrganized).map((b) => b.id);
    const data: GameSaveData = {
      version: 1,
      timestamp: Date.now(),
      playTimeMinutes: 0,
      player: {
        x: this.player.x,
        y: this.player.y,
        roomId: this.currentRoomId,
        direction: this.player.direction,
        heldBookId: this.player.heldBookId,
      },
      milo: {
        x: this.milo.x,
        y: this.milo.y,
        direction: this.milo.direction,
      },
      booksOrganizedIds: organizedIds,
      unlockedDoorsIds: this.unlockedDoorsIds,
      inventory: this.inventory,
      activeQuestId: this.activeQuestId,
      completedQuestIds: this.completedQuestIds,
      discoveredSecrets: this.discoveredSecrets,
      readNotes: [],
      roomStars: this.roomStars,
      settings: {
        musicVolume: soundManager.musicVolume,
        sfxVolume: soundManager.sfxVolume,
        particlesEnabled: this.particlesEnabled,
        zoomLevel: this.zoom,
      },
    };

    const ok = SaveManager.saveGame(data);
    if (ok) {
      this.showToast('Jogo salvo com sucesso!', 'success');
    }
    return ok;
  }

  // --- GAME LOOP ---

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private loop = (time: number) => {
    if (!this.isRunning) return;
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    this.update(dt, time);
    this.render(time);

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  // --- UPDATE LOGIC ---

  public update(dt: number, time: number) {
    const room = this.rooms[this.currentRoomId] || this.rooms.main_hall;

    // Handle toast timers
    if (this.toastNotification) {
      this.toastNotification.timer -= dt;
      if (this.toastNotification.timer <= 0) {
        this.toastNotification = null;
        this.onStateChange?.();
      }
    }

    // Handle monologue timer
    if (this.activeMonologue) {
      this.monologueTimer -= dt;
      if (this.monologueTimer <= 0) {
        this.activeMonologue = null;
        this.onStateChange?.();
      }
    }

    // Handle Milo bubbles
    if (this.milo.bubble) {
      this.milo.bubbleTimer -= dt;
      if (this.milo.bubbleTimer <= 0) {
        this.milo.bubble = null;
      }
    }

    // 1. PLAYER MOVEMENT & INPUT
    let moveX = 0;
    let moveY = 0;

    if (!this.activeDialogue && !this.roomCelebration) {
      if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
    }

    // Normalize diagonal
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    const isMoving = moveX !== 0 || moveY !== 0;
    this.player.isMoving = isMoving;

    if (isMoving) {
      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.player.direction = moveX > 0 ? 'right' : 'left';
      } else {
        this.player.direction = moveY > 0 ? 'down' : 'up';
      }
      this.player.walkFrame += dt;

      // Footstep sound
      this.player.stepTimer += dt;
      if (this.player.stepTimer > 0.38) {
        soundManager.playStep();
        this.player.stepTimer = 0;
      }
    }

    // Inertia acceleration / deceleration
    const targetVx = moveX * this.player.speed;
    const targetVy = moveY * this.player.speed;
    this.player.vx += (targetVx - this.player.vx) * 0.35;
    this.player.vy += (targetVy - this.player.vy) * 0.35;

    // Proposed new position
    const nextX = this.player.x + this.player.vx;
    const nextY = this.player.y + this.player.vy;

    // 2. COLLISION DETECTION
    const hitbox = {
      x: nextX - 10,
      y: nextY + 4,
      w: 20,
      h: 14,
    };

    let canMoveX = true;
    let canMoveY = true;

    // Check room boundaries and walls
    const checkObstacle = (box: { x: number; y: number; w: number; h: number }) => {
      // Room perimeter
      if (box.x < 80 || box.x + box.w > room.width - 80) return true;
      if (box.y < 80 || box.y + box.h > room.height - 80) return true;

      // Walls
      for (const wall of room.walls) {
        if (this.rectsIntersect(box, wall)) return true;
      }

      // Obstacles
      for (const obs of room.obstacles) {
        if (obs.type === 'carpet' || obs.type === 'window') continue; // Passable
        const obsBox = { x: obs.x + 4, y: obs.y + obs.h / 2, w: obs.w - 8, h: obs.h / 2 };
        if (this.rectsIntersect(box, obsBox)) return true;
      }

      // Shelves
      const roomShelves = this.shelves.filter((s) => s.roomId === this.currentRoomId);
      for (const shelf of roomShelves) {
        const shelfBox = { x: shelf.x + 4, y: shelf.y + 20, w: shelf.width - 8, h: shelf.height - 20 };
        if (this.rectsIntersect(box, shelfBox)) return true;
      }

      // NPCs
      const roomNpcs = this.npcs.filter((n) => n.roomId === this.currentRoomId);
      for (const npc of roomNpcs) {
        const npcBox = { x: npc.x - 14, y: npc.y - 10, w: 28, h: 28 };
        if (this.rectsIntersect(box, npcBox)) return true;
      }

      return false;
    };

    // Separate axis check for smooth wall sliding
    const testBoxX = { x: nextX - 10, y: this.player.y + 4, w: 20, h: 14 };
    if (checkObstacle(testBoxX)) canMoveX = false;

    const testBoxY = { x: this.player.x - 10, y: nextY + 4, w: 20, h: 14 };
    if (checkObstacle(testBoxY)) canMoveY = false;

    if (canMoveX) this.player.x = nextX;
    if (canMoveY) this.player.y = nextY;

    // 3. COMPANION (Milo) AI
    const dxMilo = this.player.x - this.milo.x;
    const dyMilo = this.player.y - this.milo.y;
    const distMilo = Math.hypot(dxMilo, dyMilo);

    if (distMilo > 45) {
      const miloSpeed = Math.min(distMilo * 0.08, 3.2);
      this.milo.x += (dxMilo / distMilo) * miloSpeed;
      this.milo.y += (dyMilo / distMilo) * miloSpeed;
      this.milo.direction = dxMilo > 0 ? 'right' : 'left';

      // Rare random meow when running
      if (Math.random() < 0.0015) {
        this.triggerMiloMeow('Miau!');
      }
    }

    // 4. CAMERA LERP (Smooth follow + clamping)
    const targetCamX = this.player.x - this.width / 2;
    const targetCamY = this.player.y - this.height / 2;

    const maxCamX = Math.max(0, room.width - this.width);
    const maxCamY = Math.max(0, room.height - this.height);

    this.camera.targetX = Math.max(0, Math.min(targetCamX, maxCamX));
    this.camera.targetY = Math.max(0, Math.min(targetCamY, maxCamY));

    this.camera.x += (this.camera.targetX - this.camera.x) * 0.1;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.1;

    // 5. UPDATE PARTICLES
    if (this.particlesEnabled) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;
        p.alpha = Math.max(0, p.life / p.maxLife);
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
      // Keep ambient dust motes alive
      if (this.particles.length < 40 && Math.random() < 0.3) {
        this.particles.push({
          x: Math.random() * room.width,
          y: Math.random() * room.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.3,
          size: 1 + Math.random() * 2,
          alpha: 0.7,
          life: 4 + Math.random() * 4,
          maxLife: 8,
          color: '#fef08a',
          type: 'dust',
        });
      }
    }

    // 6. CHECK INTERACTABLE PROMPTS
    this.checkInteractions();
  }

  // --- INTERACTIONS SYSTEM ---

  private checkInteractions() {
    const room = this.rooms[this.currentRoomId];
    const px = this.player.x;
    const py = this.player.y;
    let foundPrompt: typeof this.currentInteractPrompt = null;

    // A. Check Doors
    for (const door of room.doors) {
      const dist = Math.hypot(px - (door.x + door.w / 2), py - (door.y + door.h / 2));
      if (dist < 55) {
        if (door.locked) {
          const hasKey = this.inventory.some((i) => i.id === door.requiredKeyId);
          foundPrompt = {
            text: hasKey ? `E — ABRIR PORTA COM CHAVE` : `🔒 PORTA TRANCADA (${door.lockName || 'Requer Chave'})`,
            type: 'door',
            action: () => {
              if (hasKey) {
                door.locked = false;
                this.unlockedDoorsIds.push(door.id);
                soundManager.playDoorUnlock();
                this.showToast('Porta destrancada!', 'success');
                this.enterDoor(door);
              } else {
                soundManager.playBookPlacedError();
                this.showToast(`Trancada: ${door.lockName || 'Você precisa de uma chave'}`, 'error');
              }
            },
          };
        } else {
          foundPrompt = {
            text: `E — ENTRAR NA SALA`,
            type: 'door',
            action: () => this.enterDoor(door),
          };
        }
        break;
      }
    }

    // B. Check NPCs
    if (!foundPrompt) {
      const roomNpcs = this.npcs.filter((n) => n.roomId === this.currentRoomId);
      for (const npc of roomNpcs) {
        const dist = Math.hypot(px - npc.x, py - npc.y);
        if (dist < 60) {
          foundPrompt = {
            text: npc.avatarType === 'enzo' ? 'E — FALAR' : `E — CONVERSAR COM ${npc.name.toUpperCase()}`,
            type: 'npc',
            action: () => {
              this.startDialogue(npc.dialogueId);
              if (npc.avatarType === 'enzo') {
                this.createSparkleBurst(npc.x, npc.y, '#f43f5e', 30);
                soundManager.playLoveSparkleChime();
              }
            },
          };
          break;
        }
      }
    }

    // C. Check Books on Ground
    if (!foundPrompt && !this.player.heldBookId) {
      const roomBooks = this.books.filter((b) => b.roomOrigin === this.currentRoomId && !b.isOrganized);
      for (const book of roomBooks) {
        const dist = Math.hypot(px - book.x, py - book.y);
        if (dist < 48) {
          foundPrompt = {
            text: `E — PEGAR LIVRO: "${book.title.toUpperCase()}"`,
            type: 'book',
            action: () => this.pickupBook(book),
          };
          break;
        }
      }
    }

    // D. Check Shelves (Placing Book or Organizing)
    if (!foundPrompt) {
      const roomShelves = this.shelves.filter((s) => s.roomId === this.currentRoomId);
      for (const shelf of roomShelves) {
        const shelfCenterX = shelf.x + shelf.width / 2;
        const shelfCenterY = shelf.y + shelf.height / 2;
        const dist = Math.hypot(px - shelfCenterX, py - shelfCenterY);

        if (dist < 68) {
          if (this.player.heldBookId) {
            const heldBook = this.books.find((b) => b.id === this.player.heldBookId);
            if (heldBook) {
              foundPrompt = {
                text: `E — ORGANIZAR LIVRO NA ${shelf.name.toUpperCase()} (${shelf.symbol} ${shelf.category})`,
                type: 'shelf',
                action: () => this.tryPlaceBook(shelf, heldBook),
              };
            }
          } else {
            foundPrompt = {
              text: `📖 ${shelf.name.toUpperCase()} (${shelf.symbol} ${shelf.category}) — [${shelf.placedBookIds.length}/${shelf.maxCapacity}]`,
              type: 'shelf',
              action: () => {
                this.showToast(`${shelf.name}: Categoria ${shelf.category}`, 'info');
              },
            };
          }
          break;
        }
      }
    }

    // E. Check Interactive Obstacles
    if (!foundPrompt) {
      for (const obs of room.obstacles) {
        if (obs.interactable) {
          const obsCenterX = obs.x + obs.w / 2;
          const obsCenterY = obs.y + obs.h / 2;
          const dist = Math.hypot(px - obsCenterX, py - obsCenterY);
          if (dist < 55) {
            foundPrompt = {
              text: `E — INSPECIONAR: ${obs.name || 'OBJETO'}`,
              type: 'object',
              action: () => this.interactWithObstacle(obs),
            };
            break;
          }
        }
      }
    }

    this.currentInteractPrompt = foundPrompt;
    this.onStateChange?.();
  }

  // --- ACTIONS ---

  public pickupBook(book: Book) {
    if (this.player.heldBookId) return;

    this.player.heldBookId = book.id;
    soundManager.playBookPickup();
    this.createSparkleBurst(book.x, book.y, book.color || '#a855f7', 15);
    this.showToast(`LIVRO: ${book.title.toUpperCase()} [${book.category}]`, 'info');

    if (book.isSpecial === 'living') {
      this.triggerMonologue('Esse livro... tentou pular da minha mão?! Ele é tão quentinho!');
    } else if (book.isSpecial === 'lost') {
      this.triggerMonologue('Este é o Diário Esquecido de Eleanor! A caligrafia é idêntica à do retrato...');
    }

    this.onStateChange?.();
  }

  public tryPlaceBook(shelf: Shelf, book: Book) {
    if (!this.player.heldBookId) return;

    this.player.isPlacing = true;
    setTimeout(() => {
      this.player.isPlacing = false;
    }, 450);

    // Is it the correct category? (Master forbidden shelf accepts all special books too)
    const isCorrect = shelf.category === book.category || shelf.id === 'shelf-forbidden-master';

    if (isCorrect) {
      // Success!
      book.isOrganized = true;
      book.placedInShelfId = shelf.id;
      if (!shelf.placedBookIds.includes(book.id)) {
        shelf.placedBookIds.push(book.id);
      }
      this.player.heldBookId = null;

      soundManager.playBookPlacedSuccess();
      this.createSparkleBurst(shelf.x + shelf.width / 2, shelf.y + shelf.height / 2, '#38bdf8', 25);
      this.showToast(`✓ LIVRO ORGANIZADO COM SUCESSO!`, 'success');

      // Update quests
      this.checkQuestProgression();

      // Check room completion
      this.checkRoomCompletion();
    } else {
      // Wrong shelf
      soundManager.playBookPlacedError();
      this.showToast(`✕ ESTE LIVRO NÃO PERTENCE AQUI! (Categoria correta: ${book.category})`, 'error');
    }

    this.onStateChange?.();
  }

  private enterDoor(door: Room['doors'][0]) {
    soundManager.playDoorUnlock();
    this.currentRoomId = door.targetRoomId;
    this.player.x = door.targetX;
    this.player.y = door.targetY;
    this.milo.x = door.targetX - 25;
    this.milo.y = door.targetY;

    this.showToast(`Você entrou em: ${this.rooms[this.currentRoomId].name}`, 'info');
    this.autoSave();
    this.onStateChange?.();
  }

  private interactWithObstacle(obs: Room['obstacles'][0]) {
    soundManager.playDialogueBlip();

    if (obs.hasSecret && !obs.secretFound) {
      obs.secretFound = true;
      if (obs.secretRewardKey === 'key_history') {
        const keyItem: Item = {
          id: 'key_history',
          name: 'Chave de Cobre da Ala de História',
          type: 'key',
          icon: '🗝️',
          description: 'Encontrada no compartimento secreto do Relógio de Pêndulo.',
        };
        if (!this.inventory.some((i) => i.id === 'key_history')) {
          this.inventory.push(keyItem);
          this.showToast('Você encontrou a Chave da Ala de História!', 'success');
          soundManager.playAreaCompletedFanfare();
        }
      } else if (obs.secretRewardKey === 'key_forbidden') {
        const keyItem: Item = {
          id: 'key_forbidden',
          name: 'Chave Rúnica da Biblioteca Proibida',
          type: 'key',
          icon: '✨',
          description: 'Revelada pelo alinhamento estelar no Grande Telescópio.',
        };
        if (!this.inventory.some((i) => i.id === 'key_forbidden')) {
          this.inventory.push(keyItem);
          this.showToast('Você obteve o Selo Rúnico da Biblioteca Proibida!', 'success');
          soundManager.playAreaCompletedFanfare();
        }
      }
    }

    if (obs.type === 'clock') {
      this.startDialogue('clock-inspect');
    } else if (obs.interactMessage) {
      this.showToast(obs.interactMessage, 'info');
    }
  }

  // --- QUEST & STORY PROGRESSION ---

  public checkQuestProgression() {
    const totalOrganized = this.books.filter((b) => b.isOrganized).length;

    // Quest 1: 5 books
    const q1 = this.quests.find((q) => q.id === 'quest-1');
    if (q1 && q1.status === 'active') {
      q1.currentCount = totalOrganized;
      if (totalOrganized >= 5) {
        q1.status = 'completed';
        this.completedQuestIds.push('quest-1');
        this.activeQuestId = 'quest-2';

        // Unlock key if not yet obtained
        if (!this.inventory.some((i) => i.id === 'key_history')) {
          this.inventory.push({
            id: 'key_history',
            name: 'Chave de Cobre da Ala de História',
            type: 'key',
            icon: '🗝️',
            description: 'Concedida por Eleanor ao organizar seus primeiros livros.',
          });
        }
        soundManager.playAreaCompletedFanfare();
        this.showToast('MISSÃO 1 CONCLUÍDA: Acesso à Ala de História!', 'success');
        this.startDialogue('eleanor-history-unlocked');
      }
    }

    // Quest 2: 12 books
    const q2 = this.quests.find((q) => q.id === 'quest-2');
    if (q2 && q2.status === 'active') {
      q2.currentCount = totalOrganized;
      if (totalOrganized >= 12) {
        q2.status = 'completed';
        this.completedQuestIds.push('quest-2');
        this.activeQuestId = 'quest-3';

        if (!this.inventory.some((i) => i.id === 'key_observatory')) {
          this.inventory.push({
            id: 'key_observatory',
            name: 'Chave Dourada do Observatório',
            type: 'key',
            icon: '🌙',
            description: 'Abre a cúpula celeste no topo da Ala de História.',
          });
        }
        soundManager.playAreaCompletedFanfare();
        this.showToast('MISSÃO 2 CONCLUÍDA: Chave do Observatório obtida!', 'success');
      }
    }

    // Quest 3: 22 books
    const q3 = this.quests.find((q) => q.id === 'quest-3');
    if (q3 && q3.status === 'active') {
      q3.currentCount = totalOrganized;
      if (totalOrganized >= 22) {
        q3.status = 'completed';
        this.completedQuestIds.push('quest-3');
        this.activeQuestId = 'quest-4';
        soundManager.playAreaCompletedFanfare();
        this.showToast('MISSÃO 3 CONCLUÍDA: A Biblioteca Proibida está acessível!', 'success');
      }
    }

    // Quest 4: 30 books (Ending)
    const q4 = this.quests.find((q) => q.id === 'quest-4');
    if (q4 && q4.status === 'active') {
      q4.currentCount = totalOrganized;
      if (totalOrganized >= 30) {
        q4.status = 'completed';
        this.completedQuestIds.push('quest-4');
        soundManager.playAreaCompletedFanfare();
        this.startDialogue('ending-dialog-1');
      }
    }
  }

  public checkRoomCompletion() {
    const currentRoomBooks = this.books.filter((b) => b.roomOrigin === this.currentRoomId);
    if (currentRoomBooks.length > 0 && currentRoomBooks.every((b) => b.isOrganized)) {
      if (!this.roomStars[this.currentRoomId]) {
        this.roomStars[this.currentRoomId] = 3; // ⭐⭐⭐ Bibliotecária Perfeita!
        const currentRoom = this.rooms[this.currentRoomId];
        this.roomCelebration = {
          title: `ÁREA CONCLUÍDA: ${currentRoom.name.toUpperCase()}!`,
          subtitle: '⭐⭐⭐ Avaliação: Bibliotecária Perfeita!',
          stars: 3,
        };
        soundManager.playAreaCompletedFanfare();
      }
    }
  }

  // --- DIALOGUE SYSTEM ---

  public startDialogue(dialogueId: string) {
    const node = DIALOGUES[dialogueId];
    if (!node) return;
    this.activeDialogue = node;
    soundManager.playDialogueBlip();
    this.onStateChange?.();
  }

  public advanceDialogue() {
    if (!this.activeDialogue) return;

    const current = this.activeDialogue;

    // Trigger dialogue actions
    if (current.action) {
      if (current.action.type === 'give_key' && current.action.payload) {
        const keyId = current.action.payload;
        if (!this.inventory.some((i) => i.id === keyId)) {
          this.inventory.push({
            id: keyId,
            name: 'Chave de Cobre da Ala de História',
            type: 'key',
            icon: '🗝️',
            description: 'Concedida por Eleanor para desbloquear novas alas.',
          });
          this.showToast('Você recebeu uma Chave!', 'success');
        }
      } else if (current.action.type === 'monologue' && current.action.payload) {
        this.triggerMonologue(current.action.payload);
      } else if (current.action.type === 'finish_game') {
        this.showToast('🎉 Parabéns! Você completou a jornada de Julia Fraga!', 'success');
      }
    }

    if (current.next) {
      const nextNode = DIALOGUES[current.next];
      if (nextNode) {
        this.activeDialogue = nextNode;
        soundManager.playDialogueBlip();
      } else {
        this.activeDialogue = null;
      }
    } else {
      this.activeDialogue = null;
    }

    this.onStateChange?.();
  }

  public triggerMonologue(text: string) {
    this.activeMonologue = text;
    this.monologueTimer = 4.5;
    this.onStateChange?.();
  }

  public triggerMiloMeow(text = 'Miau...') {
    soundManager.playMeow();
    this.milo.bubble = text;
    this.milo.bubbleTimer = 2.5;
  }

  public showToast(text: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastNotification = { text, type, timer: 3.5 };
    this.onStateChange?.();
  }

  private autoSave() {
    this.saveCurrentGame();
  }

  // --- FX PARTICLES ---

  private initDustParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.2,
        size: 1 + Math.random() * 2,
        alpha: 0.6,
        life: Math.random() * 6,
        maxLife: 6,
        color: '#fef08a',
        type: 'dust',
      });
    }
  }

  public createSparkleBurst(x: number, y: number, color: string, count = 20) {
    if (!this.particlesEnabled) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0.6 + Math.random() * 0.6,
        maxLife: 1.2,
        color,
        type: 'sparkle',
      });
    }
  }

  // --- RENDER PIPELINE ---

  public render(time: number) {
    const ctx = this.ctx;
    const room = this.rooms[this.currentRoomId] || this.rooms.main_hall;

    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);

    // Apply Camera transform
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. FLOOR TILES & BASE
    ctx.fillStyle = room.colorTheme || '#1e1b2e';
    ctx.fillRect(0, 0, room.width, room.height);

    // Wooden parquet / Stone floor grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const tileSize = 40;
    for (let x = 0; x < room.width; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, room.height);
      ctx.stroke();
    }
    for (let y = 0; y < room.height; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(room.width, y);
      ctx.stroke();
    }

    // 2. WALLS & BORDERS
    ctx.fillStyle = '#170f1c';
    for (const wall of room.walls) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeStyle = '#2d1b38';
      ctx.lineWidth = 3;
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    }

    // 3. DOORS & ARCHWAYS
    for (const door of room.doors) {
      ctx.fillStyle = door.locked ? '#831843' : '#065f46';
      ctx.fillRect(door.x, door.y, door.w, door.h);
      ctx.strokeStyle = door.locked ? '#f43f5e' : '#34d399';
      ctx.lineWidth = 2;
      ctx.strokeRect(door.x, door.y, door.w, door.h);

      // Door indicator glow
      ctx.fillStyle = door.locked ? '#f43f5e' : '#34d399';
      ctx.beginPath();
      ctx.arc(door.x + door.w / 2, door.y + door.h / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. ROOM OBSTACLES (Carpets, Desks, Statues, Clock, Cauldron, etc.)
    for (const obs of room.obstacles) {
      SpriteRenderer.renderObstacle(ctx, obs, time);
    }

    // 5. SHELVES
    const roomShelves = this.shelves.filter((s) => s.roomId === this.currentRoomId);
    for (const shelf of roomShelves) {
      SpriteRenderer.renderShelf(ctx, shelf, time);
    }

    // 6. BOOKS ON GROUND
    const roomBooks = this.books.filter((b) => b.roomOrigin === this.currentRoomId && !b.isOrganized && b.id !== this.player.heldBookId);
    for (const book of roomBooks) {
      SpriteRenderer.renderBookOnGround(ctx, book, time);
    }

    // 7. NPCS (Eleanor, Enzo, etc.)
    const roomNpcs = this.npcs.filter((n) => n.roomId === this.currentRoomId);
    for (const npc of roomNpcs) {
      if (npc.avatarType === 'eleanor') {
        SpriteRenderer.renderEleanor(ctx, npc, time);
      } else if (npc.avatarType === 'enzo') {
        SpriteRenderer.renderEnzo(ctx, npc, time);
      }
    }

    // 8. MILO (Companion Cat)
    SpriteRenderer.renderMilo(ctx, this.milo.x, this.milo.y, this.milo.direction, time);

    // Milo speech bubble
    if (this.milo.bubble) {
      ctx.fillStyle = 'rgba(15, 10, 25, 0.9)';
      ctx.beginPath();
      ctx.roundRect(this.milo.x - 24, this.milo.y - 28, 48, 16, 4);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#f3e8ff';
      ctx.font = 'bold 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.milo.bubble, this.milo.x, this.milo.y - 17);
    }

    // 9. JULIA FRAGA (Player)
    const heldBookObj = this.player.heldBookId ? this.books.find((b) => b.id === this.player.heldBookId) || null : null;
    SpriteRenderer.renderJulia(
      ctx,
      this.player.x,
      this.player.y,
      this.player.direction,
      this.player.isMoving,
      this.player.walkFrame,
      heldBookObj,
      this.player.isPlacing
    );

    // Julia Monologue thought bubble above head
    if (this.activeMonologue) {
      const bubbleW = Math.min(220, this.activeMonologue.length * 7 + 24);
      ctx.fillStyle = 'rgba(24, 18, 38, 0.92)';
      ctx.beginPath();
      ctx.roundRect(this.player.x - bubbleW / 2, this.player.y - 62, bubbleW, 26, 6);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tail
      ctx.fillStyle = 'rgba(24, 18, 38, 0.92)';
      ctx.beginPath();
      ctx.moveTo(this.player.x - 4, this.player.y - 36);
      ctx.lineTo(this.player.x + 4, this.player.y - 36);
      ctx.lineTo(this.player.x, this.player.y - 30);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.font = '10px Lora, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"${this.activeMonologue}"`, this.player.x, this.player.y - 45);
    }

    // 10. PARTICLES LAYER
    if (this.particlesEnabled) {
      for (const p of this.particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // 11. DYNAMIC LIGHTING & AMBIENT DARKNESS OVERLAY
    this.renderLightingOverlay(ctx, room, time);

    ctx.restore();
  }

  private renderLightingOverlay(ctx: CanvasRenderingContext2D, room: Room, time: number) {
    // We create dynamic candlelights & torches with realistic flickering
    const lightCanvas = document.createElement('canvas');
    lightCanvas.width = this.width;
    lightCanvas.height = this.height;
    const lCtx = lightCanvas.getContext('2d');
    if (!lCtx) return;

    // Ambient darkness layer
    const darkness = 1 - (room.ambientLight || 0.8);
    lCtx.fillStyle = `rgba(8, 4, 14, ${Math.max(0.2, darkness)})`;
    lCtx.fillRect(0, 0, this.width, this.height);

    // Cut out light around Julia
    lCtx.globalCompositeOperation = 'destination-out';
    const pScreenX = this.player.x - this.camera.x;
    const pScreenY = this.player.y - this.camera.y;

    const juliaGrad = lCtx.createRadialGradient(pScreenX, pScreenY, 15, pScreenX, pScreenY, 150);
    juliaGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    juliaGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
    juliaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    lCtx.fillStyle = juliaGrad;
    lCtx.beginPath();
    lCtx.arc(pScreenX, pScreenY, 150, 0, Math.PI * 2);
    lCtx.fill();

    // Cut out light around room torches
    for (const torch of room.torches) {
      const tScreenX = torch.x - this.camera.x;
      const tScreenY = torch.y - this.camera.y;
      const flicker = Math.sin(time * 0.008 + torch.x) * 6;
      const radius = torch.radius + flicker;

      const tGrad = lCtx.createRadialGradient(tScreenX, tScreenY, 10, tScreenX, tScreenY, radius);
      tGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      tGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0.5)');
      tGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lCtx.fillStyle = tGrad;
      lCtx.beginPath();
      lCtx.arc(tScreenX, tScreenY, radius, 0, Math.PI * 2);
      lCtx.fill();
    }

    // Blend darkness onto main game canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Screen space
    ctx.drawImage(lightCanvas, 0, 0);
    ctx.restore();
  }

  // --- MATH HELPERS ---
  private rectsIntersect(
    r1: { x: number; y: number; w: number; h: number },
    r2: { x: number; y: number; w: number; h: number }
  ): boolean {
    return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
  }
}
