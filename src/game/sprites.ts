import { Book, Direction, NPC, Shelf } from '../types/game';
import { CATEGORY_COLORS } from './constants';

export class SpriteRenderer {
  // Render Julia Fraga
  public static renderJulia(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    direction: Direction,
    isMoving: boolean,
    walkFrame: number,
    heldBook: Book | null,
    isPlacing: boolean
  ) {
    ctx.save();
    ctx.translate(x, y);

    const bob = isMoving ? Math.sin(walkFrame * 8) * 2.5 : Math.sin(Date.now() * 0.003) * 1;
    const legOffset = isMoving ? Math.sin(walkFrame * 8) * 5 : 0;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. LEGS & BOOTS
    ctx.fillStyle = '#451a03'; // Dark brown leather boots
    if (direction === 'left' || direction === 'right') {
      ctx.fillRect(-6 + legOffset, 10, 5, 8);
      ctx.fillRect(2 - legOffset, 10, 5, 8);
    } else {
      ctx.fillRect(-7 + legOffset, 10, 5, 8);
      ctx.fillRect(2 - legOffset, 10, 5, 8);
    }

    // 2. SKIRT / PANTS
    ctx.fillStyle = '#312e81'; // Deep indigo adventurer skirt/trousers
    ctx.beginPath();
    ctx.roundRect(-8, 3 + bob, 16, 9, [2, 2, 4, 4]);
    ctx.fill();

    // 3. TORSO & VEST
    // Cream adventurer blouse
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(-7, -10 + bob, 14, 14, [4, 4, 2, 2]);
    ctx.fill();

    // Purple librarian vest
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.roundRect(-8, -10 + bob, 4, 13, [2, 0, 0, 2]);
    ctx.roundRect(4, -10 + bob, 4, 13, [0, 2, 2, 0]);
    ctx.fill();

    // Golden waist belt with buckle
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-7, 1 + bob, 14, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2, 0.5 + bob, 4, 4);

    // Hip Grimoire / Satchel
    ctx.fillStyle = '#78350f';
    ctx.fillRect(6, -1 + bob, 4, 6);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(6.5, 0 + bob, 3, 4); // Purple bookmark ribbon

    // 4. BACKPACK (if facing up or side)
    if (direction === 'up' || direction === 'left' || direction === 'right') {
      ctx.fillStyle = '#92400e';
      const bpX = direction === 'up' ? -6 : direction === 'left' ? 2 : -7;
      ctx.beginPath();
      ctx.roundRect(bpX, -8 + bob, 6, 9, 2);
      ctx.fill();
    }

    // 5. HEAD & HAIR
    const headY = -18 + bob;

