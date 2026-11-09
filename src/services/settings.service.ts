import { DEFAULT_SETTINGS } from "@/mocks/mockSettingsData";
import type { AppSettings } from "@/types/settings";

const STORAGE_KEY = "ceciz_admin_settings_v1";

class SettingsService {
  private settings: AppSettings;

  constructor() {
    this.settings = this.loadInitialSettings();
  }

  private loadInitialSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback if localStorage is disabled or corrupted
    }
    return { ...DEFAULT_SETTINGS };
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(patch: Partial<AppSettings>): AppSettings {
    this.settings = {
      ...this.settings,
      ...patch,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
    return { ...this.settings };
  }

  updateSection<K extends keyof AppSettings>(
    section: K,
    data: AppSettings[K],
  ): AppSettings {
    this.settings = {
      ...this.settings,
      [section]: data,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
    return { ...this.settings };
  }

  resetToDefault(): AppSettings {
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    return { ...this.settings };
  }
}

export const settingsService = new SettingsService();
export default settingsService;
