import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_ID_KEY = '@jadzan/screen_id';

interface DeviceStore {
  screenId: string | null;
  mosqueId: string | null;
  isConfigured: boolean;
  isLoading: boolean;
  // Actions
  loadFromStorage: () => Promise<void>;
  setScreenId: (id: string) => Promise<void>;
  setMosqueId: (id: string) => void;
  clearDevice: () => Promise<void>;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  screenId: null,
  mosqueId: null,
  isConfigured: false,
  isLoading: true,

  loadFromStorage: async () => {
    try {
      const screenId = await AsyncStorage.getItem(SCREEN_ID_KEY);
      set({
        screenId,
        isConfigured: screenId !== null,
        isLoading: false,
      });
    } catch (err) {
      console.warn('[deviceStore] Failed to load from storage:', err);
      set({ isLoading: false });
    }
  },

  setScreenId: async (id: string) => {
    try {
      await AsyncStorage.setItem(SCREEN_ID_KEY, id);
      set({ screenId: id, isConfigured: true });
    } catch (err) {
      console.warn('[deviceStore] Failed to persist screenId:', err);
    }
  },

  setMosqueId: (id: string) => set({ mosqueId: id }),

  clearDevice: async () => {
    try {
      await AsyncStorage.removeItem(SCREEN_ID_KEY);
      set({ screenId: null, mosqueId: null, isConfigured: false });
    } catch (err) {
      console.warn('[deviceStore] Failed to clear device:', err);
    }
  },
}));
