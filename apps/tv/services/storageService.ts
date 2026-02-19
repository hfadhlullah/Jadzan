import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_ID_KEY  = '@jadzan/screen_id';
const MOSQUE_ID_KEY  = '@jadzan/mosque_id';

export const storageService = {
  async getScreenId(): Promise<string | null> {
    return AsyncStorage.getItem(SCREEN_ID_KEY);
  },

  async setScreenId(id: string): Promise<void> {
    await AsyncStorage.setItem(SCREEN_ID_KEY, id);
  },

  async getMosqueId(): Promise<string | null> {
    return AsyncStorage.getItem(MOSQUE_ID_KEY);
  },

  async setMosqueId(id: string): Promise<void> {
    await AsyncStorage.setItem(MOSQUE_ID_KEY, id);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([SCREEN_ID_KEY, MOSQUE_ID_KEY]);
  },
};