    // Face / Skin tone
    ctx.fillStyle = '#fed7aa'; // Warm light peach skin
    ctx.beginPath();
    ctx.arc(0, headY + 2, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Warm chestnut brown hair
    ctx.fillStyle = '#451a03';

    if (direction === 'down') {
      // Hair top + bangs
      ctx.beginPath();
      ctx.arc(0, headY - 1, 8.5, Math.PI, Math.PI * 2);
      ctx.fill();
      // Bangs
      ctx.fillRect(-7, headY - 3, 14, 4);
      // Side strands
      ctx.fillRect(-8, headY - 1, 3, 9);
      ctx.fillRect(5, headY - 1, 3, 9);
      // Eyes (brown/amber)
      ctx.fillStyle = '#292524';
      ctx.fillRect(-4, headY + 1, 2.5, 3);
      ctx.fillRect(1.5, headY + 1, 2.5, 3);
      // Eye highlights
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, headY + 1, 1, 1);
      ctx.fillRect(1.5, headY + 1, 1, 1);
      // Subtle smile
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(-1.5, headY + 5, 3, 1);
      // Purple ribbon accessory in hair
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(4, headY - 6, 4, 3);
    } else if (direction === 'up') {
      // Back of head full hair & ponytail
      ctx.beginPath();
      ctx.arc(0, headY, 9, 0, Math.PI * 2);
      ctx.fill();
      // Ponytail with purple ribbon
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(-2, headY - 8, 4, 3);
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(0, headY - 10, 4, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (direction === 'left') {
      ctx.beginPath();
      ctx.arc(1, headY - 1, 8.5, 0, Math.PI * 2);
      ctx.fill();
      // Side profile face
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-6, headY - 1, 6, 7);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-7, headY - 3, 8, 3); // Bangs
      ctx.fillRect(1, headY - 2, 4, 9); // Back hair
      // Left eye
      ctx.fillStyle = '#292524';
      ctx.fillRect(-4.5, headY + 1, 2, 3);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(1, headY - 6, 3, 3);
    } else if (direction === 'right') {
      ctx.beginPath();
      ctx.arc(-1, headY - 1, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(0, headY - 1, 6, 7);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-1, headY - 3, 8, 3);
      ctx.fillRect(-5, headY - 2, 4, 9);
      ctx.fillStyle = '#292524';
      ctx.fillRect(2.5, headY + 1, 2, 3);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-4, headY - 6, 3, 3);
    }

    // 6. ARMS & HELD BOOK
    if (heldBook) {
      const bookY = isPlacing ? -18 + bob : -2 + bob;
      const catColor = CATEGORY_COLORS[heldBook.category] || { bg: '#8b5cf6', border: '#c084fc', glow: '#a855f7' };

      // Magical glow behind book
      ctx.shadowColor = catColor.border;
      ctx.shadowBlur = 10;

      // Book cover
      ctx.fillStyle = heldBook.color || catColor.bg;
      ctx.strokeStyle = catColor.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-8, bookY, 16, 12, 2);
      ctx.fill();
      ctx.stroke();

      // Pages & bookmark
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(-6, bookY + 2, 12, 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-1, bookY + 3, 2, 7);

      // Julia's hands holding book
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(-7, bookY + 6, 2.5, 0, Math.PI * 2);
      ctx.arc(7, bookY + 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Normal arms swinging
      ctx.fillStyle = '#fed7aa';
      const armSwing = isMoving ? Math.cos(walkFrame * 8) * 3 : 0;
      ctx.beginPath();
      ctx.arc(-8, -4 + bob + armSwing, 2.5, 0, Math.PI * 2);
      ctx.arc(8, -4 + bob - armSwing, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Render Eleanor (Ghost Librarian)
  public static renderEleanor(ctx: CanvasRenderingContext2D, npc: NPC, time: number) {
    ctx.save();
    ctx.translate(npc.x, npc.y);

    const floatOffset = Math.sin(time * 0.003) * 6;

    // Ghostly cyan aura glow
    const glowGrad = ctx.createRadialGradient(0, -10 + floatOffset, 5, 0, -10 + floatOffset, 36);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    glowGrad.addColorStop(0.7, 'rgba(147, 197, 253, 0.15)');
    glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, -10 + floatOffset, 36, 0, Math.PI * 2);
    ctx.fill();

    // Semi-transparent ghost body
    ctx.globalAlpha = 0.78 + Math.sin(time * 0.004) * 0.12;

    // Victorian ghostly gown
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.moveTo(-10, -5 + floatOffset);
    ctx.lineTo(10, -5 + floatOffset);
    ctx.lineTo(14, 22 + floatOffset);
    // Wavy ghost tail bottom
    ctx.quadraticCurveTo(7, 28 + floatOffset + Math.sin(time * 0.006) * 3, 0, 22 + floatOffset);
    ctx.quadraticCurveTo(-7, 28 + floatOffset - Math.sin(time * 0.006) * 3, -14, 22 + floatOffset);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(0, -16 + floatOffset, 8, 0, Math.PI * 2);
    ctx.fill();

    // Flowing ethereal hair
    ctx.fillStyle = '#7dd3fc';
    ctx.beginPath();
    ctx.arc(0, -18 + floatOffset, 9.5, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.fillRect(-9, -16 + floatOffset, 4, 14);
    ctx.fillRect(5, -16 + floatOffset, 4, 14);

    // Serene eyes & smile
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-4, -15 + floatOffset, 2, 2);
    ctx.fillRect(2, -15 + floatOffset, 2, 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-1.5, -12 + floatOffset, 3, 1);

    // Glowing ghostly book in Eleanor's hands
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -4 + floatOffset, 12, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -2 + floatOffset, 8, 1);

    ctx.restore();
  }

  // Render Enzo Amorzin da Julia (Charismatic Indie 2D Fantasy NPC)
  public static renderEnzo(ctx: CanvasRenderingContext2D, npc: NPC, time: number) {
    ctx.save();
    ctx.translate(npc.x, npc.y);

    const bob = Math.sin(time * 0.003) * 1.5;
    const isBlinking = Math.sin(time * 0.0018) > 0.94;

    // 1. WARM SOFT ROMANTIC GLOW & SHADOW
    const auraGrad = ctx.createRadialGradient(0, 4, 6, 0, 4, 38);
    auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
    auraGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.15)');
    auraGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 4, 38, 0, Math.PI * 2);
    ctx.fill();

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. LEGS & POLISHED BOOTS
    ctx.fillStyle = '#1c1917'; // Dark polished boots
    ctx.fillRect(-7, 10, 6, 10);
    ctx.fillRect(2, 10, 6, 10);
    // Gold boot buckles
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-6, 14, 4, 1.5);
    ctx.fillRect(3, 14, 4, 1.5);

    // 3. TAILORED TROUSERS
    ctx.fillStyle = '#1e1b4b'; // Midnight indigo
    ctx.beginPath();
    ctx.roundRect(-8, 3 + bob, 17, 10, [2, 2, 3, 3]);
    ctx.fill();

    // 4. IVORY SHIRT & RUBY VELVET DOUBLET/VEST
    // Ivory shirt base
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(-8, -11 + bob, 17, 16, [4, 4, 2, 2]);
    ctx.fill();

    // Ruby velvet vest
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.roundRect(-9, -11 + bob, 5.5, 15, [3, 0, 0, 3]);
    ctx.roundRect(3.5, -11 + bob, 5.5, 15, [0, 3, 3, 0]);
    ctx.fill();

    // Gold filigree embroidery & buttons
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-9, -11 + bob, 1.5, 15);
    ctx.fillRect(7.5, -11 + bob, 1.5, 15);
    ctx.fillRect(-1.5, -6 + bob, 3, 2);
    ctx.fillRect(-1.5, -2 + bob, 3, 2);

    // Leather belt with gold buckle
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-8, 2 + bob, 17, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2.5, 1.5 + bob, 5, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-1, 2.5 + bob, 2, 2);

    // 5. HANDS HOLDING ENCHANTED ROSE
    // Ivory ruffled sleeves
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-10, -3 + bob, 3, 7);
    ctx.fillRect(7, -3 + bob, 3, 7);
    // Hands
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(-2, 1 + bob, 2.5, 0, Math.PI * 2);
    ctx.arc(2, 1 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Delicate enchanted rose with green stem
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 4 + bob);
    ctx.lineTo(2, -4 + bob);
    ctx.stroke();

    // Rose blossom
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(2, -6 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.arc(1.5, -7 + bob, 2, 0, Math.PI * 2);
    ctx.fill();

    // 6. HEAD, EXPRESSIVE FACE & STYLISH HAIR
    const headY = -19 + bob;

    // Face / Skin tone
    ctx.fillStyle = '#fed7aa'; // Warm light peach skin
    ctx.beginPath();
    ctx.arc(0, headY + 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush
    ctx.fillStyle = 'rgba(251, 113, 133, 0.45)';
    ctx.beginPath();
    ctx.arc(-5, headY + 4, 2, 0, Math.PI * 2);
    ctx.arc(5, headY + 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Handsome dark hair & side strands
    ctx.fillStyle = '#1c1917'; // Rich dark brown/black hair
    ctx.beginPath();
    ctx.arc(0, headY - 1, 9, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Stylish layered bangs
    ctx.beginPath();
    ctx.moveTo(-8, headY - 2);
    ctx.lineTo(-4, headY + 2);
    ctx.lineTo(-1, headY - 3);
    ctx.lineTo(3, headY + 1);
    ctx.lineTo(7, headY - 2);
    ctx.lineTo(8, headY - 8);
    ctx.lineTo(-8, headY - 8);
    ctx.closePath();
    ctx.fill();

    // Hair highlights
    ctx.fillStyle = '#44403c';
    ctx.fillRect(-3, headY - 6, 6, 1.5);

    // Expressive kind eyes (Blinking animation)
    if (isBlinking) {
      // Closed happy curved eye lines
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-4, headY + 2, 2, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(3, headY + 2, 2, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    } else {
      // Warm dark expressive eyes
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(-5, headY + 1, 2.5, 3);
      ctx.fillRect(2.5, headY + 1, 2.5, 3);
      // Eye sparkle highlights
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, headY + 1, 1, 1);
      ctx.fillRect(2.5, headY + 1, 1, 1);
    }

    // Charming loving smile
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(0, headY + 5, 2.5, 0, Math.PI);
    ctx.fill();

    // 7. AMBIENT FLOATING ROMANTIC PARTICLES / HEARTS
    const p1Y = ((time * 0.02) % 30);
    const p1X = Math.sin(time * 0.004) * 14 - 12;
    const p2Y = (((time + 800) * 0.018) % 35);
    const p2X = Math.cos(time * 0.005) * 14 + 12;

    // Small floating heart 1
    ctx.fillStyle = `rgba(244, 63, 94, ${Math.max(0, 1 - p1Y / 30)})`;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('❤️', p1X, -10 - p1Y);

    // Small glowing sparkle 2
    ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0, 1 - p2Y / 35)})`;
    ctx.font = '9px sans-serif';
    ctx.fillText('✨', p2X, -8 - p2Y);

    // Subtle gentle nameplate indicator
    ctx.fillStyle = 'rgba(15, 10, 25, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-42, -36 + bob, 84, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffe4e6';
    ctx.font = 'bold 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Enzo Amorzin da Julia ❤️', 0, -26 + bob);

    ctx.restore();
  }

  // Render Milo (Magical Companion Cat)
  public static renderMilo(ctx: CanvasRenderingContext2D, x: number, y: number, direction: Direction, time: number) {
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(time * 0.006) * 1.5;
    const tailAngle = Math.sin(time * 0.008) * 0.4;

    // Milo Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 8, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (curved purple tail with glow tip)
    ctx.save();
    ctx.translate(direction === 'left' ? 6 : -6, 2 + bob);
    ctx.rotate(tailAngle);
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-4, -8, 2, -12);
    ctx.stroke();
    // Tail tip sparkle
    ctx.fillStyle = '#e879f9';
    ctx.beginPath();
    ctx.arc(2, -12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body (purple fur)
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.ellipse(0, 3 + bob, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#9333ea';
    ctx.beginPath();
    ctx.arc(0, -4 + bob, 7, 0, Math.PI * 2);
    ctx.fill();

    // Big cute magical ears
    ctx.fillStyle = '#6b21a8';
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-6, -6 + bob);
    ctx.lineTo(-9, -14 + bob);
    ctx.lineTo(-2, -8 + bob);
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(2, -8 + bob);
    ctx.lineTo(9, -14 + bob);
    ctx.lineTo(6, -6 + bob);
    ctx.fill();

    // Inner pink ears
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-5, -6 + bob);
    ctx.lineTo(-7, -11 + bob);
    ctx.lineTo(-3, -7 + bob);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(3, -7 + bob);
    ctx.lineTo(7, -11 + bob);
    ctx.lineTo(5, -6 + bob);
    ctx.fill();

    // Glowing cyan/golden magical eyes
    ctx.fillStyle = '#38bdf8';
    if (direction === 'left') {
      ctx.fillRect(-5, -5 + bob, 2.5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -5 + bob, 1, 1);
    } else if (direction === 'right') {
      ctx.fillRect(2.5, -5 + bob, 2.5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3.5, -5 + bob, 1, 1);
    } else {
      ctx.fillRect(-4, -5 + bob, 2.5, 3);
      ctx.fillRect(1.5, -5 + bob, 2.5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -5 + bob, 1, 1);
      ctx.fillRect(1.5, -5 + bob, 1, 1);
    }

    // Little cute nose
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-0.75, -2 + bob, 1.5, 1);

    ctx.restore();
  }

  // Render Bookshelf with dynamic placed books
  public static renderShelf(ctx: CanvasRenderingContext2D, shelf: Shelf, time: number) {
    ctx.save();
    ctx.translate(shelf.x, shelf.y);

    const catColor = CATEGORY_COLORS[shelf.category] || { bg: '#854d0e', border: '#eab308', glow: 'rgba(234,179,8,0.4)', text: '#fff' };

    // Shelf drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(4, shelf.height, shelf.width - 8, 8);

    // Ornate wood frame
    ctx.fillStyle = '#3b1d11'; // Dark mahogany
    ctx.fillRect(0, 0, shelf.width, shelf.height);

    // Inner back panel
    ctx.fillStyle = '#24120a';
    ctx.fillRect(4, 4, shelf.width - 8, shelf.height - 8);

    // Shelf dividers (2 tiers)
    ctx.fillStyle = '#5c2c16';
    ctx.fillRect(4, shelf.height / 2 - 2, shelf.width - 8, 4);

    // Render placed books along bottom & top shelves
    const count = shelf.placedBookIds.length;
    const totalSlots = shelf.maxCapacity;

    for (let i = 0; i < totalSlots; i++) {
      const isPlaced = i < count;
      const slotX = 12 + i * ((shelf.width - 24) / totalSlots);

      if (isPlaced) {
        // Render rich book spine
        ctx.fillStyle = catColor.bg;
        ctx.strokeStyle = catColor.border;
        ctx.lineWidth = 1;
        ctx.fillRect(slotX, 8, 14, shelf.height - 16);
        ctx.strokeRect(slotX, 8, 14, shelf.height - 16);

        // Gold lettering lines on spine
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(slotX + 2, 14, 10, 2);
        ctx.fillRect(slotX + 2, 20, 8, 1.5);
      } else {
        // Empty slot shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(slotX, 12, 12, shelf.height - 20);
      }
    }

    // Glowing category insignia badge in center
    ctx.shadowColor = catColor.border;
    ctx.shadowBlur = 12;
    ctx.fillStyle = catColor.bg;
    ctx.strokeStyle = catColor.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shelf.width / 2, -4, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Symbol icon
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shelf.symbol, shelf.width / 2, -4);

    // Category label banner
    ctx.fillStyle = 'rgba(15, 10, 25, 0.85)';
    ctx.beginPath();
    ctx.roundRect(shelf.width / 2 - 40, shelf.height + 2, 80, 16, 4);
    ctx.fill();
    ctx.strokeStyle = catColor.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = catColor.text;
    ctx.font = 'bold 9px Outfit, sans-serif';
    ctx.fillText(`${shelf.category} (${count}/${totalSlots})`, shelf.width / 2, shelf.height + 10);

    ctx.restore();
  }

  // Render Book on Ground / Pedestal
  public static renderBookOnGround(ctx: CanvasRenderingContext2D, book: Book, time: number) {
    ctx.save();
    ctx.translate(book.x, book.y);

    const catColor = CATEGORY_COLORS[book.category] || { bg: '#8b5cf6', border: '#a855f7', glow: 'rgba(168,85,247,0.4)', text: '#fff' };

    // Floating or living animations
    let bob = 0;
    if (book.isSpecial === 'floating') {
      bob = Math.sin(time * 0.005) * 8 - 4;
    } else if (book.isSpecial === 'living') {
      bob = Math.abs(Math.sin(time * 0.008)) * -6;
    } else {
      bob = Math.sin(time * 0.003) * 2;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Magical glow around special books
    if (book.isSpecial) {
      ctx.shadowColor = book.isSpecial === 'forbidden' ? '#7e22ce' : catColor.border;
      ctx.shadowBlur = 14;
    }

    // Book base
    ctx.fillStyle = book.color || catColor.bg;
    ctx.strokeStyle = catColor.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, -6 + bob, 20, 15, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pages edge
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-8, -4 + bob, 16, 2.5);

    // Book emblem
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(book.icon, 0, 2 + bob);

    // Living book little curious eyes
    if (book.isSpecial === 'living') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -1 + bob, 2.5, 2.5);
      ctx.fillRect(1.5, -1 + bob, 2.5, 2.5);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-3.5, -0.5 + bob, 1.5, 1.5);
      ctx.fillRect(2, -0.5 + bob, 1.5, 1.5);
    }

    ctx.restore();
  }

  // Render Obstacle (Furniture, Desks, Grandfather Clock, Telescope, etc.)
  public static renderObstacle(
    ctx: CanvasRenderingContext2D,
    obs: {
      id: string;
      type: string;
      x: number;
      y: number;
      w: number;
      h: number;
      color?: string;
      name?: string;
    },
    time: number
  ) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    if (obs.type === 'carpet') {
      // Ornate ornate Persian / Aetherian rug
      ctx.fillStyle = obs.color || '#581c87';
      ctx.fillRect(0, 0, obs.w, obs.h);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, obs.w - 12, obs.h - 12);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(14, 14, obs.w - 28, obs.h - 28);
    } else if (obs.type === 'counter' || obs.type === 'desk') {
      // Heavy oak mahogany desk
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(4, obs.h, obs.w - 8, 6);
      ctx.fillStyle = obs.color || '#451a03';
      ctx.beginPath();
      ctx.roundRect(0, 0, obs.w, obs.h, 4);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top surface grain
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 4, obs.w - 8, obs.h - 12);

      // Quill & inkpot on desk
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(obs.w - 20, 14, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(obs.w - 20, 14);
      ctx.lineTo(obs.w - 14, 4);
      ctx.stroke();
    } else if (obs.type === 'table') {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(2, obs.h, obs.w - 4, 5);
      ctx.fillStyle = obs.color || '#78350f';
      ctx.beginPath();
      ctx.roundRect(0, 0, obs.w, obs.h, 3);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.fillRect(3, 3, obs.w - 6, obs.h - 8);
    } else if (obs.type === 'clock') {
      // Grandfather clock
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(4, obs.h, obs.w - 8, 6);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, 0, obs.w, obs.h);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, obs.w, obs.h);

      // Clock face
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(obs.w / 2, 24, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.stroke();

      // Hands stopped at 03:17
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(obs.w / 2, 24);
      ctx.lineTo(obs.w / 2 + 7, 24); // 3 o'clock
      ctx.moveTo(obs.w / 2, 24);
      ctx.lineTo(obs.w / 2 + 5, 24 + 6); // ~17 min
      ctx.stroke();

      // Glass cabinet & pendulum
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(8, 44, obs.w - 16, obs.h - 52);
      const pendulumAngle = Math.sin(time * 0.003) * 0.15;
      ctx.save();
      ctx.translate(obs.w / 2, 46);
      ctx.rotate(pendulumAngle);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 20);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 20, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (obs.type === 'telescope') {
      // Celestial telescope in observatory
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(obs.w / 2, obs.h - 10, 40, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tripod legs
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(obs.w / 2, obs.h / 2);
      ctx.lineTo(obs.w / 2 - 35, obs.h - 10);
      ctx.moveTo(obs.w / 2, obs.h / 2);
      ctx.lineTo(obs.w / 2 + 35, obs.h - 10);
      ctx.moveTo(obs.w / 2, obs.h / 2);
      ctx.lineTo(obs.w / 2, obs.h - 6);
      ctx.stroke();

      // Brass body tube angled to the stars
      ctx.save();
      ctx.translate(obs.w / 2, obs.h / 2 - 10);
      ctx.rotate(-0.5 + Math.sin(time * 0.001) * 0.04);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-40, -10, 80, 20, 4);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Glass lens reflection
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(40, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (obs.type === 'crystal') {
      // Floating pulsing crystal cluster
      const floatY = Math.sin(time * 0.004) * 5;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.beginPath();
      ctx.ellipse(obs.w / 2, obs.h - 5, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(obs.w / 2, obs.h / 2 + floatY);
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(16, 0);
      ctx.lineTo(0, 28);
      ctx.lineTo(-16, 0);
      ctx.closePath();
      ctx.fill();
      // Highlights
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(16, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (obs.type === 'cauldron') {
      // Magic brewing cauldron with rising bubbles
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h / 2, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Liquid glow
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h / 2, 20, 0, Math.PI * 2);
      ctx.fill();

      // Bubble
      const bY = (time * 0.03) % 15;
      ctx.fillStyle = '#a7f3d0';
      ctx.beginPath();
      ctx.arc(obs.w / 2 + Math.sin(time * 0.01) * 6, obs.h / 2 - bY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'plant') {
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(4, obs.h - 16, obs.w - 8, 16, [0, 0, 4, 4]);
      ctx.fill();
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h - 22, 16, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'window') {
      // Arched Stained Glass / Sunny Garden Window
      ctx.fillStyle = '#451a03'; // Stone / wooden frame
      ctx.beginPath();
      ctx.roundRect(0, 0, obs.w, obs.h, [obs.w / 2, obs.w / 2, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glowing glass pane
      const winGrad = ctx.createLinearGradient(0, 0, 0, obs.h);
      winGrad.addColorStop(0, obs.color || '#fef08a');
      winGrad.addColorStop(0.5, '#fde047');
      winGrad.addColorStop(1, '#ca8a04');
      ctx.fillStyle = winGrad;
      ctx.beginPath();
      ctx.roundRect(4, 4, obs.w - 8, obs.h - 8, [obs.w / 2 - 4, obs.w / 2 - 4, 2, 2]);
      ctx.fill();

      // Window mullions & cross panes
      ctx.strokeStyle = 'rgba(69, 26, 3, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(obs.w / 2, 4);
      ctx.lineTo(obs.w / 2, obs.h - 4);
      ctx.moveTo(4, obs.h / 2);
      ctx.lineTo(obs.w - 4, obs.h / 2);
      ctx.stroke();

      // Sunbeam rays
      ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.lineTo(obs.w - 4, 4);
      ctx.lineTo(obs.w + 20, obs.h + 30);
      ctx.lineTo(-20, obs.h + 30);
      ctx.closePath();
      ctx.fill();
    } else if (obs.type === 'candles') {
      // Candelabrum with flickering warm flame
      ctx.fillStyle = '#d97706'; // Brass stand
      ctx.fillRect(obs.w / 2 - 2, obs.h - 12, 4, 12);
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h - 2, 8, 0, Math.PI);
      ctx.fill();

      // Candle wax
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(obs.w / 2 - 8, obs.h - 22, 4, 12);
      ctx.fillRect(obs.w / 2 - 2, obs.h - 26, 4, 16);
      ctx.fillRect(obs.w / 2 + 4, obs.h - 22, 4, 12);

      // Flickering flame
      const f1 = Math.sin(time * 0.015) * 1.5;
      const f2 = Math.cos(time * 0.018) * 1.5;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h - 28 + f1, 3.5, 0, Math.PI * 2);
      ctx.arc(obs.w / 2 - 6, obs.h - 24 + f2, 3, 0, Math.PI * 2);
      ctx.arc(obs.w / 2 + 6, obs.h - 24 + f1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(obs.w / 2, obs.h - 28 + f1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'statue') {
      ctx.fillStyle = '#78716c';
      ctx.fillRect(8, obs.h - 16, obs.w - 16, 16);
      ctx.fillStyle = '#a8a29e';
      ctx.beginPath();
      ctx.roundRect(14, 10, obs.w - 28, obs.h - 26, 4);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(obs.w / 2, 20, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
