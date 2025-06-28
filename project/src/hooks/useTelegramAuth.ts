import { create } from 'zustand';

interface TelegramUser {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

interface TelegramAuthState {
  isAuthenticated: boolean;
  telegramUser: TelegramUser | null;
  login: (user: TelegramUser) => void;
  logout: () => void;
}

export const useTelegramAuth = create<TelegramAuthState>((set) => ({
  isAuthenticated: false,
  telegramUser: null,
  login: (user) => set({ isAuthenticated: true, telegramUser: user }),
  logout: () => set({ isAuthenticated: false, telegramUser: null }),
}));