import { create } from 'zustand';
import { UserDto } from '@nightpass/types';

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  setAuth: (user: UserDto) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user) => {
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
