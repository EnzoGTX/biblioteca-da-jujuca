import { GameSaveData } from '../types/game';

const SAVE_KEY = 'julia_fraga_biblioteca_save_v1';

export class SaveManager {
  public static hasSave(): boolean {
    try {
      return !!localStorage.getItem(SAVE_KEY);
    } catch {
      return false;
    }
  }

  public static saveGame(data: GameSaveData): boolean {
    try {
      const payload: GameSaveData = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('Error saving game to localStorage:', err);
      return false;
    }
  }

  public static loadGame(): GameSaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameSaveData;
      if (!parsed.version || !parsed.player) return null;
      return parsed;
    } catch (err) {
      console.error('Error loading game from localStorage:', err);
      return null;
    }
  }

  public static deleteSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (err) {
      console.error('Error deleting save:', err);
    }
  }
}
